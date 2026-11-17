"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { FaceLandmarker } from "@mediapipe/tasks-vision";
import {
  allPass,
  computePose,
  DEFAULT_GUIDES,
  evaluate,
  guidesInPixels,
  redFromY,
  yellowOffsetFromX,
  yellowPositions,
  type Check,
  type FacePose,
  type GuideLines,
  type Tilt,
} from "@/lib/selfie-guide";

const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
const WASM_BASE = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const WHATSAPP = "6589308973";
/** All checks must hold this long before the countdown starts. */
const HOLD_MS = 800;
const COUNTDOWN = 3;

/** Vercel rejects request bodies over 4.5 MB; stay under it with room for the form fields. */
const MAX_UPLOAD_BYTES = 4_000_000;
const MAX_LIBRARY_SIDE = 3024;

type Stage = "intro" | "camera" | "review" | "sent";
type Source = "camera" | "library";

/** Encode a canvas as JPEG, lowering quality until it fits the upload limit. */
async function encodeJpeg(canvas: HTMLCanvasElement): Promise<Blob | null> {
  let quality = 0.95;
  for (;;) {
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", quality));
    if (!blob || blob.size <= MAX_UPLOAD_BYTES || quality <= 0.6) return blob;
    quality -= 0.07;
  }
}
type ModelState = "loading" | "ready" | "failed";
type Dragging = "yellow" | "redA" | "redB" | null;

const STEPS = [
  "Stand facing a window or bright light. No light from behind you.",
  "Tie your hair back and remove glasses. Keep a relaxed, neutral face.",
  "Hold the phone upright at eye level, arm straight out in front of you.",
  "Line the green line down the middle of your face, from forehead to chin.",
  "Look straight into the camera lens, not at the screen.",
  "Hold still. The photo is taken automatically when every check turns green.",
];

/* ─────────────── Guide grid overlay ─────────────── */

function GuideGrid({
  guides,
  setGuides,
}: {
  guides: GuideLines;
  setGuides: (g: GuideLines) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<Dragging>(null);
  const [yl, yr] = yellowPositions(guides.yellowOffset);

  const start = (which: Dragging) => (e: ReactPointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    setDrag(which);
  };

  const move = (e: ReactPointerEvent) => {
    if (!drag || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    if (drag === "yellow") setGuides({ ...guides, yellowOffset: yellowOffsetFromX(x) });
    else if (drag === "redA") setGuides({ ...guides, redA: redFromY(y) });
    else setGuides({ ...guides, redB: redFromY(y) });
  };

  const end = () => setDrag(null);

  const vHandle = (x: number, key: string) => (
    <div
      key={key}
      onPointerDown={start("yellow")}
      className="absolute top-0 bottom-0 w-10 -ml-5 cursor-ew-resize touch-none flex justify-center"
      style={{ left: `${x * 100}%` }}
      aria-label="Yellow guide line. Drag to move both yellow lines."
    >
      <div className="h-full w-[2px] bg-yellow-300 shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
      <div className="absolute bottom-6 h-6 w-6 rounded-full border-2 border-yellow-300 bg-black/40" />
    </div>
  );

  const hHandle = (y: number, which: "redA" | "redB") => (
    <div
      key={which}
      onPointerDown={start(which)}
      className="absolute left-0 right-0 h-10 -mt-5 cursor-ns-resize touch-none flex items-center"
      style={{ top: `${y * 100}%` }}
      aria-label="Red guide line. Drag to move."
    >
      <div className="w-full h-[2px] bg-red-500 shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
      <div className="absolute right-3 h-6 w-6 rounded-full border-2 border-red-500 bg-black/40" />
    </div>
  );

  return (
    <div
      ref={ref}
      className="absolute inset-0 select-none"
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
    >
      {/* Green centre line: fixed. */}
      <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 w-[2px] -ml-px bg-green-400 shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
      {vHandle(yl, "yl")}
      {vHandle(yr, "yr")}
      {hHandle(guides.redA, "redA")}
      {hHandle(guides.redB, "redB")}
    </div>
  );
}

/* ─────────────── Main component ─────────────── */

export default function BrowSelfieCamera() {
  const [stage, setStage] = useState<Stage>("intro");
  const [guides, setGuides] = useState<GuideLines>(DEFAULT_GUIDES);
  const [model, setModel] = useState<ModelState>("loading");
  const [camError, setCamError] = useState<string | null>(null);
  const [dims, setDims] = useState({ w: 9, h: 16 });
  const [checks, setChecks] = useState<Check[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [autoCapture, setAutoCapture] = useState(true);
  const [portraitWarning, setPortraitWarning] = useState(false);

  const [shot, setShot] = useState<{
    blob: Blob;
    url: string;
    source: Source;
    checks: Check[];
    meta: Record<string, unknown>;
  } | null>(null);
  const [libraryBusy, setLibraryBusy] = useState(false);
  const [libraryError, setLibraryError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const tiltRef = useRef<Tilt | null>(null);
  const poseRef = useRef<FacePose | null>(null);
  const guidesRef = useRef(guides);
  const passSinceRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);
  const autoRef = useRef(autoCapture);

  useEffect(() => {
    guidesRef.current = guides;
  }, [guides]);
  useEffect(() => {
    autoRef.current = autoCapture;
  }, [autoCapture]);

  /* Load the face model once. */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const vision = await import("@mediapipe/tasks-vision");
        const fileset = await vision.FilesetResolver.forVisionTasks(WASM_BASE);
        const lm = await vision.FaceLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
          runningMode: "VIDEO",
          numFaces: 1,
        });
        if (cancelled) lm.close();
        else {
          landmarkerRef.current = lm;
          setModel("ready");
        }
      } catch (err) {
        console.error("Face model failed to load", err);
        if (!cancelled) setModel("failed");
      }
    })();
    return () => {
      cancelled = true;
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, []);

  /* Phone tilt. */
  useEffect(() => {
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      tiltRef.current = { beta: e.beta, gamma: e.gamma };
    };
    window.addEventListener("deviceorientation", onTilt);
    return () => window.removeEventListener("deviceorientation", onTilt);
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  const startCamera = useCallback(async () => {
    setCamError(null);
    // iOS asks for motion permission; it must be requested from a tap.
    const DOE = (globalThis as { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } })
      .DeviceOrientationEvent;
    if (DOE?.requestPermission) {
      try {
        await DOE.requestPermission();
      } catch {
        /* user declined; phone checks are skipped */
      }
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: "user", width: { ideal: 1920 }, height: { ideal: 1920 } },
      });
      streamRef.current = stream;
      setStage("camera");
    } catch (err) {
      console.error(err);
      setCamError(
        "The camera could not start. Allow camera access for this site in your browser settings, then try again.",
      );
    }
  }, []);

  /* Attach the stream once the video element is mounted. */
  useEffect(() => {
    if (stage !== "camera") return;
    const v = videoRef.current;
    if (!v || !streamRef.current) return;
    v.srcObject = streamRef.current;
    const onMeta = () => setDims({ w: v.videoWidth, h: v.videoHeight });
    v.addEventListener("loadedmetadata", onMeta);
    v.play().catch(() => undefined);
    return () => v.removeEventListener("loadedmetadata", onMeta);
  }, [stage]);

  const capture = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;
    const w = v.videoWidth;
    const h = v.videoHeight;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Saved unmirrored: this is the true image the camera sees.
    ctx.drawImage(v, 0, 0, w, h);

    const pose = poseRef.current;
    const tilt = tiltRef.current;
    const g = guidesRef.current;
    const round = (n: number, d = 3) => Math.round(n * 10 ** d) / 10 ** d;
    const meta = {
      takenAt: new Date().toISOString(),
      source: "camera",
      image: { width: w, height: h, mirrored: false },
      checksPassed: allPass(evaluate(pose, tilt)),
      pose: pose
        ? { rollDeg: round(pose.rollDeg, 2), yaw: round(pose.yaw), centreX: round(pose.centreX), faceWidth: round(pose.faceWidth) }
        : null,
      tilt: tilt ? { beta: round(tilt.beta, 1), gamma: round(tilt.gamma, 1) } : null,
      guides: g,
      // Grid is symmetric, so preview mirroring does not change these.
      guidesPx: guidesInPixels(g, w, h),
      userAgent: navigator.userAgent,
    };

    const checksNow = evaluate(pose, tilt);
    encodeJpeg(canvas).then((blob) => {
      if (!blob) return;
      setShot({ blob, url: URL.createObjectURL(blob), source: "camera", checks: checksNow, meta });
      setStage("review");
      stopCamera();
    });
  }, [stopCamera]);

  /* A photo picked from the library: same checks, minus phone tilt. */
  const pickFromLibrary = useCallback(
    async (file: File) => {
      setLibraryError(null);
      setLibraryBusy(true);
      try {
        // Applies the EXIF rotation so the pixels are upright.
        const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
        const scale = Math.min(1, MAX_LIBRARY_SIDE / Math.max(bmp.width, bmp.height));
        const w = Math.round(bmp.width * scale);
        const h = Math.round(bmp.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no canvas");
        ctx.drawImage(bmp, 0, 0, w, h);
        bmp.close();

        let pose: FacePose | null = null;
        const lm = landmarkerRef.current;
        if (lm) {
          await lm.setOptions({ runningMode: "IMAGE" });
          try {
            const pts = lm.detect(canvas).faceLandmarks?.[0];
            pose = pts ? computePose(pts, w / h) : null;
          } finally {
            await lm.setOptions({ runningMode: "VIDEO" });
          }
        }
        const checksNow = lm ? evaluate(pose, null) : [];
        const blob = await encodeJpeg(canvas);
        if (!blob) throw new Error("encode failed");

        const round = (n: number, d = 3) => Math.round(n * 10 ** d) / 10 ** d;
        const g = guidesRef.current;
        const meta = {
          takenAt: new Date(file.lastModified || Date.now()).toISOString(),
          source: "library",
          image: { width: w, height: h, mirrored: false },
          checksPassed: lm ? allPass(checksNow) : null,
          pose: pose
            ? { rollDeg: round(pose.rollDeg, 2), yaw: round(pose.yaw), centreX: round(pose.centreX), faceWidth: round(pose.faceWidth) }
            : null,
          tilt: null,
          guides: g,
          guidesPx: guidesInPixels(g, w, h),
          userAgent: navigator.userAgent,
        };
        stopCamera();
        setDims({ w, h });
        setShot({ blob, url: URL.createObjectURL(blob), source: "library", checks: checksNow, meta });
        setStage("review");
      } catch (err) {
        console.error(err);
        setLibraryError("That photo could not be opened. Choose a JPEG or PNG photo, or use the camera.");
      } finally {
        setLibraryBusy(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    },
    [stopCamera],
  );

  /* Detection loop: pose → checks → auto-capture countdown. */
  useEffect(() => {
    if (stage !== "camera") return;
    let raf = 0;
    let lastTs = -1;
    let lastCheckUpdate = 0;
    let tick: ReturnType<typeof setInterval> | null = null;

    const cancelCountdown = () => {
      if (tick) clearInterval(tick);
      tick = null;
      countdownRef.current = null;
      setCountdown(null);
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const v = videoRef.current;
      const lm = landmarkerRef.current;
      if (!v || v.readyState < 2) return;

      const now = performance.now();
      if (lm && v.currentTime !== lastTs) {
        lastTs = v.currentTime;
        try {
          const res = lm.detectForVideo(v, now);
          const pts = res.faceLandmarks?.[0];
          poseRef.current = pts ? computePose(pts, v.videoWidth / v.videoHeight) : null;
        } catch {
          poseRef.current = null;
        }
      }

      const isPortraitDevice = window.matchMedia("(pointer: coarse)").matches;
      const landscape = isPortraitDevice && window.innerWidth > window.innerHeight;
      const tilt = landscape ? null : tiltRef.current;
      const current = model === "failed" ? [] : evaluate(poseRef.current, tilt);
      const pass = !landscape && model !== "loading" && allPass(current);

      if (now - lastCheckUpdate > 150) {
        lastCheckUpdate = now;
        setChecks(current);
        setPortraitWarning(landscape);
      }

      if (!pass) {
        passSinceRef.current = null;
        if (countdownRef.current !== null) cancelCountdown();
        return;
      }
      passSinceRef.current ??= now;
      if (
        autoRef.current &&
        countdownRef.current === null &&
        now - passSinceRef.current >= HOLD_MS
      ) {
        countdownRef.current = COUNTDOWN;
        setCountdown(COUNTDOWN);
        tick = setInterval(() => {
          const next = (countdownRef.current ?? 1) - 1;
          if (next <= 0) {
            cancelCountdown();
            capture();
          } else {
            countdownRef.current = next;
            setCountdown(next);
          }
        }, 1000);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      if (tick) clearInterval(tick);
      countdownRef.current = null;
    };
  }, [stage, model, capture]);

  const retake = () => {
    if (shot) URL.revokeObjectURL(shot.url);
    setShot(null);
    setSendError(null);
    passSinceRef.current = null;
    startCamera();
  };

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!shot) return;
    setSending(true);
    setSendError(null);
    const finalMeta = { ...shot.meta, guides, guidesPx: guidesInPixels(guides, dims.w, dims.h) };
    const fd = new FormData();
    fd.append("photo", shot.blob, "selfie.jpg");
    fd.append("name", name);
    fd.append("phone", phone);
    fd.append("meta", JSON.stringify(finalMeta));
    try {
      const res = await fetch("/api/brow-selfie", { method: "POST", body: fd });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Upload failed");
      setStage("sent");
    } catch (err) {
      setSendError(
        `${err instanceof Error ? err.message : "Upload failed"}. Use "Save photo" below and send it to us on WhatsApp instead.`,
      );
    } finally {
      setSending(false);
    }
  };

  const shareOrSave = async () => {
    if (!shot) return;
    const file = new File([shot.blob], "brow-selfie.jpg", { type: "image/jpeg" });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (nav.canShare?.({ files: [file] })) {
      try {
        await nav.share({ files: [file], title: "Brow selfie" });
        return;
      } catch {
        /* cancelled: fall through to download */
      }
    }
    const a = document.createElement("a");
    a.href = shot.url;
    a.download = "brow-selfie.jpg";
    a.click();
  };

  const failing = checks.find((c) => !c.ok);
  const ready = model !== "loading" && checks.length > 0 && !failing && !portraitWarning;
  const frameStyle = {
    aspectRatio: `${dims.w} / ${dims.h}`,
    width: `min(100%, calc((100dvh - 190px) * ${dims.w / dims.h}))`,
  };

  const libraryInput = (
    <input
      ref={fileRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const f = e.target.files?.[0];
        if (f) pickFromLibrary(f);
      }}
    />
  );
  const failedLabels = shot ? shot.checks.filter((c) => !c.ok).map((c) => c.label) : [];

  /* ─────────────── Screens ─────────────── */

  if (stage === "intro") {
    return (
      <div className="fixed inset-0 z-[10000] overflow-y-auto bg-neutral-950 text-white">
        <div className="mx-auto max-w-md px-5 py-8">
          <p className="text-[11px] uppercase tracking-[0.3em] text-green-400">Shimmyhands brows</p>
          <h1 className="mt-3 font-serif text-3xl">Brow mapping selfie</h1>
          <p className="mt-3 text-sm text-white/70">
            We use this photo to measure your face before your appointment. It must be taken straight on.
            The camera checks your position and only takes the photo when it is level.
          </p>
          <ol className="mt-6 space-y-3">
            {STEPS.map((s, i) => (
              <li key={s} className="flex gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs">
                  {i + 1}
                </span>
                <span className="text-white/85">{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 rounded-lg border border-white/10 p-4 text-xs text-white/70 space-y-1.5">
            <p><span className="text-green-400 font-semibold">Green</span>: centre of your face. Fixed.</p>
            <p><span className="text-yellow-300 font-semibold">Yellow</span>: drag either one; both move together, mirror-image.</p>
            <p><span className="text-red-500 font-semibold">Red</span>: drag each one separately, e.g. to your brow line and eye line.</p>
          </div>
          {camError && <p className="mt-4 text-sm text-red-400">{camError}</p>}
          {libraryError && <p className="mt-4 text-sm text-red-400">{libraryError}</p>}
          <button
            onClick={startCamera}
            className="mt-6 w-full rounded-full bg-green-500 py-3.5 font-semibold text-black active:scale-[0.98]"
          >
            Start camera
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={libraryBusy}
            className="mt-3 w-full rounded-full border border-white/30 py-3.5 text-sm disabled:opacity-50"
          >
            {libraryBusy ? "Checking photo…" : "Choose from photo library"}
          </button>
          <p className="mt-2 text-center text-[11px] text-white/50">
            A library photo must also be straight on, at eye level, with no filters.
          </p>
          {libraryInput}
          <p className="mt-3 text-center text-[11px] text-white/50">
            Your photo is only sent when you press Send. It is not stored on this website.
          </p>
        </div>
      </div>
    );
  }

  if (stage === "sent") {
    return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-neutral-950 px-6 text-center text-white">
        <div className="max-w-sm">
          <h1 className="font-serif text-3xl">Photo received</h1>
          <p className="mt-3 text-sm text-white/70">
            Thank you. We will review your measurements and contact you before your appointment if anything needs discussing.
          </p>
          <a href="/brows" className="mt-6 inline-block rounded-full border border-white/30 px-6 py-3 text-sm">
            Back to Shimmyhands
          </a>
        </div>
      </div>
    );
  }

  if (stage === "review" && shot) {
    return (
      <div className="fixed inset-0 z-[10000] overflow-y-auto bg-neutral-950 text-white">
        <div className="mx-auto flex max-w-md flex-col items-center px-4 py-4">
          <div className="relative overflow-hidden rounded-lg bg-black" style={frameStyle}>
            {/* Shown mirrored to match the preview the customer just saw; the file itself is unmirrored. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shot.url}
              alt="Your selfie"
              className={`h-full w-full object-contain ${shot.source === "camera" ? "-scale-x-100" : ""}`}
            />
            <GuideGrid guides={guides} setGuides={setGuides} />
          </div>
          {shot.source === "library" && shot.checks.length > 0 && failedLabels.length === 0 && (
            <p className="mt-3 text-xs text-green-300">This photo passed the straightness checks.</p>
          )}
          {failedLabels.length > 0 && (
            <p className="mt-3 text-xs text-yellow-300">
              This photo did not pass: {failedLabels.join(", ")}. Measurements may be inaccurate.
              Retaking with the camera is recommended.
            </p>
          )}
          {shot.source === "library" && shot.checks.length === 0 && (
            <p className="mt-3 text-xs text-yellow-300">
              The face checker is unavailable, so this photo could not be checked.
            </p>
          )}
          {libraryError && <p className="mt-3 text-xs text-red-400">{libraryError}</p>}
          <form onSubmit={send} className="mt-4 w-full space-y-3">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={100}
              className="w-full rounded-lg bg-white/10 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="WhatsApp number"
              inputMode="tel"
              pattern="[+\d\s\-()]{6,20}"
              className="w-full rounded-lg bg-white/10 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
            />
            {sendError && <p className="text-xs text-red-400">{sendError}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={retake} className="flex-1 rounded-full border border-white/30 py-3 text-sm">
                {shot.source === "camera" ? "Retake" : "Use camera"}
              </button>
              <button
                type="submit"
                disabled={sending}
                className="flex-[2] rounded-full bg-green-500 py-3 text-sm font-semibold text-black disabled:opacity-50"
              >
                {sending ? "Sending…" : "Send to Shimmy"}
              </button>
            </div>
            <div className="flex justify-center gap-4 pt-1 text-xs text-white/60">
              <button type="button" onClick={() => fileRef.current?.click()} className="underline">
                Choose another photo
              </button>
              <button type="button" onClick={shareOrSave} className="underline">Save photo</button>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="underline">
                Open WhatsApp
              </a>
            </div>
          </form>
          {libraryInput}
        </div>
      </div>
    );
  }

  /* Camera */
  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center bg-black text-white">
      <div
        className={`mt-2 mx-4 rounded-full px-4 py-2 text-center text-sm font-medium transition-colors ${
          ready ? "bg-green-500 text-black" : "bg-white/10"
        }`}
        role="status"
        aria-live="polite"
      >
        {model === "loading"
          ? "Loading face checker…"
          : portraitWarning
            ? "Turn the phone upright (portrait)."
            : ready
              ? countdown
                ? "Hold still…"
                : "Perfect. Hold still."
              : (failing?.fix ?? "Position your face in the frame.")}
      </div>

      <div className="relative mt-2 overflow-hidden rounded-lg bg-neutral-900" style={frameStyle}>
        <video
          ref={videoRef}
          playsInline
          muted
          className="h-full w-full -scale-x-100 object-contain"
        />
        <GuideGrid guides={guides} setGuides={setGuides} />
        {countdown !== null && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-8xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{countdown}</span>
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap justify-center gap-1.5 px-3">
        {checks.map((c) => (
          <span
            key={c.id}
            className={`rounded-full px-2.5 py-1 text-[10px] ${c.ok ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}
          >
            {c.ok ? "✓" : "✕"} {c.label}
          </span>
        ))}
        {model === "failed" && (
          <span className="rounded-full bg-yellow-500/20 px-2.5 py-1 text-[10px] text-yellow-200">
            Face checker unavailable. Line up using the grid.
          </span>
        )}
      </div>

      <div className="mt-auto mb-4 flex w-full max-w-md items-center justify-between px-6">
        <label className="flex items-center gap-2 text-xs text-white/70">
          <input type="checkbox" checked={autoCapture} onChange={(e) => setAutoCapture(e.target.checked)} />
          Auto
        </label>
        <button
          onClick={capture}
          disabled={!ready && model !== "failed"}
          aria-label="Take photo"
          className="h-16 w-16 rounded-full border-4 border-white bg-white/20 disabled:opacity-30 enabled:bg-green-500"
        />
        <div className="flex flex-col items-end gap-2">
          <button onClick={() => fileRef.current?.click()} className="text-xs text-white/70 underline">
            Library
          </button>
          <button onClick={() => setGuides(DEFAULT_GUIDES)} className="text-xs text-white/70 underline">
            Reset lines
          </button>
        </div>
        {libraryInput}
      </div>
    </div>
  );
}
