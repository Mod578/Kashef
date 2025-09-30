import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { FaCamera, FaUpload } from 'react-icons/fa';
import { FaWandMagicSparkles } from 'react-icons/fa6';
import type { VideoPlayerRef } from '../types';
import { REASSURING_MESSAGES } from '../constants';
import { LuScanLine } from 'react-icons/lu';
import { useAppContext } from '../context/AppContext';

interface VideoPlayerProps {
    onAnalyzeFrame: () => void;
    onError: (message: string) => void;
}

/**
 * A view displayed when the video player is idle.
 * It provides options to start the camera or upload an image file.
 *
 * @param {object} props - The component props.
 * @param {() => void} props.onStartCamera - Callback to start the camera.
 * @param {() => void} props.onUploadClick - Callback to trigger file upload.
 * @returns {React.ReactElement} The rendered idle view.
 */
const IdleView: React.FC<{ onStartCamera: () => void; onUploadClick: () => void; }> = React.memo(({ onStartCamera, onUploadClick }) => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-brand-bg p-8 text-center">
        <div className="relative w-28 h-28 mb-6 flex items-center justify-center rounded-3xl bg-brand-surface/50 border border-brand-border/50">
            <LuScanLine className="w-16 h-16 text-brand-text-tertiary" />
        </div>
        <h2 className="text-2xl font-extrabold text-brand-text-primary mb-2">بدء الفحص البصري</h2>
        <p className="text-brand-text-secondary mb-8 max-w-md">استخدم كاميرا جهازك أو قم برفع ملف صورة لبدء التعرف الفوري على المكونات.</p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
            <button
                onClick={onStartCamera}
                className="flex items-center justify-center gap-3 px-4 py-3 bg-brand-primary text-brand-primary-fg font-bold rounded-xl hover:bg-brand-primary/90 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg focus-visible:ring-brand-primary shadow-lg flex-1"
            >
                <FaCamera className="w-5 h-5" />
                <span>استخدام الكاميرا</span>
            </button>
            <button
                onClick={onUploadClick}
                className="flex items-center justify-center gap-3 px-4 py-3 bg-brand-surface border border-brand-border text-brand-text-primary font-bold rounded-xl hover:bg-brand-surface-alt transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg focus-visible:ring-brand-primary flex-1 shadow-lg"
            >
                <FaUpload className="w-5 h-5" />
                <span>رفع ملف</span>
            </button>
        </div>
    </div>
));

/**
 * A versatile media player component that handles camera streams, uploaded images, and videos.
 * It provides the core functionality for capturing frames for analysis.
 * It exposes methods via a ref to control its state from the parent component.
 *
 * @param {VideoPlayerProps} props - The component props.
 * @param {React.Ref<VideoPlayerRef>} ref - The ref to expose component methods.
 * @returns {React.ReactElement} The rendered video player component.
 */
const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(({
    onAnalyzeFrame,
    onError,
}, ref) => {
    const { state } = useAppContext();
    const { isProcessingFrame } = state;

    const videoRef = useRef<HTMLVideoElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [analysisMode, setAnalysisMode] = useState<'idle' | 'camera' | 'image' | 'video'>('idle');
    const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
    const [uploadedVideoSrc, setUploadedVideoSrc] = useState<string | null>(null);
    const [reassuringMessage, setReassuringMessage] = useState(REASSURING_MESSAGES[0]);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => {
                console.error("Error attempting to play video stream:", e);
                onError("فشل تشغيل بث الكاميرا.");
            });
        }
    }, [stream, onError]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isProcessingFrame) {
            interval = setInterval(() => {
                setReassuringMessage(REASSURING_MESSAGES[Math.floor(Math.random() * REASSURING_MESSAGES.length)]);
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isProcessingFrame]);

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (uploadedVideoSrc) {
                URL.revokeObjectURL(uploadedVideoSrc);
            }
        };
    }, [stream, uploadedVideoSrc]);

    const stopCameraAndVideo = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if (uploadedVideoSrc) {
            URL.revokeObjectURL(uploadedVideoSrc);
            setUploadedVideoSrc(null);
        }
         if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.src = '';
        }
    }, [stream, uploadedVideoSrc]);

    const resetAnalysis = useCallback(() => {
        stopCameraAndVideo();
        setUploadedImageSrc(null);
        setAnalysisMode('idle');
        if (videoRef.current) {
            videoRef.current.pause();
        }
    }, [stopCameraAndVideo]);
    
    const startCamera = useCallback(async () => {
        resetAnalysis();
        const idealConstraints = {
            video: {
                facingMode: 'environment',
            }
        };
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia(idealConstraints);
            setStream(mediaStream);
            setAnalysisMode('camera');
        } catch (err) {
            console.warn("Failed to get environment camera, trying default camera:", err);
            try {
                const fallbackConstraints = { video: true };
                const mediaStream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
                setStream(mediaStream);
                setAnalysisMode('camera');
            } catch (fallbackErr) {
                console.error("Error accessing any camera:", fallbackErr);
                onError("تعذر الوصول إلى الكاميرا. الرجاء التحقق من أذونات المتصفح والتأكد من وجود كاميرا.");
                setAnalysisMode('idle');
            }
        }
    }, [resetAnalysis, onError]);
    
    const handleUploadClick = useCallback(() => fileInputRef.current?.click(), []);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        resetAnalysis();

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImageSrc(e.target?.result as string);
                setAnalysisMode('image');
            };
            reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
             const videoUrl = URL.createObjectURL(file);
             setUploadedVideoSrc(videoUrl);
             setAnalysisMode('video');
             if (videoRef.current) {
                 videoRef.current.src = videoUrl;
                 videoRef.current.load();
                 videoRef.current.play().catch(console.error);
             }
        } else {
            onError("نوع الملف غير مدعوم. الرجاء اختيار ملف صورة أو فيديو.");
        }

        if (event.target) event.target.value = '';
    }, [resetAnalysis, onError]);
    
    const handleAnalyzeClick = useCallback(() => {
        if ((analysisMode === 'video' || analysisMode === 'camera') && videoRef.current) {
            videoRef.current.pause();
        }
        onAnalyzeFrame();
    }, [analysisMode, onAnalyzeFrame]);

    useImperativeHandle(ref, () => ({
        getFrameData: () => {
            const canvas = canvasRef.current;
            if (!canvas) return null;
            const context = canvas.getContext('2d');
            if (!context) return null;

            let sourceElement: HTMLVideoElement | HTMLImageElement | null = null;
            
            if ((analysisMode === 'camera' || analysisMode === 'video') && videoRef.current && videoRef.current.readyState >= 2) {
                sourceElement = videoRef.current;
            } else if (analysisMode === 'image' && imageRef.current && imageRef.current.complete && imageRef.current.naturalHeight !== 0) {
                sourceElement = imageRef.current;
            }

            if (!sourceElement) {
                return null;
            }
            
            const sourceWidth = (sourceElement instanceof HTMLVideoElement) ? sourceElement.videoWidth : sourceElement.naturalWidth;
            const sourceHeight = (sourceElement instanceof HTMLVideoElement) ? sourceElement.videoHeight : sourceElement.naturalHeight;
            
            if (sourceWidth === 0 || sourceHeight === 0) {
                return null;
            }

            // Resize logic for performance and to avoid payload size limits
            const MAX_DIMENSION = 1280;
            let targetWidth = sourceWidth;
            let targetHeight = sourceHeight;

            if (targetWidth > MAX_DIMENSION || targetHeight > MAX_DIMENSION) {
                if (targetWidth > targetHeight) {
                    targetHeight = Math.round(targetHeight * (MAX_DIMENSION / targetWidth));
                    targetWidth = MAX_DIMENSION;
                } else {
                    targetWidth = Math.round(targetWidth * (MAX_DIMENSION / targetHeight));
                    targetHeight = MAX_DIMENSION;
                }
            }
            
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            context.drawImage(sourceElement, 0, 0, targetWidth, targetHeight);
            
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            const base64Data = dataUrl.split(',')[1];
            
            if (!base64Data) return null;

            return { data: base64Data, mimeType: 'image/jpeg' };
        },
        reset: resetAnalysis,
        resume: () => {
             if (videoRef.current && (analysisMode === 'camera' || analysisMode === 'video')) {
                videoRef.current.play().catch(e => console.error("Failed to resume video", e));
            }
        },
    }), [resetAnalysis, analysisMode]);

    const renderProcessingOverlay = () => {
        if (!isProcessingFrame) return null;
        return (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20 transition-opacity duration-300">
                <div className="w-16 h-16 border-4 border-white/20 border-t-brand-primary rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-semibold animate-pulse">{reassuringMessage}</p>
            </div>
        );
    };

    if (analysisMode === 'idle') {
        return (
            <>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/webp, video/mp4, video/webm"
                    className="hidden"
                />
                <IdleView onStartCamera={startCamera} onUploadClick={handleUploadClick} />
            </>
        );
    }

    return (
        <div className="relative w-full h-full flex flex-col bg-black">
            <div className="relative flex-grow w-full h-full flex items-center justify-center overflow-hidden">
                {(analysisMode === 'camera' || analysisMode === 'video') && (
                    <video ref={videoRef} playsInline autoPlay muted={analysisMode === 'camera'} controls={analysisMode === 'video'} className="w-full h-full object-cover" />
                )}
                {analysisMode === 'image' && uploadedImageSrc && (
                     <img ref={imageRef} src={uploadedImageSrc} alt="مكون تم تحميله" className="w-full h-full object-contain" />
                )}
                <canvas ref={canvasRef} className="hidden" />
                {renderProcessingOverlay()}
            </div>
            <div className="absolute bottom-[calc(1rem+env(safe-area-inset-bottom))] sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 transition-all duration-300">
                <button
                    onClick={handleAnalyzeClick}
                    disabled={isProcessingFrame}
                    className="w-20 h-20 bg-brand-primary text-brand-primary-fg rounded-full flex items-center justify-center border-4 border-brand-surface disabled:bg-brand-surface-alt disabled:text-brand-text-tertiary disabled:cursor-not-allowed hover:bg-brand-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg focus-visible:ring-brand-primary transition-all active:scale-95 shadow-lg"
                    aria-label="تحليل الإطار الحالي"
                >
                    <FaWandMagicSparkles className="w-8 h-8" />
                </button>
            </div>
        </div>
    );
});

export default VideoPlayer;