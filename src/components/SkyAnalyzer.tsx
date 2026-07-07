import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sparkles, RefreshCw, MapPin, AlertCircle, Brain, ArrowRight } from 'lucide-react';
import { SKY_PRESETS, SkyPreset } from '../utils/presets';
import { SkyAnalysisResult } from '../types';

interface SkyAnalyzerProps {
  onAnalysisComplete: (result: SkyAnalysisResult, imageSrc: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function SkyAnalyzer({ onAnalysisComplete, isLoading, setIsLoading }: SkyAnalyzerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [locationHint, setLocationHint] = useState('');
  const [analyzerStage, setAnalyzerStage] = useState<'idle' | 'scanning' | 'computing' | 'done'>('idle');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Trigger analysis
  const triggerAnalysis = async (base64Image: string) => {
    setIsLoading(true);
    setAnalyzerStage('scanning');
    setError(null);

    // Simulate different scanning phases for premium visual effect
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    
    try {
      await delay(1200);
      setAnalyzerStage('computing');
      await delay(1000);

      const response = await fetch('/api/analyze-sky', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          locationHint: locationHint.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Erreur serveur (${response.status})`);
      }

      const result: SkyAnalysisResult = await response.json();
      onAnalysisComplete(result, base64Image);
      setAnalyzerStage('done');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Une erreur est survenue lors de l'analyse. Veuillez réessayer.");
      setAnalyzerStage('idle');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Preset Click
  const handlePresetSelect = (preset: SkyPreset) => {
    setError(null);
    if (showCamera) {
      stopCamera();
    }
    const dataUrl = preset.generateDataUrl();
    setSelectedImage(dataUrl);
    setLocationHint(preset.location);
    triggerAnalysis(dataUrl);
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setError("L'image est trop volumineuse. Veuillez choisir une image de moins de 8 Mo.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        triggerAnalysis(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Start Camera Stream
  const startCamera = async () => {
    setError(null);
    setSelectedImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setShowCamera(true);
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setError("Impossible d'accéder à l'appareil photo. Utilisez un fichier ou les préréglages climatiques.");
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  // Capture Image from Video Stream
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setSelectedImage(dataUrl);
        stopCamera();
        triggerAnalysis(dataUrl);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6" id="sky-analyzer-container">
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-teal-950/80 border border-teal-800/50 rounded-lg">
          <Brain className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Analyse Climatique IA</h2>
          <p className="text-xs text-teal-300/70">Scannez le ciel ou l'environnement immédiat</p>
        </div>
      </div>

      {/* Analyzer Main Screen */}
      <div className="relative w-full aspect-video md:aspect-[4/3] rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden flex flex-col items-center justify-center group shadow-inner">
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/95 z-30 flex flex-col items-center justify-center p-6 select-none">
            {/* Spinning AI Hologram / Laser Scanner */}
            <div className="relative w-32 h-32 flex items-center justify-center mb-6">
              <div className="absolute inset-0 border-2 border-teal-500/20 rounded-full animate-pulse" />
              <div className="absolute inset-2 border border-emerald-500/10 rounded-full" />
              <div className="absolute inset-4 border-2 border-t-teal-400 border-r-transparent border-b-emerald-400 border-l-transparent rounded-full animate-spin [animation-duration:3s]" />
              <div className="absolute inset-8 border border-dashed border-teal-300/30 rounded-full animate-spin [animation-duration:10s] [animation-direction:reverse]" />
              <Brain className="w-10 h-10 text-teal-400 animate-pulse" />
              
              {/* Telemetry Dots */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-teal-400 bg-slate-950/80 px-2 py-0.5 rounded border border-teal-800/50">
                {analyzerStage === 'scanning' ? 'SCANNING' : 'AI_COMPUTE'}
              </div>
            </div>

            {/* Scanning Laser Line */}
            {analyzerStage === 'scanning' && (
              <div className="absolute left-0 right-0 h-0.5 bg-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.8)] animate-[bounce_2s_infinite] pointer-events-none" />
            )}

            <h3 className="text-sm font-semibold text-white tracking-wide uppercase">
              {analyzerStage === 'scanning' ? "Numérisation de l'environnement..." : "Modélisation des variables..."}
            </h3>
            <p className="text-xs text-teal-300/65 text-center max-w-xs mt-2 italic animate-pulse">
              {analyzerStage === 'scanning' 
                ? "Analyse spectrale du ciel, des contrastes et de la couverture nuageuse." 
                : "Génération des variables physiques et recommandations Shirikano."}
            </p>
          </div>
        )}

        {error && (
          <div className="absolute inset-x-4 bottom-4 p-3 bg-red-950/80 border border-red-800/40 rounded-xl flex gap-2.5 items-start z-20 text-red-200 text-xs animate-fade-in backdrop-blur-md">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Erreur d'analyse</p>
              <p className="opacity-90 mt-0.5">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 font-bold hover:text-red-200">✕</button>
          </div>
        )}

        {/* Camera stream */}
        {showCamera ? (
          <div className="absolute inset-0 w-full h-full z-10 flex flex-col">
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-6 z-20">
              <button
                onClick={capturePhoto}
                className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 font-bold px-5 py-2.5 rounded-full shadow-lg shadow-teal-500/20 active:scale-95 transition-transform"
              >
                <Camera className="w-4 h-4" /> Prendre la photo
              </button>
              <button
                onClick={stopCamera}
                className="bg-slate-800/90 border border-slate-700 hover:bg-slate-700 text-white font-medium px-4 py-2.5 rounded-full backdrop-blur-sm transition-all"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : selectedImage ? (
          <img src={selectedImage} alt="Ciel capturé" className="w-full h-full object-cover" />
        ) : (
          /* Default Empty State */
          <div className="p-6 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-teal-400 group-hover:border-teal-900/50 transition-all duration-300 mb-4 shadow-inner">
              <Camera className="w-7 h-7 stroke-[1.5]" />
            </div>
            <p className="text-sm font-medium text-slate-300">Aucun scan environnemental en cours</p>
            <p className="text-xs text-slate-500 max-w-[280px] mt-1.5">
              Prenez une photo de votre ciel ou importez-en une pour que Shirikano IA estime votre météo et votre saison.
            </p>
          </div>
        )}
      </div>

      {/* Input controls (Camera / Upload File) */}
      {!showCamera && (
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <button
            onClick={startCamera}
            className="flex items-center justify-center gap-2 bg-slate-950 border border-slate-800/80 hover:border-teal-500/30 hover:bg-slate-900 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 active:scale-98 text-xs cursor-pointer"
          >
            <Camera className="w-4 h-4 text-teal-400" />
            <span>Caméra Live</span>
          </button>

          <label className="flex items-center justify-center gap-2 bg-slate-950 border border-slate-800/80 hover:border-teal-500/30 hover:bg-slate-900 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 active:scale-98 text-xs cursor-pointer text-center">
            <Upload className="w-4 h-4 text-teal-400" />
            <span>Importer</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      )}

      {/* Optional Location Input */}
      {!showCamera && (
        <div className="flex gap-2 items-center bg-slate-950 border border-slate-900 rounded-xl p-2.5 shadow-inner">
          <MapPin className="w-4 h-4 text-teal-400 shrink-0 ml-1" />
          <input
            type="text"
            placeholder="Lieu (optionnel : Paris, Goma, Dakar...)"
            value={locationHint}
            onChange={(e) => setLocationHint(e.target.value)}
            className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-0 py-0.5"
          />
        </div>
      )}

      {/* Interactive Presets (Usability Fallback) */}
      {!showCamera && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-bold tracking-widest text-teal-400 uppercase">Simulations Climatiques</span>
            <span className="text-[10px] text-slate-500">Test rapide de l'IA</span>
          </div>
          <div className="flex flex-col gap-2 max-h-[170px] overflow-y-auto pr-1">
            {SKY_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-900/80 hover:border-teal-500/30 hover:bg-teal-950/20 rounded-xl text-left transition-all duration-200 group/item active:scale-99"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-lg shrink-0">{preset.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{preset.name}</p>
                    <p className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-slate-500" /> {preset.location}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover/item:text-teal-400 group-hover/item:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
