"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import {
  BROW_STYLES,
  densityAlpha,
  densityStroke,
  type BrowStyle,
} from "@/lib/brow-styles";
import { useI18n } from "@/lib/i18n";

/* ──────────────────────────────────────────────
   MediaPipe FaceLandmarker — index ranges
   for the two eyebrows (478-landmark model).
   ────────────────────────────────────────────── */
// Viewer-left brow (subject's right eyebrow)
const LEFT_BROW = [70, 63, 105, 66, 107, 55, 65, 52, 53, 46];
// Viewer-right brow (subject's left eyebrow)
const RIGHT_BROW = [336, 296, 334, 293, 300, 285, 295, 282, 283, 276];

const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
const WASM_BASE =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";

type LandmarkPoint = { x: number; y: number; z?: number };

type LandmarkerStatus = "idle" | "loading" | "ready" | "error";
type Step = "upload" | "detecting" | "editor" | "noface";

interface BrowRegion {
  cx: number; // bounding box centre x in image pixels
  cy: number;
  width: number; // bounding box width in image pixels
  height: number;
  rotation: number; // radians — slope of the brow
}

interface EditorControls {
  thickness: number; // 0.5 - 2.0
  intensity: number; // 0 - 1
  arch: number; // -10 - +10 px vertical offset
}

/* ──────────────────────────────────────────────
   Geometry helpers
   ────────────────────────────────────────────── */
function regionFromLandmarks(
  points: LandmarkPoint[],
  indices: number[],
  imgW: number,
  imgH: number,
): BrowRegion | null {
  const xs: number[] = [];
  const ys: number[] = [];
  for (const idx of indices) {
    const p = points[idx];
    if (!p) return null;
    xs.push(p.x * imgW);
    ys.push(p.y * imgH);
  }
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const rawW = maxX - minX;
  const rawH = maxY - minY;
  // Pad horizontally ~10%, vertically more aggressively so the brow shape
  // has room to render above and below the bony landmarks.
  const padX = rawW * 0.12;
  const padY = Math.max(rawH * 0.9, rawW * 0.18);

  // Estimate slope by fitting a line between the inner-most and outer-most
  // landmark points (sort by x).
  const sorted = indices
    .map((idx) => points[idx])
    .filter((p): p is LandmarkPoint => !!p)
    .sort((a, b) => a.x - b.x);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  let rotation = 0;
  if (first && last) {
    rotation = Math.atan2(
      (last.y - first.y) * imgH,
      (last.x - first.x) * imgW,
    );
  }

  return {
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
    width: rawW + padX * 2,
    height: rawH + padY * 2,
    rotation,
  };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const v = hex.replace("#", "");
  return {
    r: parseInt(v.substring(0, 2), 16),
    g: parseInt(v.substring(2, 4), 16),
    b: parseInt(v.substring(4, 6), 16),
  };
}

/* ──────────────────────────────────────────────
   Drawing — paints one brow into an offscreen
   canvas using the SVG path data, then composites
   it onto the main canvas with the right
   translation, rotation, and scale.
   ────────────────────────────────────────────── */
function drawBrowOnto(
  ctx: CanvasRenderingContext2D,
  region: BrowRegion,
  style: BrowStyle,
  controls: EditorControls,
  mirror: boolean,
): void {
  const { thickness, intensity, arch } = controls;

  // Offscreen 100x100 (matches the style's path coordinate space)
  const off = document.createElement("canvas");
  const PATH_SIZE = 100;
  off.width = PATH_SIZE;
  off.height = PATH_SIZE;
  const oc = off.getContext("2d");
  if (!oc) return;

  // Render the path as a fat stroke
  oc.clearRect(0, 0, PATH_SIZE, PATH_SIZE);
  oc.lineCap = "round";
  oc.lineJoin = "round";
  oc.strokeStyle = style.color;
  oc.fillStyle = style.color;
  oc.lineWidth = densityStroke(style.density);

  try {
    const path = new Path2D(style.pathData);
    oc.stroke(path);
  } catch {
    // If the path string fails to parse for any reason, give up silently —
    // we don't want the whole feature to crash on a bad path.
    return;
  }

  // Soften edges with a subtle blur. We re-draw via a temporary canvas
  // because not all browsers honour ctx.filter on every operation.
  const blurred = document.createElement("canvas");
  blurred.width = PATH_SIZE;
  blurred.height = PATH_SIZE;
  const bc = blurred.getContext("2d");
  if (!bc) return;
  bc.filter = "blur(1.2px)";
  bc.drawImage(off, 0, 0);

  // Apply intensity as the final alpha. Density already affects stroke
  // width; combine with the user's intensity slider for fine control.
  const baseAlpha = densityAlpha(style.density);
  const alpha = Math.max(0, Math.min(1, baseAlpha * intensity));

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = style.blendMode ?? "multiply";

  // Translate to the region centre, rotate to match the brow slope,
  // then scale to the bounding box.
  const drawWidth = region.width * thickness;
  const drawHeight = region.height * thickness;
  const yOffset = arch;

  ctx.translate(region.cx, region.cy + yOffset);
  // Mirror the right brow by inverting X scale BEFORE rotation so the
  // rotation direction stays consistent in viewer-space.
  ctx.rotate(region.rotation);
  if (mirror) ctx.scale(-1, 1);

  // Path coordinates are in 0..100; centre that on origin.
  ctx.translate(-drawWidth / 2, -drawHeight / 2);
  ctx.scale(drawWidth / PATH_SIZE, drawHeight / PATH_SIZE);

  ctx.drawImage(blurred, 0, 0);
  ctx.restore();
}

/* ──────────────────────────────────────────────
   StylePreview — tiny SVG card preview for the
   style picker. Uses the same path data so the
   thumbnail matches what'll get applied.
   ────────────────────────────────────────────── */
function StylePreview({ style }: { style: BrowStyle }) {
  const rgb = hexToRgb(style.color);
  const fill = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  return (
    <svg
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <path
        d={style.pathData}
        stroke={fill}
        strokeWidth={densityStroke(style.density)}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={densityAlpha(style.density)}
      />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   Main Component
   ────────────────────────────────────────────── */
export default function BrowTryOn() {
  const { t } = useI18n();

  const [step, setStep] = useState<Step>("upload");
  const [landmarkerStatus, setLandmarkerStatus] =
    useState<LandmarkerStatus>("idle");
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(
    null,
  );
  const [landmarks, setLandmarks] = useState<LandmarkPoint[] | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string>(
    BROW_STYLES[0].id,
  );
  const [thickness, setThickness] = useState(1.0);
  const [intensity, setIntensity] = useState(0.85);
  const [arch, setArch] = useState(0);
  const [showOriginal, setShowOriginal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  // FaceLandmarker is dynamically imported so we don't add it to the bundle
  // for users who never make it to the editor step.
  const faceLandmarkerRef = useRef<{
    detect: (img: HTMLImageElement) => { faceLandmarks: LandmarkPoint[][] };
  } | null>(null);

  const selectedStyle = useMemo(
    () =>
      BROW_STYLES.find((s) => s.id === selectedStyleId) ?? BROW_STYLES[0],
    [selectedStyleId],
  );

  /* ── Load MediaPipe lazily ── */
  const loadLandmarker = useCallback(async () => {
    if (faceLandmarkerRef.current) return faceLandmarkerRef.current;
    setLandmarkerStatus("loading");
    setErrorMsg(null);
    try {
      const vision = await import("@mediapipe/tasks-vision");
      const fileset = await vision.FilesetResolver.forVisionTasks(WASM_BASE);
      const landmarker = await vision.FaceLandmarker.createFromOptions(
        fileset,
        {
          baseOptions: {
            modelAssetPath: MODEL_URL,
            delegate: "GPU",
          },
          runningMode: "IMAGE",
          numFaces: 1,
        },
      );
      faceLandmarkerRef.current = landmarker as unknown as {
        detect: (img: HTMLImageElement) => {
          faceLandmarks: LandmarkPoint[][];
        };
      };
      setLandmarkerStatus("ready");
      return faceLandmarkerRef.current;
    } catch (err) {
      console.error("Failed to load FaceLandmarker", err);
      setLandmarkerStatus("error");
      setErrorMsg(t("tryon.error.model"));
      return null;
    }
  }, [t]);

  /* ── Image loading + detection ── */
  const processFile = useCallback(
    async (file: File) => {
      setErrorMsg(null);
      if (!file.type.startsWith("image/")) {
        setErrorMsg(t("tryon.upload.invalid"));
        return;
      }

      setStep("detecting");
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = async () => {
        // Cap large images so detection + canvas stay responsive.
        const MAX_DIM = 1600;
        let targetW = img.naturalWidth;
        let targetH = img.naturalHeight;
        if (targetW > MAX_DIM || targetH > MAX_DIM) {
          const scale = MAX_DIM / Math.max(targetW, targetH);
          targetW = Math.round(targetW * scale);
          targetH = Math.round(targetH * scale);
          const tmp = document.createElement("canvas");
          tmp.width = targetW;
          tmp.height = targetH;
          tmp.getContext("2d")?.drawImage(img, 0, 0, targetW, targetH);
          const resized = new Image();
          resized.onload = () => {
            URL.revokeObjectURL(objectUrl);
            void runDetection(resized);
          };
          resized.src = tmp.toDataURL("image/jpeg", 0.92);
          return;
        }

        URL.revokeObjectURL(objectUrl);
        void runDetection(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        setErrorMsg(t("tryon.upload.invalid"));
        setStep("upload");
      };
      img.src = objectUrl;
    },
    // runDetection is stable below; safe to omit (will be re-evaluated on
    // every render but we capture latest t).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  );

  const runDetection = useCallback(
    async (img: HTMLImageElement) => {
      const landmarker = await loadLandmarker();
      if (!landmarker) {
        setStep("upload");
        return;
      }
      try {
        const result = landmarker.detect(img);
        const faces = result.faceLandmarks;
        if (!faces || faces.length === 0) {
          setStep("noface");
          return;
        }
        setUploadedImage(img);
        setLandmarks(faces[0]);
        setStep("editor");
      } catch (err) {
        console.error("Detection failed", err);
        setErrorMsg(t("tryon.error.model"));
        setStep("upload");
      }
    },
    [loadLandmarker, t],
  );

  /* ── File input handlers ── */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void processFile(file);
    // Reset so the same file can be re-picked
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void processFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  /* ── Canvas redraw — runs on any control change ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (step !== "editor") return;
    if (!uploadedImage || !landmarks) return;

    let rafId = 0;

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = uploadedImage.naturalWidth;
      canvas.height = uploadedImage.naturalHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);

      if (showOriginal) return; // just the photo, for comparison

      const leftRegion = regionFromLandmarks(
        landmarks,
        LEFT_BROW,
        canvas.width,
        canvas.height,
      );
      const rightRegion = regionFromLandmarks(
        landmarks,
        RIGHT_BROW,
        canvas.width,
        canvas.height,
      );

      const controls: EditorControls = { thickness, intensity, arch };

      if (leftRegion) {
        drawBrowOnto(ctx, leftRegion, selectedStyle, controls, false);
      }
      if (rightRegion) {
        drawBrowOnto(ctx, rightRegion, selectedStyle, controls, true);
      }
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [
    step,
    uploadedImage,
    landmarks,
    selectedStyle,
    thickness,
    intensity,
    arch,
    showOriginal,
  ]);

  /* ── Actions ── */
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `shimmy-brow-tryon-${selectedStyle.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      "Hi Shimmy! I tried the brow visualizer and I love this look — can we book a consultation?",
    );
    window.open(`https://wa.me/6589308973?text=${message}`, "_blank");
  };

  const handleReset = () => {
    setStep("upload");
    setUploadedImage(null);
    setLandmarks(null);
    setErrorMsg(null);
    setShowOriginal(false);
  };

  /* ──────────────────────────────────────────────
     Render
     ────────────────────────────────────────────── */
  return (
    <div className="mx-auto max-w-6xl">
      {/* ─── Upload Step ─── */}
      {step === "upload" && (
        <div className="mx-auto max-w-2xl">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed transition-all rounded-sm px-6 py-12 sm:py-16 text-center bg-cream/40 ${
              isDragging
                ? "border-vermillion bg-vermillion/5"
                : "border-vermillion/30 hover:border-vermillion/60"
            }`}
          >
            <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal">
              {t("tryon.upload.title")}
            </h2>
            <p className="mt-3 text-sm text-charcoal-light">
              {t("tryon.upload.desc")}
            </p>
            <p className="mt-1 text-xs text-warm-gray">
              {t("tryon.upload.drop")}
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto inline-block bg-vermillion px-6 py-3 text-xs uppercase tracking-[0.2em] text-soft-white hover:bg-vermillion-dark transition-colors"
              >
                {t("tryon.upload.choose")}
              </button>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="w-full sm:w-auto inline-block border border-charcoal/20 px-6 py-3 text-xs uppercase tracking-[0.2em] text-charcoal hover:border-vermillion hover:text-vermillion transition-colors"
              >
                {t("tryon.upload.camera")}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              aria-label={t("tryon.upload.choose")}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleFileChange}
              className="hidden"
              aria-label={t("tryon.upload.camera")}
            />

            <div className="mt-8 mx-auto max-w-md border-t border-vermillion/15 pt-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-vermillion-dark">
                {/* lock icon */}
                <span aria-hidden="true" className="mr-2">
                  ✦
                </span>
                {t("tryon.upload.privacy")}
              </p>
            </div>

            {errorMsg && (
              <p className="mt-4 text-sm text-vermillion-dark" role="alert">
                {errorMsg}
              </p>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-warm-gray italic">
            {t("tryon.tip")}
          </p>
        </div>
      )}

      {/* ─── Detecting Step ─── */}
      {step === "detecting" && (
        <div className="mx-auto max-w-md text-center py-16 sm:py-20">
          <div className="mx-auto w-12 h-12 border-2 border-vermillion/20 border-t-vermillion rounded-full animate-spin" />
          <p className="mt-6 text-sm text-charcoal-light">
            {landmarkerStatus === "loading"
              ? t("tryon.loading.model")
              : t("tryon.detecting")}
          </p>
          <p className="mt-2 text-xs text-warm-gray">
            {t("tryon.upload.privacy")}
          </p>
        </div>
      )}

      {/* ─── No Face Step ─── */}
      {step === "noface" && (
        <div className="mx-auto max-w-md text-center py-16">
          <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">
            {t("tryon.noface")}
          </h2>
          <p className="mt-3 text-sm text-charcoal-light">{t("tryon.tip")}</p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-6 inline-block bg-vermillion px-6 py-3 text-xs uppercase tracking-[0.2em] text-soft-white hover:bg-vermillion-dark transition-colors"
          >
            {t("tryon.retry")}
          </button>
        </div>
      )}

      {/* ─── Editor Step ─── */}
      {step === "editor" && (
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Canvas column */}
          <div>
            <p className="text-xs text-vermillion-dark italic mb-3">
              {t("tryon.tip")}
            </p>
            <div className="relative bg-cream-dark/40 border border-vermillion/15 overflow-hidden rounded-sm">
              <canvas
                ref={canvasRef}
                aria-label={t("tryon.title")}
                className="block w-full h-auto"
              />
            </div>
            <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-vermillion-dark text-center">
              <span aria-hidden="true" className="mr-2">
                ✦
              </span>
              {t("tryon.upload.privacy")}
            </p>
          </div>

          {/* Controls column */}
          <div className="space-y-6">
            {/* Style picker */}
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-vermillion-dark mb-3">
                {t("tryon.styles.title")}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BROW_STYLES.map((style) => {
                  const active = style.id === selectedStyleId;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedStyleId(style.id)}
                      aria-pressed={active}
                      className={`text-left p-2 border transition-all ${
                        active
                          ? "border-vermillion bg-vermillion/5"
                          : "border-vermillion/15 bg-cream/30 hover:border-vermillion/40"
                      }`}
                    >
                      <div className="aspect-[2/1] bg-cream-dark/30 flex items-center justify-center p-1">
                        <StylePreview style={style} />
                      </div>
                      <p className="mt-2 text-[10px] leading-tight text-charcoal">
                        {t(style.nameKey)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4">
              <SliderRow
                label={t("tryon.control.thickness")}
                min={0.5}
                max={2}
                step={0.05}
                value={thickness}
                onChange={setThickness}
                format={(v) => `${v.toFixed(2)}x`}
              />
              <SliderRow
                label={t("tryon.control.intensity")}
                min={0}
                max={1}
                step={0.01}
                value={intensity}
                onChange={setIntensity}
                format={(v) => `${Math.round(v * 100)}%`}
              />
              <SliderRow
                label={t("tryon.control.arch")}
                min={-10}
                max={10}
                step={1}
                value={arch}
                onChange={setArch}
                format={(v) =>
                  v > 0 ? `+${v}px` : v < 0 ? `${v}px` : "0px"
                }
              />
            </div>

            {/* Compare toggle */}
            <button
              type="button"
              onMouseDown={() => setShowOriginal(true)}
              onMouseUp={() => setShowOriginal(false)}
              onMouseLeave={() => setShowOriginal(false)}
              onTouchStart={() => setShowOriginal(true)}
              onTouchEnd={() => setShowOriginal(false)}
              className="w-full border border-charcoal/20 px-4 py-2.5 text-xs uppercase tracking-[0.2em] text-charcoal hover:border-vermillion hover:text-vermillion transition-colors select-none"
              aria-label={t("tryon.compare")}
            >
              {t("tryon.compare")}
            </button>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="inline-block bg-vermillion px-4 py-3 text-xs uppercase tracking-[0.2em] text-soft-white hover:bg-vermillion-dark transition-colors"
              >
                {t("tryon.download")}
              </button>
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="inline-block bg-jade px-4 py-3 text-xs uppercase tracking-[0.2em] text-soft-white hover:opacity-90 transition-opacity"
              >
                {t("tryon.share")}
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full text-xs uppercase tracking-[0.2em] text-charcoal-light hover:text-vermillion transition-colors py-2"
            >
              {t("tryon.retry")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────
   SliderRow — labelled slider with live value
   ────────────────────────────────────────────── */
function SliderRow({
  label,
  min,
  max,
  step,
  value,
  onChange,
  format,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-charcoal">
        {label}
        <span className="text-vermillion-dark normal-case tracking-normal">
          {format(value)}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={label}
        className="mt-2 w-full accent-vermillion"
      />
    </label>
  );
}
