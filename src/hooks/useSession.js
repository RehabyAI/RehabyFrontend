import { useState, useEffect, useRef } from 'react';
import { analyzeFrame } from '../mocks/api';

export default function useSession(sessionId, landmarks) {
  const [data, setData] = useState({
    formScore: 0,
    repCount: 0,
    feedbackText: "Aligning sensor...",
    isSafe: true
  });
  
  const lastLandmarks = useRef(null);

  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(async () => {
      // Only call if we have new landmarks
      if (landmarks) {
        try {
          const response = await analyzeFrame({
            session_id: sessionId,
            landmarks: landmarks
          });
          
          setData({
            formScore: response.form_score,
            repCount: response.rep_count,
            feedbackText: response.feedback_text,
            isSafe: response.is_safe
          });
        } catch (error) {
          console.error("Frame analysis failed", error);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [sessionId, landmarks]);

  return data;
}
