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
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  BROW_STYLES,
  BROW_COLORS,
  FACE_SHAPE_QUIZ,
  resolveFaceShape,
  recommendedStylesFor,
  densityAlpha,
  densityStroke,
  type BrowStyle,
  type FaceShape,
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
const QUIZ_STORAGE_KEY = "shimmy-tryon-quiz-done";

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
      break;
  }
  ctx.drawImage(img, 0, 0);
  return canvas;
}

/* ──────────────────────────────────────────────
   Drawing — paints one brow with optional colour override.
   ────────────────────────────────────────────── */
function drawBrowOnto(
  ctx: CanvasRenderingContext2D,
  region: BrowRegion,
  style: BrowStyle,
  thickness: number,
  intensity: number,
  arch: number,
  mirror: boolean,
  colorOverride?: string,
): void {
  const off = document.createElement("canvas");
  const PATH_SIZE = 100;
  off.width = PATH_SIZE;
  off.height = PATH_SIZE;
  const oc = off.getContext("2d");
  if (!oc) return;

  const paintColor = colorOverride ?? style.color;

  oc.clearRect(0, 0, PATH_SIZE, PATH_SIZE);
  oc.lineCap = "round";
  oc.lineJoin = "round";
  oc.strokeStyle = paintColor;
  oc.fillStyle = paintColor;
  oc.lineWidth = densityStroke(style.density);

  try {
    const path = new Path2D(style.pathData);
    oc.stroke(path);
  } catch {
    return;
  }

  const blurred = document.createElement("canvas");
  blurred.width = PATH_SIZE;
  blurred.height = PATH_SIZE;
  const bc = blurred.getContext("2d");
  if (!bc) return;
  bc.filter = "blur(1.2px)";
  bc.drawImage(off, 0, 0);

  const baseAlpha = densityAlpha(style.density);
  const alpha = Math.max(0, Math.min(1, baseAlpha * intensity));

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = style.blendMode ?? "multiply";

  const drawWidth = region.width * thickness;
  const drawHeight = region.height * thickness;
  const yOffset = arch;

  ctx.translate(region.cx, region.cy + yOffset);
  ctx.rotate(region.rotation);
  if (mirror) ctx.scale(-1, 1);

  ctx.translate(-drawWidth / 2, -drawHeight / 2);
  ctx.scale(drawWidth / PATH_SIZE, drawHeight / PATH_SIZE);

  ctx.drawImage(blurred, 0, 0);
  ctx.restore();
}

/* ──────────────────────────────────────────────
   Renders just the photo with brows applied
   into an offscreen canvas.
   ────────────────────────────────────────────── */
function renderWithBrows(
  source: HTMLImageElement | HTMLCanvasElement,
  landmarks: LandmarkPoint[],
  style: BrowStyle,
  controls: EditorControls,
  colorOverride?: string,
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
      colorOverride,
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
      colorOverride,
    );
  }
  return out;
}

/* ──────────────────────────────────────────────
   Renders only the LEFT half of an image with the
   provided style (used for A/B compare).
   ────────────────────────────────────────────── */
function renderHalfWithBrows(
  source: HTMLImageElement | HTMLCanvasElement,
  landmarks: LandmarkPoint[],
  style: BrowStyle,
  controls: EditorControls,
  half: "left" | "right",
  colorOverride?: string,
): HTMLCanvasElement {
  const full = renderWithBrows(source, landmarks, style, controls, colorOverride);
  const out = document.createElement("canvas");
  out.width = full.width;
  out.height = full.height;
  const ctx = out.getContext("2d");
  if (!ctx) return out;

  ctx.save();
  ctx.beginPath();
  if (half === "left") {
    ctx.rect(0, 0, Math.round(full.width / 2), full.height);
  } else {
    ctx.rect(
      Math.round(full.width / 2),
      0,
      full.width - Math.round(full.width / 2),
      full.height,
    );
  }
  ctx.clip();
  ctx.drawImage(full, 0, 0);
  ctx.restore();
  return out;
}

/* ──────────────────────────────────────────────
   Watermark — only drawn on the exported PNG.
   ────────────────────────────────────────────── */
function drawWatermark(ctx: CanvasRenderingContext2D, w: number, h: number) {
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
   IG-Story 9:16 card composer.
   ────────────────────────────────────────────── */
function composeStoryCard(
  source: HTMLCanvasElement,
  brand: string,
  tagline: string,
  styleName: string,
  promoCode: string,
): HTMLCanvasElement {
  const W = 1080;
  const H = 1920;
  const card = document.createElement("canvas");
  card.width = W;
  card.height = H;
  const ctx = card.getContext("2d");
  if (!ctx) return card;

  // Dark base
  ctx.fillStyle = "#1A1410";
  ctx.fillRect(0, 0, W, H);

  // Compute draw rect — fit the source photo centered horizontally with margin.
  const sourceAspect = source.width / source.height;
  const targetW = W - 80; // 40px side margins
  const targetH = Math.round(targetW / sourceAspect);
  const dy = Math.round((H - targetH) / 2);
  ctx.drawImage(source, 40, dy, targetW, targetH);

  // Top gradient overlay
  const topGrad = ctx.createLinearGradient(0, 0, 0, 420);
  topGrad.addColorStop(0, "rgba(0,0,0,0.75)");
  topGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, W, 420);

  // Bottom gradient overlay
  const botGrad = ctx.createLinearGradient(0, H - 460, 0, H);
  botGrad.addColorStop(0, "rgba(0,0,0,0)");
  botGrad.addColorStop(1, "rgba(0,0,0,0.85)");
  ctx.fillStyle = botGrad;
  ctx.fillRect(0, H - 460, W, 460);

  // Brand text (top)
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = `600 84px 'Georgia', 'Times New Roman', serif`;
  ctx.fillText(brand, W / 2, 120);

  // Subtitle (top)
  ctx.font = `400 36px 'Georgia', 'Times New Roman', serif`;
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText(tagline, W / 2, 230);

  // Decorative divider
  ctx.fillStyle = "#D33B2D"; // vermillion
  ctx.fillRect(W / 2 - 40, 300, 80, 3);

  // Style name (bottom)
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `500 56px 'Georgia', 'Times New Roman', serif`;
  ctx.fillText(styleName, W / 2, H - 220);

  // Promo code (bottom)
  ctx.fillStyle = "#FFD78A";
  ctx.font = `600 34px ui-sans-serif, system-ui, -apple-system, sans-serif`;
  // Letter-spacing approximation: paint character-by-character
  drawTrackedText(ctx, promoCode, W / 2, H - 140, 4);

  // Site URL
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = `400 28px ui-sans-serif, system-ui, -apple-system, sans-serif`;
  ctx.fillText("shimmyhands.com", W / 2, H - 80);

  return card;
}

function drawTrackedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  letterSpacing: number,
) {
  ctx.save();
  ctx.textAlign = "left";
  const chars = Array.from(text);
  const widths = chars.map((c) => ctx.measureText(c).width);
  const totalWidth =
    widths.reduce((s, w) => s + w, 0) + letterSpacing * Math.max(0, chars.length - 1);
  let x = cx - totalWidth / 2;
  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], x, y);
    x += widths[i] + letterSpacing;
  }
  ctx.restore();
}

/* ──────────────────────────────────────────────
   StylePreview — tiny SVG card preview
   ────────────────────────────────────────────── */
function StylePreview({ style, color }: { style: BrowStyle; color?: string }) {
  const rgb = hexToRgb(color ?? style.color);
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
   HelpOverlay
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
   ModalShell — reusable centred modal w/ overlay
   ────────────────────────────────────────────── */
function ModalShell({
  onClose,
  children,
  maxWidthClass = "max-w-[400px]",
  ariaLabel,
}: {
  onClose: () => void;
  children: React.ReactNode;
  maxWidthClass?: string;
  ariaLabel?: string;
}) {
  // Lock body scroll while mounted.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto bg-cream border border-vermillion/20 rounded-sm shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main Component
   ────────────────────────────────────────────── */
export default function BrowTryOn() {
  const { t } = useI18n();
  const router = useRouter();

  const [step, setStep] = useState<Step>("upload");
  const [landmarkerStatus, setLandmarkerStatus] =
    useState<LandmarkerStatus>("idle");
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
  const [comparePos, setComparePos] = useState(50);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // ── New feature state ──
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [abMode, setAbMode] = useState(false);
  const [styleA, setStyleA] = useState<string | null>(null);
  const [styleB, setStyleB] = useState<string | null>(null);
  const [abPicking, setAbPicking] = useState<"A" | "B" | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const compareWrapperRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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

  const colorOverride = useMemo(() => {
    if (!selectedColorId) return undefined;
    return BROW_COLORS.find((c) => c.id === selectedColorId)?.color;
  }, [selectedColorId]);

  const selectedColorName = useMemo(() => {
    if (!selectedColorId) return null;
    const c = BROW_COLORS.find((c) => c.id === selectedColorId);
    return c ? t(c.nameKey) : null;
  }, [selectedColorId, t]);

  const effectiveArchLeft = independent ? archLeft : archSynced;
  const effectiveArchRight = independent ? archRight : archSynced;

  /* ── First-visit help overlay ── */
  useEffect(() => {
    try {
      if (!localStorage.getItem(HELP_STORAGE_KEY)) {
        setShowHelp(true);
      }
    } catch {
      // localStorage may be unavailable.
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

  /* ── Image loading + EXIF orientation ── */
  const processFile = useCallback(
    async (file: File) => {
      setErrorMsg(null);
      if (!file.type.startsWith("image/")) {
        setErrorMsg(t("tryon.upload.invalid"));
        return;
      }

      setStep("detecting");
      const orientation = await readOrientation(file);
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = async () => {
        URL.revokeObjectURL(objectUrl);

        const oriented =
          orientation && orientation !== 1
            ? applyOrientationToImage(img, orientation)
            : null;

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

  /* ── Process a raw canvas (from live camera) ── */
  const processCanvas = useCallback(
    async (cnv: HTMLCanvasElement) => {
      setErrorMsg(null);
      setStep("detecting");
      const MAX_DIM = 1600;
      let toUse: HTMLCanvasElement = cnv;
      if (cnv.width > MAX_DIM || cnv.height > MAX_DIM) {
        const scale = MAX_DIM / Math.max(cnv.width, cnv.height);
        const targetW = Math.round(cnv.width * scale);
        const targetH = Math.round(cnv.height * scale);
        const tmp = document.createElement("canvas");
        tmp.width = targetW;
        tmp.height = targetH;
        const ctx = tmp.getContext("2d");
        if (ctx) ctx.drawImage(cnv, 0, 0, targetW, targetH);
        toUse = tmp;
      }
      void runDetection(toUse);
    },
    [runDetection],
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void processFile(file);
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

  /* ── Canvas redraw ── */
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

      // A/B compare mode: split-render two styles vertically
      if (abMode) {
        ctx.drawImage(uploadedSource, 0, 0, w, h);
        const sA = styleA
          ? BROW_STYLES.find((s) => s.id === styleA)
          : null;
        const sB = styleB
          ? BROW_STYLES.find((s) => s.id === styleB)
          : null;
        const controls: EditorControls = {
          thickness,
          intensity,
          archLeft: effectiveArchLeft,
          archRight: effectiveArchRight,
        };
        if (sA) {
          const half = renderHalfWithBrows(
            uploadedSource,
            landmarks,
            sA,
            controls,
            "left",
            colorOverride,
          );
          ctx.drawImage(half, 0, 0, w, h);
        }
        if (sB) {
          const half = renderHalfWithBrows(
            uploadedSource,
            landmarks,
            sB,
            controls,
            "right",
            colorOverride,
          );
          ctx.drawImage(half, 0, 0, w, h);
        }
        // Centre divider
        ctx.save();
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.fillRect(Math.round(w / 2) - 1, 0, 2, h);
        ctx.restore();
        return;
      }

      if (compareOn) {
        ctx.drawImage(uploadedSource, 0, 0, w, h);
        const withBrows = renderWithBrows(
          uploadedSource,
          landmarks,
          selectedStyle,
          {
            thickness,
            intensity,
            archLeft: effectiveArchLeft,
            archRight: effectiveArchRight,
          },
          colorOverride,
        );
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
        const withBrows = renderWithBrows(
          uploadedSource,
          landmarks,
          selectedStyle,
          {
            thickness,
            intensity,
            archLeft: effectiveArchLeft,
            archRight: effectiveArchRight,
          },
          colorOverride,
        );
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
    colorOverride,
    abMode,
    styleA,
    styleB,
  ]);

  /* ── Compare slider drag ── */
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
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
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

    const finalCanvas = renderWithBrows(
      uploadedSource,
      landmarks,
      selectedStyle,
      {
        thickness,
        intensity,
        archLeft: effectiveArchLeft,
        archRight: effectiveArchRight,
      },
      colorOverride,
    );
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

  const handleDownloadStoryCard = () => {
    if (!uploadedSource || !landmarks) return;
    const photo = renderWithBrows(
      uploadedSource,
      landmarks,
      selectedStyle,
      {
        thickness,
        intensity,
        archLeft: effectiveArchLeft,
        archRight: effectiveArchRight,
      },
      colorOverride,
    );
    const card = composeStoryCard(
      photo,
      t("tryon.card.brand"),
      t("tryon.card.tagline"),
      t(selectedStyle.nameKey),
      t("tryon.card.code"),
    );
    const url = card.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `shimmyhands-tryon-story.png`;
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

  const handleBookThisLook = () => {
    const styleName = t(selectedStyle.nameKey);
    const colorPart = selectedColorName
      ? `, color: ${selectedColorName}`
      : "";
    const note = `${t("tryon.book.note.prefix")} ${styleName}${colorPart}, arch L:${effectiveArchLeft} R:${effectiveArchRight}`;
    const params = new URLSearchParams({
      style: selectedStyle.id,
      note,
    });
    router.push(`/contact?${params.toString()}`);
  };

  const handleReset = () => {
    setStep("upload");
    setUploadedSource(null);
    setLandmarks(null);
    setErrorMsg(null);
    setCompareOn(false);
    setComparePos(50);
    setAbMode(false);
    setStyleA(null);
    setStyleB(null);
    setAbPicking(null);
  };

  /* ── A/B mode toggle ── */
  const enterAbMode = () => {
    setAbMode(true);
    setCompareOn(false);
    setStyleA(selectedStyleId);
    setStyleB(null);
    setAbPicking("B");
  };

  const exitAbMode = () => {
    setAbMode(false);
    setAbPicking(null);
  };

  const pickWinner = (id: string | null) => {
    if (!id) return;
    setSelectedStyleId(id);
    exitAbMode();
  };

  const handleStyleClick = (id: string) => {
    if (abMode) {
      if (abPicking === "A") {
        setStyleA(id);
        setAbPicking("B");
      } else {
        // default to B
        setStyleB(id);
        setAbPicking(null);
      }
      return;
    }
    setSelectedStyleId(id);
  };

  // Whether the floating Book CTA should show. Hide when any modal is open.
  const showBookCta =
    step === "editor" &&
    !showSaveModal &&
    !showCameraModal &&
    !showQuizModal;

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
                onClick={() => setShowCameraModal(true)}
                className="w-full sm:w-auto inline-block border border-charcoal/20 px-6 py-3 text-xs uppercase tracking-[0.2em] text-charcoal hover:border-vermillion hover:text-vermillion transition-colors"
              >
                {t("tryon.camera.start")}
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

            <div className="mt-8 mx-auto max-w-md border-t border-vermillion/15 pt-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-vermillion-dark">
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

          {/* Quiz promo link */}
          <p className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowQuizModal(true)}
              className="text-sm text-vermillion hover:text-vermillion-dark underline-offset-4 hover:underline transition-colors"
            >
              {t("tryon.quiz.open")}
            </button>
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
        <>
          {/* Quiz promo link */}
          <p className="mb-3 text-center sm:text-left">
            <button
              type="button"
              onClick={() => setShowQuizModal(true)}
              className="text-sm text-vermillion hover:text-vermillion-dark underline-offset-4 hover:underline transition-colors"
            >
              {t("tryon.quiz.open")}
            </button>
          </p>

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

                {/* Compare drag handle */}
                {compareOn && !abMode && (
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

                {/* A/B overlay labels + winner buttons */}
                {abMode && (
                  <>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 flex flex-col">
                      <div className="m-2 self-start bg-charcoal/70 text-soft-white text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-sm">
                        {t("tryon.ab.left")}
                        {styleA && (
                          <span className="ml-2 normal-case tracking-normal">
                            · {t(BROW_STYLES.find((s) => s.id === styleA)?.nameKey ?? "")}
                          </span>
                        )}
                      </div>
                      <div className="flex-1" />
                      {styleA && (
                        <div className="pointer-events-auto m-2 self-start">
                          <button
                            type="button"
                            onClick={() => pickWinner(styleA)}
                            className="bg-vermillion text-soft-white text-[10px] uppercase tracking-[0.2em] px-3 py-2 rounded-sm hover:bg-vermillion-dark transition-colors"
                          >
                            {t("tryon.ab.winner")}
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 flex flex-col">
                      <div className="m-2 self-end bg-charcoal/70 text-soft-white text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-sm">
                        {t("tryon.ab.right")}
                        {styleB && (
                          <span className="ml-2 normal-case tracking-normal">
                            · {t(BROW_STYLES.find((s) => s.id === styleB)?.nameKey ?? "")}
                          </span>
                        )}
                      </div>
                      <div className="flex-1" />
                      {styleB && (
                        <div className="pointer-events-auto m-2 self-end">
                          <button
                            type="button"
                            onClick={() => pickWinner(styleB)}
                            className="bg-vermillion text-soft-white text-[10px] uppercase tracking-[0.2em] px-3 py-2 rounded-sm hover:bg-vermillion-dark transition-colors"
                          >
                            {t("tryon.ab.winner")}
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              {compareOn && !abMode && (
                <p className="mt-2 text-[11px] text-vermillion-dark text-center">
                  {t("tryon.compare.hint")}
                </p>
              )}
              {abMode && (
                <p className="mt-2 text-[11px] text-vermillion-dark text-center">
                  {abPicking
                    ? `${t("tryon.ab.pick")} (${abPicking === "A" ? t("tryon.ab.left") : t("tryon.ab.right")})`
                    : t("tryon.ab.pick")}
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
            <div className="space-y-6 pb-24 sm:pb-6">
              {/* A/B toggle */}
              <button
                type="button"
                onClick={abMode ? exitAbMode : enterAbMode}
                aria-pressed={abMode}
                className={`w-full border px-4 py-2.5 text-xs uppercase tracking-[0.2em] transition-colors select-none ${
                  abMode
                    ? "border-vermillion bg-vermillion/5 text-vermillion-dark"
                    : "border-charcoal/20 text-charcoal hover:border-vermillion hover:text-vermillion"
                }`}
              >
                {abMode ? t("tryon.ab.exit") : t("tryon.ab.toggle")}
              </button>

              {/* Style picker */}
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.3em] text-vermillion-dark mb-3">
                  {abMode
                    ? `${t("tryon.ab.pick")}${abPicking ? ` · ${abPicking === "A" ? t("tryon.ab.left") : t("tryon.ab.right")}` : ""}`
                    : t("tryon.styles.title")}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BROW_STYLES.map((style) => {
                    const active = abMode
                      ? style.id === styleA || style.id === styleB
                      : style.id === selectedStyleId;
                    const slot = abMode
                      ? style.id === styleA
                        ? "A"
                        : style.id === styleB
                          ? "B"
                          : null
                      : null;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => handleStyleClick(style.id)}
                        aria-pressed={active}
                        title={t(style.descKey)}
                        className={`relative text-left p-2 border transition-all ${
                          active
                            ? "border-vermillion bg-vermillion/5"
                            : "border-vermillion/15 bg-cream/30 hover:border-vermillion/40"
                        }`}
                      >
                        {style.isPopular && (
                          <span className="absolute top-1 right-1 bg-vermillion text-soft-white text-[8px] uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm z-10">
                            {t("tryon.popular.badge")}
                          </span>
                        )}
                        {slot && (
                          <span className="absolute top-1 left-1 bg-charcoal text-soft-white text-[8px] uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm z-10">
                            {slot}
                          </span>
                        )}
                        <div className="aspect-[2/1] bg-cream-dark/30 flex items-center justify-center p-1">
                          <StylePreview style={style} color={colorOverride} />
                        </div>
                        <p className="mt-2 text-[10px] leading-tight text-charcoal font-medium">
                          {t(style.nameKey)}
                        </p>
                        <p className="mt-1 text-[9px] leading-snug text-charcoal-light">
                          {t(style.descKey)}
                        </p>
                        <p className="mt-1.5 text-[10px] uppercase tracking-[0.1em] text-vermillion-dark font-medium">
                          {t("tryon.price.from")} S${style.priceFrom}
                        </p>
                        <p className="text-[9px] leading-tight text-warm-gray">
                          {style.triedThisMonth} {t("tryon.tried.this.month")}
                        </p>
                        <p className="mt-1 text-[9px] leading-tight text-charcoal-light">
                          {t("tryon.longevity.label")}: {t(style.longevityKey)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brow colour picker */}
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.3em] text-vermillion-dark mb-3">
                  {t("tryon.color.title")}
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  {BROW_COLORS.map((c) => {
                    const active = c.id === selectedColorId;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() =>
                          setSelectedColorId(active ? null : c.id)
                        }
                        aria-pressed={active}
                        aria-label={t(c.nameKey)}
                        title={t(c.nameKey)}
                        className={`h-8 w-8 rounded-full transition-all ${
                          active
                            ? "ring-2 ring-vermillion ring-offset-2 ring-offset-cream"
                            : "ring-1 ring-charcoal/15 hover:ring-vermillion/40"
                        }`}
                        style={{ backgroundColor: c.color }}
                      />
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

              {/* Compare toggle */}
              <button
                type="button"
                onClick={() => {
                  if (abMode) return;
                  setCompareOn((v) => !v);
                }}
                aria-pressed={compareOn}
                disabled={abMode}
                className={`w-full border px-4 py-2.5 text-xs uppercase tracking-[0.2em] transition-colors select-none ${
                  abMode
                    ? "border-charcoal/10 text-charcoal/30 cursor-not-allowed"
                    : compareOn
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

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(true)}
                  className="inline-block border border-vermillion px-4 py-3 text-xs uppercase tracking-[0.2em] text-vermillion hover:bg-vermillion hover:text-soft-white transition-colors"
                >
                  {t("tryon.save.title")}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadStoryCard}
                  className="inline-block border border-vermillion px-4 py-3 text-xs uppercase tracking-[0.2em] text-vermillion hover:bg-vermillion hover:text-soft-white transition-colors"
                >
                  {t("tryon.card.download")}
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
        </>
      )}

      {/* ─── Floating Book This Look CTA ─── */}
      {showBookCta && (
        <button
          type="button"
          onClick={handleBookThisLook}
          className="fixed bottom-20 sm:bottom-4 left-1/2 -translate-x-1/2 bg-vermillion text-soft-white px-6 py-3 text-xs uppercase tracking-[0.2em] shadow-lg z-40 hover:bg-vermillion-dark transition-colors rounded-sm"
        >
          {t("tryon.book.this.look")}
        </button>
      )}

      {/* ─── Save my look modal ─── */}
      {showSaveModal && (
        <SaveLookModal
          onClose={() => setShowSaveModal(false)}
          styleId={selectedStyle.id}
          styleName={t(selectedStyle.nameKey)}
          t={t}
        />
      )}

      {/* ─── Camera modal ─── */}
      {showCameraModal && (
        <CameraModal
          onClose={() => setShowCameraModal(false)}
          onCapture={(cnv) => {
            setShowCameraModal(false);
            void processCanvas(cnv);
          }}
          t={t}
        />
      )}

      {/* ─── Quiz modal ─── */}
      {showQuizModal && (
        <QuizModal
          onClose={() => setShowQuizModal(false)}
          onPickStyle={(id) => {
            setSelectedStyleId(id);
            setShowQuizModal(false);
            try {
              localStorage.setItem(QUIZ_STORAGE_KEY, "true");
            } catch {
              // ignore
            }
          }}
          t={t}
        />
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────
   SliderRow
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

/* ──────────────────────────────────────────────
   SaveLookModal — lead capture
   ────────────────────────────────────────────── */
function SaveLookModal({
  onClose,
  styleId,
  styleName,
  t,
}: {
  onClose: () => void;
  styleId: string;
  styleName: string;
  t: (k: string) => string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/save-look", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email: email || undefined,
          style_id: styleId,
          style_name: styleName,
        }),
      });
      if (!res.ok) {
        setStatus("error");
      } else {
        setStatus("success");
        setTimeout(() => onClose(), 2000);
      }
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell
      onClose={onClose}
      ariaLabel={t("tryon.save.title")}
      maxWidthClass="max-w-[420px]"
    >
      <form onSubmit={handleSubmit} className="p-6 sm:p-8">
        <div className="h-[2px] w-[40px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-3" />
        <h2 className="font-serif text-xl text-charcoal">
          {t("tryon.save.title")}
        </h2>
        <p className="mt-2 text-sm text-charcoal-light">
          {t("tryon.save.desc")}
        </p>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal">
              {t("tryon.save.name")} *
            </span>
            <input
              type="text"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full border border-charcoal/20 px-3 py-2 text-sm bg-soft-white focus:border-vermillion focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal">
              {t("tryon.save.phone")} *
            </span>
            <input
              type="tel"
              required
              pattern="[+\d\s\-()]{6,20}"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 w-full border border-charcoal/20 px-3 py-2 text-sm bg-soft-white focus:border-vermillion focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal">
              {t("tryon.save.email")}
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border border-charcoal/20 px-3 py-2 text-sm bg-soft-white focus:border-vermillion focus:outline-none"
            />
          </label>
        </div>

        {status === "success" && (
          <p className="mt-4 text-sm text-jade" role="status">
            {t("tryon.save.success")}
          </p>
        )}
        {status === "error" && (
          <p className="mt-4 text-sm text-vermillion-dark" role="alert">
            {t("tryon.save.error")}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-charcoal/20 px-4 py-3 text-xs uppercase tracking-[0.2em] text-charcoal hover:border-vermillion hover:text-vermillion transition-colors"
          >
            {t("tryon.save.cancel")}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-vermillion px-4 py-3 text-xs uppercase tracking-[0.2em] text-soft-white hover:bg-vermillion-dark transition-colors disabled:opacity-50"
          >
            {submitting ? "..." : t("tryon.save.submit")}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

/* ──────────────────────────────────────────────
   CameraModal — live camera capture with countdown
   ────────────────────────────────────────────── */
function CameraModal({
  onClose,
  onCapture,
  t,
}: {
  onClose: () => void;
  onCapture: (cnv: HTMLCanvasElement) => void;
  t: (k: string) => string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const stopStream = useCallback(() => {
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startStream = useCallback(async () => {
    setError(null);
    setPreviewUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 1280 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {
          // some browsers need user interaction
        });
      }
    } catch (err) {
      console.error("Camera error", err);
      setError(t("tryon.camera.error"));
    }
  }, [t]);

  useEffect(() => {
    void startStream();
    return () => {
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video) return null;
    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return null;
    const cnv = document.createElement("canvas");
    cnv.width = w;
    cnv.height = h;
    const ctx = cnv.getContext("2d");
    if (!ctx) return null;
    // Mirror horizontally so what the user saw in the preview matches the photo
    ctx.save();
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w, h);
    ctx.restore();
    return cnv;
  }, []);

  const startCountdown = useCallback(() => {
    if (countdown !== null) return;
    let n = 3;
    setCountdown(n);
    const tick = () => {
      n -= 1;
      if (n <= 0) {
        setCountdown(null);
        const cnv = captureFrame();
        if (cnv) {
          previewCanvasRef.current = cnv;
          setPreviewUrl(cnv.toDataURL("image/png"));
          stopStream();
        }
      } else {
        setCountdown(n);
        setTimeout(tick, 1000);
      }
    };
    setTimeout(tick, 1000);
  }, [countdown, captureFrame, stopStream]);

  const handleRetake = () => {
    setPreviewUrl(null);
    previewCanvasRef.current = null;
    void startStream();
  };

  const handleConfirm = () => {
    if (previewCanvasRef.current) {
      onCapture(previewCanvasRef.current);
    }
  };

  const handleCancel = () => {
    stopStream();
    onClose();
  };

  return (
    <ModalShell
      onClose={handleCancel}
      ariaLabel={t("tryon.camera.title")}
      maxWidthClass="max-w-[520px]"
    >
      <div className="p-5 sm:p-6">
        <div className="h-[2px] w-[40px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-3" />
        <h2 className="font-serif text-xl text-charcoal">
          {t("tryon.camera.title")}
        </h2>
        <p className="mt-2 text-xs text-charcoal-light">
          {t("tryon.camera.guide")}
        </p>

        <div className="mt-4 relative aspect-square bg-charcoal rounded-sm overflow-hidden">
          {!previewUrl ? (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
              {/* Circular face guide */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none flex items-center justify-center"
              >
                <div
                  className="rounded-full border-2 border-dashed border-soft-white/80"
                  style={{
                    width: "70%",
                    aspectRatio: "1 / 1",
                  }}
                />
              </div>
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="text-soft-white font-serif text-7xl">
                    {countdown}
                  </span>
                </div>
              )}
            </>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={t("tryon.camera.title")}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>

        {error && (
          <p className="mt-3 text-sm text-vermillion-dark" role="alert">
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-col-reverse sm:flex-row gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 border border-charcoal/20 px-4 py-3 text-xs uppercase tracking-[0.2em] text-charcoal hover:border-vermillion hover:text-vermillion transition-colors"
          >
            {t("tryon.camera.cancel")}
          </button>
          {!previewUrl ? (
            <button
              type="button"
              onClick={startCountdown}
              disabled={!!error || countdown !== null}
              className="flex-1 bg-vermillion px-4 py-3 text-xs uppercase tracking-[0.2em] text-soft-white hover:bg-vermillion-dark transition-colors disabled:opacity-50"
            >
              {countdown !== null
                ? t("tryon.camera.countdown")
                : t("tryon.camera.capture")}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 border border-vermillion text-vermillion px-4 py-3 text-xs uppercase tracking-[0.2em] hover:bg-vermillion hover:text-soft-white transition-colors"
              >
                {t("tryon.camera.retake")}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 bg-vermillion px-4 py-3 text-xs uppercase tracking-[0.2em] text-soft-white hover:bg-vermillion-dark transition-colors"
              >
                {t("tryon.camera.capture")}
              </button>
            </>
          )}
        </div>
      </div>
    </ModalShell>
  );
}

/* ──────────────────────────────────────────────
   QuizModal — face shape quiz + recommendations
   ────────────────────────────────────────────── */
function QuizModal({
  onClose,
  onPickStyle,
  t,
}: {
  onClose: () => void;
  onPickStyle: (id: string) => void;
  t: (k: string) => string;
}) {
  const [step, setStep] = useState(0);
  // Track chosen option ids per question.
  const [answers, setAnswers] = useState<(string | null)[]>(
    () => FACE_SHAPE_QUIZ.map(() => null),
  );
  const [shape, setShape] = useState<FaceShape | null>(null);

  const total = FACE_SHAPE_QUIZ.length;
  const isResult = step >= total;
  const current = FACE_SHAPE_QUIZ[step];

  const selectOption = (qIndex: number, optionId: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optionId;
      return next;
    });
    // Auto-advance for snappier flow.
    if (qIndex + 1 < total) {
      setStep(qIndex + 1);
    } else {
      computeResult([
        ...answers.slice(0, qIndex),
        optionId,
        ...answers.slice(qIndex + 1),
      ]);
    }
  };

  const computeResult = (finalAnswers: (string | null)[]) => {
    const votes: Partial<Record<FaceShape, number>> = {};
    FACE_SHAPE_QUIZ.forEach((q, i) => {
      const answerId = finalAnswers[i];
      if (!answerId) return;
      const opt = q.options.find((o) => o.id === answerId);
      if (!opt) return;
      for (const [shape, weight] of Object.entries(opt.weights)) {
        const s = shape as FaceShape;
        votes[s] = (votes[s] ?? 0) + (weight ?? 0);
      }
    });
    setShape(resolveFaceShape(votes));
    setStep(total);
    try {
      localStorage.setItem(QUIZ_STORAGE_KEY, "true");
    } catch {
      // ignore
    }
  };

  const handleNext = () => {
    if (step + 1 >= total) {
      computeResult(answers);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const recommendations =
    isResult && shape ? recommendedStylesFor(shape) : [];

  return (
    <ModalShell
      onClose={onClose}
      ariaLabel={t("tryon.quiz.title")}
      maxWidthClass="max-w-[520px]"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.3em] text-vermillion-dark">
            {t("tryon.quiz.title")}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="text-[10px] uppercase tracking-[0.2em] text-charcoal-light hover:text-vermillion transition-colors"
          >
            {t("tryon.quiz.skip")}
          </button>
        </div>

        <div className="h-[2px] w-[40px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mt-3 mb-3" />

        {!isResult && current && (
          <>
            <p className="text-xs text-charcoal-light">
              {step + 1} / {total}
            </p>
            <h2 className="mt-2 font-serif text-xl text-charcoal">
              {t(current.promptKey)}
            </h2>
            <p className="mt-1 text-xs text-charcoal-light">
              {t("tryon.quiz.subtitle")}
            </p>

            <div className="mt-5 grid gap-2">
              {current.options.map((opt) => {
                const active = answers[step] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => selectOption(step, opt.id)}
                    aria-pressed={active}
                    className={`text-left border px-4 py-3 text-sm transition-colors ${
                      active
                        ? "border-vermillion bg-vermillion/5 text-vermillion-dark"
                        : "border-charcoal/15 bg-cream/30 hover:border-vermillion/40"
                    }`}
                  >
                    {t(opt.labelKey)}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 0}
                className="text-xs uppercase tracking-[0.2em] text-charcoal-light hover:text-vermillion transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {t("tryon.quiz.back")}
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!answers[step]}
                className="bg-vermillion px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-soft-white hover:bg-vermillion-dark transition-colors disabled:opacity-50"
              >
                {t("tryon.quiz.next")}
              </button>
            </div>
          </>
        )}

        {isResult && shape && (
          <>
            <h2 className="font-serif text-xl text-charcoal">
              {t("tryon.quiz.result.title").replace(
                "{shape}",
                t(`tryon.quiz.shape.${shape}`),
              )}
            </h2>
            <p className="mt-2 text-sm text-charcoal-light">
              {t("tryon.quiz.result.subtitle")}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {recommendations.map((s) => (
                <div
                  key={s.id}
                  className="border border-vermillion/20 bg-cream/30 p-3 flex flex-col"
                >
                  <div className="aspect-[2/1] bg-cream-dark/30 flex items-center justify-center p-1">
                    <StylePreview style={s} />
                  </div>
                  <p className="mt-2 text-[11px] leading-tight text-charcoal font-medium">
                    {t(s.nameKey)}
                  </p>
                  <p className="mt-1 text-[10px] text-vermillion-dark uppercase tracking-[0.1em]">
                    {t("tryon.price.from")} S${s.priceFrom}
                  </p>
                  <button
                    type="button"
                    onClick={() => onPickStyle(s.id)}
                    className="mt-auto bg-vermillion px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-soft-white hover:bg-vermillion-dark transition-colors"
                  >
                    {t("tryon.quiz.result.try")}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 text-right">
              <button
                type="button"
                onClick={onClose}
                className="text-xs uppercase tracking-[0.2em] text-charcoal-light hover:text-vermillion transition-colors"
              >
                {t("tryon.save.cancel")}
              </button>
            </div>
          </>
        )}
      </div>
    </ModalShell>
  );
}
