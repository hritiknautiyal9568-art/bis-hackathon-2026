"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  Camera,
  CameraOff,
  SwitchCamera,
  Scan,
  Loader2,
  X,
  Upload,
  Maximize,
  Minimize,
  Zap,
  History,
  Trash2,
  Image as ImageIcon,
  Timer,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react";

interface ScanResult {
  id: string;
  timestamp: Date;
  mode: string;
  thumbnail: string;
  status: "success" | "error";
  summary: string;
}

interface LiveScannerProps {
  onCapture: (imageBase64: string, imageMimeType: string) => void;
  onFileUpload: (file: File) => void;
  scanning?: boolean;
  scanMode: "hallmark" | "product" | "label" | "barcode";
  onModeChange: (mode: "hallmark" | "product" | "label" | "barcode") => void;
  lastResult?: any;
  compact?: boolean;
}

const scanModes = [
  { id: "hallmark" as const, label: "Hallmark", icon: "🛡️", desc: "Scan ISI / BIS marks", color: "#003580" },
  { id: "product" as const, label: "Product", icon: "📦", desc: "Full product analysis", color: "#FF9933" },
  { id: "label" as const, label: "Label", icon: "🏷️", desc: "Read product labels", color: "#138808" },
  { id: "barcode" as const, label: "Barcode", icon: "📊", desc: "Scan QR / barcode", color: "#7c3aed" },
];

export default function LiveScanner({
  onCapture,
  onFileUpload,
  scanning = false,
  scanMode,
  onModeChange,
  lastResult,
  compact = false,
}: LiveScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [streamRef, setStreamRef] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<"prompt" | "granted" | "denied">("prompt");
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [autoScanEnabled, setAutoScanEnabled] = useState(false);
  const [autoScanCountdown, setAutoScanCountdown] = useState(0);
  const [scanLineY, setScanLineY] = useState(0);
  const scanLineRef = useRef<number | null>(null);

  // Animated scan line
  useEffect(() => {
    if (cameraActive && !scanning) {
      let direction = 1;
      let pos = 0;
      const animate = () => {
        pos += direction * 0.8;
        if (pos >= 100) direction = -1;
        if (pos <= 0) direction = 1;
        setScanLineY(pos);
        scanLineRef.current = requestAnimationFrame(animate);
      };
      scanLineRef.current = requestAnimationFrame(animate);
      return () => {
        if (scanLineRef.current) cancelAnimationFrame(scanLineRef.current);
      };
    }
  }, [cameraActive, scanning]);

  // Auto-scan continuous mode
  useEffect(() => {
    if (autoScanEnabled && cameraActive && !scanning) {
      let countdown = 3;
      setAutoScanCountdown(countdown);
      const interval = setInterval(() => {
        countdown -= 1;
        setAutoScanCountdown(countdown);
        if (countdown <= 0) {
          clearInterval(interval);
          captureFrame();
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoScanEnabled, cameraActive, scanning, lastResult]);

  const pendingStreamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      if (streamRef) {
        streamRef.getTracks().forEach((t) => t.stop());
      }

      // Try requested facingMode first, then fallback to any available camera
      let stream: MediaStream | null = null;
      const constraints = [
        { video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } } },
        { video: { facingMode: facingMode === "environment" ? "user" : "environment", width: { ideal: 1280 }, height: { ideal: 720 } } },
        { video: true },
      ];

      for (const constraint of constraints) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraint);
          break;
        } catch {
          continue;
        }
      }

      if (!stream) {
        throw new Error("No camera available");
      }

      // Store stream and activate camera — the useEffect below will attach stream to video
      pendingStreamRef.current = stream;
      setStreamRef(stream);
      setCameraActive(true);
      setCameraPermission("granted");
      setCapturedPreview(null);
    } catch (err: any) {
      console.error("Camera error:", err);
      setCameraPermission("denied");
      if (err.name === "NotAllowedError") {
        setError("Camera access denied. Please allow camera permission.");
      } else if (err.name === "NotFoundError") {
        setError("No camera found. Use the upload option instead.");
      } else {
        setError("Could not access camera. Try upload instead.");
      }
    }
  }, [facingMode, streamRef]);

  // Attach stream to video element once it's rendered
  useEffect(() => {
    const stream = pendingStreamRef.current;
    if (cameraActive && stream && videoRef.current) {
      const video = videoRef.current;
      video.srcObject = stream;
      video.play().catch((e) => console.error("Video play error:", e));
      pendingStreamRef.current = null;
    }
  }, [cameraActive]);

  const stopCamera = useCallback(() => {
    if (streamRef) {
      streamRef.getTracks().forEach((t) => t.stop());
      setStreamRef(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setAutoScanEnabled(false);
  }, [streamRef]);

  const switchCamera = useCallback(() => {
    stopCamera();
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  }, [stopCamera]);

  useEffect(() => {
    if (cameraActive || cameraPermission === "granted") {
      const timer = setTimeout(() => startCamera(), 300);
      return () => clearTimeout(timer);
    }
  }, [facingMode]);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    // Ensure video is actually producing frames before capturing
    if (video.videoWidth === 0 || video.videoHeight === 0 || video.readyState < 2) {
      console.warn("Video not ready yet, skipping capture");
      return;
    }

    const canvas = canvasRef.current;

    // Resize to max 1280px on longest side for optimal Gemini processing
    const MAX_DIM = 1280;
    let w = video.videoWidth;
    let h = video.videoHeight;
    if (w > MAX_DIM || h > MAX_DIM) {
      const scale = MAX_DIM / Math.max(w, h);
      w = Math.round(w * scale);
      h = Math.round(h * scale);
    }
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    const base64 = dataUrl.split(",")[1];

    if (!base64 || base64.length < 100) {
      console.warn("Captured image too small/empty, skipping");
      return;
    }

    setCapturedPreview(dataUrl);

    if (navigator.vibrate) navigator.vibrate(50);

    onCapture(base64, "image/jpeg");
  }, [onCapture]);

  const instantScan = useCallback(async () => {
    if (!cameraActive) {
      await startCamera();
      // Wait for video to actually produce frames (poll every 200ms, max 5s)
      const waitForVideo = () => {
        return new Promise<void>((resolve) => {
          let attempts = 0;
          const check = () => {
            attempts++;
            const video = videoRef.current;
            if (video && video.videoWidth > 0 && video.videoHeight > 0 && video.readyState >= 2) {
              resolve();
            } else if (attempts < 25) {
              setTimeout(check, 200);
            } else {
              resolve(); // Give up after 5s, captureFrame will validate
            }
          };
          setTimeout(check, 300); // Initial delay before first check
        });
      };
      await waitForVideo();
      captureFrame();
    } else {
      captureFrame();
    }
  }, [cameraActive, startCamera, captureFrame]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setCapturedPreview(reader.result as string);
      reader.readAsDataURL(file);
      onFileUpload(file);
    }
  };

  useEffect(() => {
    if (lastResult && capturedPreview) {
      const newEntry: ScanResult = {
        id: Date.now().toString(),
        timestamp: new Date(),
        mode: scanMode,
        thumbnail: capturedPreview,
        status: lastResult.error ? "error" : "success",
        summary: lastResult.productName || lastResult.productIdentified || lastResult.overallAssessment?.slice(0, 60) || "Scan completed",
      };
      setScanHistory((prev) => [newEntry, ...prev].slice(0, 10));
    }
  }, [lastResult]);

  useEffect(() => {
    return () => {
      if (streamRef) {
        streamRef.getTracks().forEach((t) => t.stop());
      }
    };
  }, [streamRef]);

  const activeMode = scanModes.find((m) => m.id === scanMode)!;

  return (
    <div className="space-y-3">
      {/* Scan Mode Selector - Pill style */}
      <div className="flex gap-1.5 bg-gray-100 rounded-2xl p-1">
        {scanModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              scanMode === mode.id
                ? "bg-white text-gray-900 shadow-md scale-[1.02]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="text-sm">{mode.icon}</span>
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        ))}
      </div>

      {/* Camera View */}
      <div className={`relative bg-gray-950 rounded-2xl overflow-hidden group ${
        fullscreen ? "fixed inset-0 z-50 rounded-none" : ""
      }`}>
        {/* Video element always mounted so ref is available — hidden when camera is off */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full object-cover ${compact ? "h-[240px]" : "h-[320px] sm:h-[380px]"} ${!cameraActive ? "hidden" : ""}`}
        />
        {cameraActive ? (
          <>

            {/* Animated Scan Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-[12%]">
                {/* Top-left corner */}
                <div className="absolute -top-[2px] -left-[2px] w-10 h-10">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-[#FF9933] rounded-full shadow-[0_0_8px_rgba(255,153,51,0.6)]" />
                  <div className="absolute top-0 left-0 w-[3px] h-full bg-[#FF9933] rounded-full shadow-[0_0_8px_rgba(255,153,51,0.6)]" />
                </div>
                {/* Top-right corner */}
                <div className="absolute -top-[2px] -right-[2px] w-10 h-10">
                  <div className="absolute top-0 right-0 w-full h-[3px] bg-[#FF9933] rounded-full shadow-[0_0_8px_rgba(255,153,51,0.6)]" />
                  <div className="absolute top-0 right-0 w-[3px] h-full bg-[#FF9933] rounded-full shadow-[0_0_8px_rgba(255,153,51,0.6)]" />
                </div>
                {/* Bottom-left corner */}
                <div className="absolute -bottom-[2px] -left-[2px] w-10 h-10">
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#138808] rounded-full shadow-[0_0_8px_rgba(19,136,8,0.6)]" />
                  <div className="absolute bottom-0 left-0 w-[3px] h-full bg-[#138808] rounded-full shadow-[0_0_8px_rgba(19,136,8,0.6)]" />
                </div>
                {/* Bottom-right corner */}
                <div className="absolute -bottom-[2px] -right-[2px] w-10 h-10">
                  <div className="absolute bottom-0 right-0 w-full h-[3px] bg-[#138808] rounded-full shadow-[0_0_8px_rgba(19,136,8,0.6)]" />
                  <div className="absolute bottom-0 right-0 w-[3px] h-full bg-[#138808] rounded-full shadow-[0_0_8px_rgba(19,136,8,0.6)]" />
                </div>

                {/* Animated scan line */}
                {!scanning && (
                  <div
                    className="absolute left-0 right-0 h-[2px] transition-none"
                    style={{
                      top: `${scanLineY}%`,
                      background: `linear-gradient(90deg, transparent, ${activeMode.color}, transparent)`,
                      boxShadow: `0 0 15px ${activeMode.color}40, 0 0 30px ${activeMode.color}20`,
                    }}
                  />
                )}
              </div>

              {/* Scanning pulse */}
              {scanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-[12%] border-2 border-white/20 rounded-lg animate-pulse" />
                  <div className="bg-black/70 backdrop-blur-sm px-5 py-3 rounded-2xl flex items-center gap-3 shadow-2xl">
                    <div className="relative">
                      <Loader2 className="h-6 w-6 text-[#FF9933] animate-spin" />
                      <div className="absolute inset-0 h-6 w-6 border-2 border-[#FF9933]/30 rounded-full animate-ping" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">AI Analyzing...</p>
                      <p className="text-gray-400 text-[10px]">{activeMode.desc}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Auto-scan countdown */}
              {autoScanEnabled && !scanning && autoScanCountdown > 0 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                  <Timer className="h-4 w-4 text-[#FF9933]" />
                  <span className="text-white text-sm font-bold">Auto-scan in {autoScanCountdown}s</span>
                </div>
              )}

              {/* Mode indicator */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                <span className="text-sm">{activeMode.icon}</span>
                <span className="text-white text-xs font-medium">{activeMode.desc}</span>
              </div>
            </div>

            {/* Top Controls */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              <button
                onClick={() => setAutoScanEnabled(!autoScanEnabled)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  autoScanEnabled
                    ? "bg-[#FF9933] text-white shadow-lg"
                    : "bg-black/50 text-white/80 hover:bg-black/70"
                }`}
              >
                <Zap className="h-3.5 w-3.5" />
                Auto
              </button>

              <div className="flex gap-1.5">
                <button
                  onClick={() => setFullscreen(!fullscreen)}
                  className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </button>
                <button
                  onClick={switchCamera}
                  className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <SwitchCamera className="h-4 w-4" />
                </button>
                <button
                  onClick={stopCamera}
                  className="p-2 bg-red-500/80 rounded-full text-white hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Capture Button Bar */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
              {capturedPreview && (
                <div className="relative w-10 h-10 rounded-lg overflow-hidden border-2 border-white/50 shadow-lg">
                  <img src={capturedPreview} alt="Last capture" className="w-full h-full object-cover" />
                </div>
              )}

              <button
                onClick={captureFrame}
                disabled={scanning}
                className="relative w-[68px] h-[68px] rounded-full flex items-center justify-center transition-all disabled:opacity-50"
              >
                <div className="absolute inset-0 rounded-full ring-[3px] ring-white/80" />
                <div className={`w-[58px] h-[58px] rounded-full flex items-center justify-center transition-all ${
                  scanning
                    ? "bg-red-500"
                    : "bg-white hover:bg-gray-100 hover:scale-105 active:scale-95"
                }`}>
                  {scanning ? (
                    <Loader2 className="h-7 w-7 text-white animate-spin" />
                  ) : (
                    <Scan className="h-7 w-7 text-[#003580]" />
                  )}
                </div>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-lg bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <ImageIcon className="h-5 w-5" />
              </button>
            </div>
          </>
        ) : (
          <div className={`flex flex-col items-center justify-center text-center ${compact ? "py-10 px-4" : "py-16 px-6"}`}>
            {error ? (
              <>
                <div className="bg-red-500/20 p-3 rounded-full mb-3">
                  <CameraOff className="h-8 w-8 text-red-400" />
                </div>
                <p className="text-red-300 text-sm mb-4">{error}</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Upload Image Instead
                </button>
              </>
            ) : (
              <>
                <div className="relative mb-5">
                  <div className="absolute inset-0 bg-[#FF9933]/20 rounded-full animate-ping" style={{ animationDuration: "2s" }} />
                  <div className="relative bg-gradient-to-br from-[#003580] to-[#0052cc] p-5 rounded-full shadow-xl">
                    <Camera className="h-10 w-10 text-white" />
                  </div>
                </div>

                <p className="text-white font-bold text-lg mb-1">Instant AI Scanner</p>
                <p className="text-gray-400 text-xs mb-5 max-w-[280px]">
                  One tap to scan — camera opens and AI analyzes your product instantly
                </p>

                <button
                  onClick={instantScan}
                  className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF9933] to-[#e88a2a] text-white rounded-2xl font-bold text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
                >
                  <Zap className="h-5 w-5 group-hover:animate-pulse" />
                  Tap to Scan
                </button>

                <p className="text-gray-500 text-[10px] mt-3 flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  Camera opens → Auto captures → AI analyzes
                </p>
              </>
            )}
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Upload Alternative */}
      {!cameraActive && !error && (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={scanning}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-[#003580] hover:text-[#003580] hover:bg-blue-50/50 transition-all disabled:opacity-50 text-sm"
        >
          <Upload className="h-4 w-4" />
          Or upload an image
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <History className="h-3.5 w-3.5" />
              Scan History ({scanHistory.length})
            </div>
            {showHistory ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {showHistory && (
            <div className="border-t border-gray-100 max-h-[200px] overflow-y-auto">
              {scanHistory.map((entry) => (
                <div key={entry.id} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors border-b border-gray-50 last:border-0">
                  <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                    <img src={entry.thumbnail} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{entry.summary}</p>
                    <p className="text-[10px] text-gray-400">
                      {scanModes.find((m) => m.id === entry.mode)?.icon}{" "}
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    entry.status === "success" ? "bg-green-100" : "bg-red-100"
                  }`}>
                    {entry.status === "success" ? (
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
              <button
                onClick={() => setScanHistory([])}
                className="w-full flex items-center justify-center gap-1 py-2 text-[10px] text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                Clear History
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
