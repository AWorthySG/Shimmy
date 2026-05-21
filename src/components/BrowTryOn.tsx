"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type PointerEvent as ReactPointerEvent,
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

const HELP_STORAGE_KEY = "shimmy-tryon-help-shown";

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
  archLeft: number; // -10 - +10 px vertical offset for left brow
  archRight: number; // -10 - +10 px vertical offset for right brow
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
   EXIF orientation handling.
   Phones often save photos with an orientation
   tag rather than rotating the pixel data. We
   read it with `exifr` and pre-rotate onto a
   fresh canvas so detection (and everything
   downstream) sees an upright image.
   ────────────────────────────────────────────── */
async function readOrientation(file: File): Promise<number> {
  try {
    const exifr = await import("exifr");
    const orientation = await exifr.orientation(file);
    return typeof orientation === "number" ? orientation : 1;
  } catch {
    return 1;
  }
}

function applyOrientationToImage(
  img: HTMLImageElement,
  orientation: number,
): HTMLCanvasElement {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const canvas = document.createElement("canvas");
  // Orientations 5-8 swap dimensions.
  const swap = orientation >= 5 && orientation <= 8;
  canvas.width = swap ? h : w;
  canvas.height = swap ? w : h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  switch (orientation) {
    case 2:
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
      break;
    case 3:
      ctx.translate(w, h);
      ctx.rotate(Math.PI);
      break;
    case 4:
      ctx.translate(0, h);
      ctx.scale(1, -1);
      break;
    case 5:
      ctx.rotate(0.5 * Math.PI);
      ctx.scale(1, -1);
      break;
    case 6:
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(0, -h);
      break;
    case 7:
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(w, -h);
      ctx.scale(-1, 1);
      break;
    case 8:
      ctx.rotate(-0.5 * Math.PI);
      ctx.translate(-w, 0);
      break;
    default:
      // 1 (or unknown) — no transform.
      break;
  }
  ctx.drawImage(img, 0, 0);
  return canvas;
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
  thickness: number,
  intensity: number,
  arch: number,
  mirror: boolean,
): void {
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
   Renders just the photo with brows applied
   into an offscreen canvas. Used by the live
   preview, the compare overlay, and the
   download flow.
   ────────────────────────────────────────────── */
function renderWithBrows(
  source: HTMLImageElement | HTMLCanvasElement,
  landmarks: LandmarkPoint[],
  style: BrowStyle,
  controls: EditorControls,
): HTMLCanvasElement {
  const out = document.createElement("canvas");
  const w =
    source instanceof HTMLImageElement ? source.naturalWidth : source.width;
  const h =
    source instanceof HTMLImageElement ? source.naturalHeight : source.height;
  out.width = w;
  out.height = h;
  const ctx = out.getContext("2d");
  if (!ctx) return out;
  ctx.drawImage(source, 0, 0, w, h);

  const leftRegion = regionFromLandmarks(landmarks, LEFT_BROW, w, h);
  const rightRegion = regionFromLandmarks(landmarks, RIGHT_BROW, w, h);

  if (leftRegion) {
    drawBrowOnto(
      ctx,
      leftRegion,
      style,
      controls.thickness,
      controls.intensity,
      controls.archLeft,
      false,
    );
  }
  if (rightRegion) {
    drawBrowOnto(
      ctx,
      rightRegion,
      style,
      controls.thickness,
      controls.intensity,
      controls.archRight,
      true,
    );
  }
  return out;
}

/* ──────────────────────────────────────────────
   Watermark — only drawn on the exported PNG,
   never on the live canvas. Bottom-right, white
   text with a soft dark shadow for legibility.
   ────────────────────────────────────────────── */
function drawWatermark(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Main text sized at ~2.5% of image height. Clamp so it stays readable
  // on both tiny and very large images.
  const mainSize = Math.max(14, Math.min(48, Math.round(h * 0.025)));
  const subSize = Math.max(10, Math.round(mainSize * 0.6));
  const padding = 16;

  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#FFFFFF";
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = Math.max(2, mainSize * 0.18);
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 1;

  ctx.font = `600 ${mainSize}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
  const subY = h - padding;
  const mainY = subY - subSize - Math.round(mainSize * 0.15);
  ctx.fillText("Brows by Shimmyhands", w - padding, mainY);

  ctx.font = `400 ${subSize}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
  ctx.fillText("shimmyhands.com", w - padding, subY);
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
   HelpOverlay — first-visit walkthrough shown
   under the page header. Stored under
   `shimmy-tryon-help-shown` in localStorage.
   ────────────────────────────────────────────── */
function HelpOverlay({
  onDismiss,
  t,
}: {
  onDismiss: () => void;
  t: (k: string) => string;
}) {
  return (
    <div className="mx-auto max-w-4xl mb-8 border border-vermillion/20 bg-cream rounded-sm px-5 py-6 sm:px-8 sm:py-7">
      <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
        <div className="flex-1 w-full">
          <div className="h-[2px] w-[40px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-3" />
          <h3 className="font-serif text-lg sm:text-xl text-vermillion-dark">
            {t("tryon.help.title")}
          </h3>
          <ol className="mt-4 grid gap-3 sm:grid-cols-3">
            <li className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-vermillion/10 text-vermillion-dark text-base"
              >
                ↑
              </span>
              <span className="text-sm leading-snug text-vermillion-dark">
                {t("tryon.help.step1")}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-vermillion/10 text-vermillion-dark text-base"
              >
                ✦
              </span>
              <span className="text-sm leading-snug text-vermillion-dark">
                {t("tryon.help.step2")}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-vermillion/10 text-vermillion-dark text-base"
              >
                ⤓
              </span>
              <span className="text-sm leading-snug text-vermillion-dark">
                {t("tryon.help.step3")}
              </span>
            </li>
          </ol>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 bg-vermillion px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-soft-white hover:bg-vermillion-dark transition-colors self-end sm:self-start"
        >
          {t("tryon.help.dismiss")}
        </button>
      </div>
    </div>
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
  // Source can be the original image element or a pre-rotated canvas (for
  // photos with EXIF orientation). We treat both as drawable sources.
  const [uploadedSource, setUploadedSource] = useState<
    HTMLImageElement | HTMLCanvasElement | null
  >(null);
  const [landmarks, setLandmarks] = useState<LandmarkPoint[] | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string>(
    BROW_STYLES[0].id,
  );
  const [thickness, setThickness] = useState(1.0);
  const [intensity, setIntensity] = useState(0.85);
  const [archSynced, setArchSynced] = useState(0);
  const [archLeft, setArchLeft] = useState(0);
  const [archRight, setArchRight] = useState(0);
  const [independent, setIndependent] = useState(false);
  const [compareOn, setCompareOn] = useState(false);
  const [comparePos, setComparePos] = useState(50); // 0-100 %
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const compareWrapperRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  // FaceLandmarker is dynamically imported so we don't add it to the bundle
  // for users who never make it to the editor step.
  const faceLandmarkerRef = useRef<{
    detect: (
      img: HTMLImageElement | HTMLCanvasElement,
    ) => { faceLandmarks: LandmarkPoint[][] };
  } | null>(null);

  const selectedStyle = useMemo(
    () =>
      BROW_STYLES.find((s) => s.id === selectedStyleId) ?? BROW_STYLES[0],
    [selectedStyleId],
  );

  // Effective offsets for each brow — falls back to the synced value when
  // independent mode is off.
  const effectiveArchLeft = independent ? archLeft : archSynced;
  const effectiveArchRight = independent ? archRight : archSynced;

  /* ── First-visit help overlay ── */
  useEffect(() => {
    try {
      if (!localStorage.getItem(HELP_STORAGE_KEY)) {
        setShowHelp(true);
      }
    } catch {
      // localStorage may be unavailable (e.g. private browsing).
    }
  }, []);

  const dismissHelp = useCallback(() => {
    try {
      localStorage.setItem(HELP_STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    setShowHelp(false);
  }, []);

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
        detect: (
          img: HTMLImageElement | HTMLCanvasElement,
        ) => {
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

  /* ── Detection ── */
  const runDetection = useCallback(
    async (source: HTMLImageElement | HTMLCanvasElement) => {
      const landmarker = await loadLandmarker();
      if (!landmarker) {
        setStep("upload");
        return;
      }
      try {
        const result = landmarker.detect(source);
        const faces = result.faceLandmarks;
        if (!faces || faces.length === 0) {
          setStep("noface");
          return;
        }
        setUploadedSource(source);
        setLandmarks(faces[0]);
        setComparePos(50);
        setStep("editor");
      } catch (err) {
        console.error("Detection failed", err);
        setErrorMsg(t("tryon.error.model"));
        setStep("upload");
      }
    },
    [loadLandmarker, t],
  );

  /* ── Image loading + EXIF orientation handling ── */
  const processFile = useCallback(
    async (file: File) => {
      setErrorMsg(null);
      if (!file.type.startsWith("image/")) {
        setErrorMsg(t("tryon.upload.invalid"));
        return;
      }

      setStep("detecting");
      // Read EXIF first; it's cheap and lets us pre-rotate before detection.
      const orientation = await readOrientation(file);
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = async () => {
        URL.revokeObjectURL(objectUrl);

        // Apply EXIF rotation onto a canvas (no-op for orientation 1).
        const oriented =
          orientation && orientation !== 1
            ? applyOrientationToImage(img, orientation)
            : null;

        // Cap large images so detection + canvas stay responsive.
        const MAX_DIM = 1600;
        const srcW = oriented ? oriented.width : img.naturalWidth;
        const srcH = oriented ? oriented.height : img.naturalHeight;

        if (srcW > MAX_DIM || srcH > MAX_DIM) {
          const scale = MAX_DIM / Math.max(srcW, srcH);
          const targetW = Math.round(srcW * scale);
          const targetH = Math.round(srcH * scale);
          const tmp = document.createElement("canvas");
          tmp.width = targetW;
          tmp.height = targetH;
          const ctx = tmp.getContext("2d");
          if (ctx) {
            ctx.drawImage(oriented ?? img, 0, 0, targetW, targetH);
          }
          void runDetection(tmp);
          return;
        }

        void runDetection(oriented ?? img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        setErrorMsg(t("tryon.upload.invalid"));
        setStep("upload");
      };
      img.src = objectUrl;
    },
    [runDetection, t],
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
    if (!uploadedSource || !landmarks) return;

    let rafId = 0;

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w =
        uploadedSource instanceof HTMLImageElement
          ? uploadedSource.naturalWidth
          : uploadedSource.width;
      const h =
        uploadedSource instanceof HTMLImageElement
          ? uploadedSource.naturalHeight
          : uploadedSource.height;
      canvas.width = w;
      canvas.height = h;

      ctx.clearRect(0, 0, w, h);

      // When compare is ON we paint the original first, then clip-paint
      // the "with brows" version up to the slider position. When OFF we
      // just paint the full "with brows" result.
      if (compareOn) {
        ctx.drawImage(uploadedSource, 0, 0, w, h);
        const withBrows = renderWithBrows(uploadedSource, landmarks, selectedStyle, {
          thickness,
          intensity,
          archLeft: effectiveArchLeft,
          archRight: effectiveArchRight,
        });
        const clipW = Math.round((comparePos / 100) * w);
        if (clipW > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, clipW, h);
          ctx.clip();
          ctx.drawImage(withBrows, 0, 0, w, h);
          ctx.restore();
        }
      } else {
        const withBrows = renderWithBrows(uploadedSource, landmarks, selectedStyle, {
          thickness,
          intensity,
          archLeft: effectiveArchLeft,
          archRight: effectiveArchRight,
        });
        ctx.drawImage(withBrows, 0, 0, w, h);
      }
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [
    step,
    uploadedSource,
    landmarks,
    selectedStyle,
    thickness,
    intensity,
    effectiveArchLeft,
    effectiveArchRight,
    compareOn,
    comparePos,
  ]);

  /* ── Compare slider drag — pointer events cover mouse + touch ── */
  const draggingRef = useRef(false);

  const updateComparePos = useCallback((clientX: number) => {
    const el = compareWrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(0, Math.min(100, pct));
    setComparePos(clamped);
  }, []);

  const handleCompareDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!compareOn) return;
    draggingRef.current = true;
    // Capture so we keep getting events even if the pointer leaves the box.
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Some environments may not support pointer capture; safe to ignore.
    }
    updateComparePos(e.clientX);
  };

  const handleCompareMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!compareOn || !draggingRef.current) return;
    updateComparePos(e.clientX);
  };

  const handleCompareUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  /* ── Actions ── */
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !uploadedSource || !landmarks) return;

    // Build a fresh "final" render (always full, not compare-clipped) and
    // add the watermark. We do NOT mutate the live canvas — the watermark
    // must never appear in the preview.
    const finalCanvas = renderWithBrows(uploadedSource, landmarks, selectedStyle, {
      thickness,
      intensity,
      archLeft: effectiveArchLeft,
      archRight: effectiveArchRight,
    });
    const ctx = finalCanvas.getContext("2d");
    if (ctx) drawWatermark(ctx, finalCanvas.width, finalCanvas.height);

    const url = finalCanvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `shimmy-brow-tryon-${selectedStyle.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShareWhatsApp = () => {
    const template = t("tryon.share.message");
    const styleName = t(selectedStyle.nameKey);
    const message = encodeURIComponent(template.replace("{style}", styleName));
    window.open(`https://wa.me/6589308973?text=${message}`, "_blank");
  };

  const handleReset = () => {
    setStep("upload");
    setUploadedSource(null);
    setLandmarks(null);
    setErrorMsg(null);
    setCompareOn(false);
    setComparePos(50);
  };

  /* ──────────────────────────────────────────────
     Render
     ────────────────────────────────────────────── */
  return (
    <div className="mx-auto max-w-6xl">
      {/* ─── First-time help overlay ─── */}
      {showHelp && <HelpOverlay onDismiss={dismissHelp} t={t} />}

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
            <div
              ref={compareWrapperRef}
              onPointerDown={handleCompareDown}
              onPointerMove={handleCompareMove}
              onPointerUp={handleCompareUp}
              onPointerCancel={handleCompareUp}
              className={`relative bg-cream-dark/40 border border-vermillion/15 overflow-hidden rounded-sm select-none ${
                compareOn ? "touch-none cursor-ew-resize" : ""
              }`}
            >
              <canvas
                ref={canvasRef}
                aria-label={t("tryon.title")}
                className="block w-full h-auto"
              />

              {/* Drag handle + dividing line — only visible when compare is on */}
              {compareOn && (
                <>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 bottom-0"
                    style={{
                      left: `${comparePos}%`,
                      width: "2px",
                      background: "rgba(255,255,255,0.9)",
                      boxShadow: "0 0 6px rgba(0,0,0,0.45)",
                      transform: "translateX(-1px)",
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute"
                    style={{
                      left: `${comparePos}%`,
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "36px",
                      height: "36px",
                      borderRadius: "9999px",
                      background: "rgba(255,255,255,0.95)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--vermillion-dark)",
                      fontSize: "14px",
                      fontWeight: 600,
                      letterSpacing: "-0.05em",
                    }}
                  >
                    ◀▶
                  </div>
                </>
              )}
            </div>
            {compareOn && (
              <p className="mt-2 text-[11px] text-vermillion-dark text-center">
                {t("tryon.compare.hint")}
              </p>
            )}
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
                      title={t(style.descKey)}
                      className={`text-left p-2 border transition-all ${
                        active
                          ? "border-vermillion bg-vermillion/5"
                          : "border-vermillion/15 bg-cream/30 hover:border-vermillion/40"
                      }`}
                    >
                      <div className="aspect-[2/1] bg-cream-dark/30 flex items-center justify-center p-1">
                        <StylePreview style={style} />
                      </div>
                      <p className="mt-2 text-[10px] leading-tight text-charcoal font-medium">
                        {t(style.nameKey)}
                      </p>
                      <p className="mt-1 text-[9px] leading-snug text-charcoal-light">
                        {t(style.descKey)}
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

              {/* Independent toggle */}
              <label className="flex items-center justify-between gap-3 cursor-pointer">
                <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal">
                  {t("tryon.control.independent")}
                </span>
                <input
                  type="checkbox"
                  checked={independent}
                  onChange={(e) => {
                    const next = e.target.checked;
                    setIndependent(next);
                    // When turning ON, seed both sides from the synced value
                    // so the visuals don't jump. When turning OFF, seed the
                    // synced value from the left side as a sensible default.
                    if (next) {
                      setArchLeft(archSynced);
                      setArchRight(archSynced);
                    } else {
                      setArchSynced(archLeft);
                    }
                  }}
                  className="h-4 w-4 accent-vermillion"
                  aria-label={t("tryon.control.independent")}
                />
              </label>

              {independent ? (
                <>
                  <SliderRow
                    label={`${t("tryon.control.arch")} · ${t("tryon.control.arch.left")}`}
                    min={-10}
                    max={10}
                    step={1}
                    value={archLeft}
                    onChange={setArchLeft}
                    format={(v) =>
                      v > 0 ? `+${v}px` : v < 0 ? `${v}px` : "0px"
                    }
                  />
                  <SliderRow
                    label={`${t("tryon.control.arch")} · ${t("tryon.control.arch.right")}`}
                    min={-10}
                    max={10}
                    step={1}
                    value={archRight}
                    onChange={setArchRight}
                    format={(v) =>
                      v > 0 ? `+${v}px` : v < 0 ? `${v}px` : "0px"
                    }
                  />
                </>
              ) : (
                <SliderRow
                  label={t("tryon.control.arch")}
                  min={-10}
                  max={10}
                  step={1}
                  value={archSynced}
                  onChange={setArchSynced}
                  format={(v) =>
                    v > 0 ? `+${v}px` : v < 0 ? `${v}px` : "0px"
                  }
                />
              )}
            </div>

            {/* Compare toggle — drag-slider mode */}
            <button
              type="button"
              onClick={() => setCompareOn((v) => !v)}
              aria-pressed={compareOn}
              className={`w-full border px-4 py-2.5 text-xs uppercase tracking-[0.2em] transition-colors select-none ${
                compareOn
                  ? "border-vermillion bg-vermillion/5 text-vermillion-dark"
                  : "border-charcoal/20 text-charcoal hover:border-vermillion hover:text-vermillion"
              }`}
            >
              {t("tryon.compare.toggle")}:{" "}
              {compareOn ? t("tryon.compare.on") : t("tryon.compare.off")}
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
