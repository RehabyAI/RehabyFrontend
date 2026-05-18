import { useState, useEffect } from 'react';
import { analyzeFrame } from '../services/api';

export default function useSession(sessionId, videoRef) {
  const [data, setData] = useState({
    formScore: 100,
    repCount: 0,
    feedbackText: "Initializing pose analysis...",
    isSafe: true,
    errorsDetected: [] // Store all unique errors detected during the session
  });

  useEffect(() => {
    if (!sessionId || !videoRef) return;

    const interval = setInterval(async () => {
      const video = videoRef.current;
      if (video && video.readyState >= 2) { // Check if video is loaded and playing
        try {
          // Create temporary hidden canvas to capture frame
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          const ctx = canvas.getContext('2d');
          
          // Draw the video frame onto the canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert to jpeg base64
          const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
          
          // Extract the raw base64 string from the data URL
          const image_base64 = dataUrl.split(',')[1] || dataUrl;
          
          // Send frame to API for analysis
          const response = await analyzeFrame(image_base64);
          
          // Robust mapping of potential response shapes
          const score = response.score !== undefined 
            ? response.score 
            : response.form_score !== undefined 
              ? response.form_score 
              : response.formScore || 0;

          const feedback = response.feedback 
            ? response.feedback 
            : response.feedback_text 
              ? response.feedback_text 
              : response.feedbackText || "Exercising...";

          const reps = response.rep_count !== undefined 
            ? response.rep_count 
            : response.repCount !== undefined 
              ? response.repCount 
              : response.reps || 0;

          const safe = response.is_safe !== undefined 
            ? response.is_safe 
            : response.isSafe !== undefined 
              ? response.isSafe 
              : true;

          const errs = response.errors_detected 
            ? response.errors_detected 
            : response.errors || [];

          setData((prev) => {
            // Keep a running list of all unique errors detected during this session
            const updatedErrors = Array.from(new Set([...prev.errorsDetected, ...errs]));
            return {
              formScore: Math.round(score),
              repCount: reps,
              feedbackText: feedback,
              isSafe: safe,
              errorsDetected: updatedErrors
            };
          });
        } catch (error) {
          console.error("Frame analysis failed:", error);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [sessionId, videoRef]);

  return data;
}
