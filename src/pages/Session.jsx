import { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import usePose from '../hooks/usePose';
import useSession from '../hooks/useSession';
import PoseCanvas from '../components/PoseCanvas';
import { logSession } from '../services/api';

export default function Session() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieve navigation states
  const patientId = location.state?.patientId || location.state?.sessionId;
  const exerciseType = location.state?.exerciseType || 'shoulder_raise';
  
  const videoRef = useRef(null);
  const [poseResults, setPoseResults] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const lastSpokenText = useRef("");

  // MediaPipe Hook (for skeleton canvas rendering)
  usePose(videoRef, (results) => {
    setPoseResults(results);
  });

  // Real-time AI Frame Analysis Hook (using camera frames)
  const { formScore, repCount, feedbackText, isSafe, errorsDetected } = useSession(
    patientId, 
    videoRef
  );

  // Audio Feedback (Text-to-Speech)
  useEffect(() => {
    if (!isMuted && feedbackText && feedbackText !== lastSpokenText.current) {
      const utterance = new SpeechSynthesisUtterance(feedbackText);
      window.speechSynthesis.speak(utterance);
      lastSpokenText.current = feedbackText;
    }
  }, [feedbackText, isMuted]);

  const handleEndSession = async () => {
    try {
      const durationSeconds = Math.round((Date.now() - sessionStartTime) / 1000);
      
      const payload = {
        patient_id: patientId || "p_001",
        exercise_name: exerciseType,
        rep_count: repCount,
        average_score: formScore,
        errors_detected: errorsDetected || [],
        feedback_summary: feedbackText || "Session completed successfully."
      };
      
      const response = await logSession(payload);
      
      // Construct robust summary data matching the expected shapes of Summary.jsx
      const summaryData = {
        avg_form_score: response.average_score !== undefined ? response.average_score : response.avg_form_score !== undefined ? response.avg_form_score : formScore,
        total_reps: response.rep_count !== undefined ? response.rep_count : response.total_reps !== undefined ? response.total_reps : repCount,
        duration_seconds: response.duration_seconds !== undefined ? response.duration_seconds : durationSeconds,
        errors_summary: response.errors_summary || (errorsDetected || []).map(err => ({
          error_type: err,
          count: 1
        }))
      };

      navigate('/summary', { state: { summary: summaryData } });
    } catch (error) {
      console.error("Failed to log and end session:", error);
      // Fallback navigate with local data in case backend fails
      const fallbackSummary = {
        avg_form_score: formScore,
        total_reps: repCount,
        duration_seconds: Math.round((Date.now() - sessionStartTime) / 1000),
        errors_summary: (errorsDetected || []).map(err => ({
          error_type: err,
          count: 1
        }))
      };
      navigate('/summary', { state: { summary: fallbackSummary } });
    }
  };

  if (!patientId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-xl text-slate-400 mb-4">No active patient profile or session found.</p>
        <button onClick={() => navigate('/')} className="bg-teal-600 px-6 py-2 rounded-lg text-white font-bold hover:bg-teal-500 transition-all">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-[calc(100vh-64px)] bg-black overflow-hidden">
      {/* Unsafe Movement Warning */}
      {!isSafe && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-full font-bold animate-pulse flex items-center gap-2 shadow-2xl">
          <span className="text-xl">⚠️</span> Unsafe movement detected — please adjust posture.
        </div>
      )}

      {/* Camera Feed Container */}
      <div className="relative flex-1 bg-slate-900 overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          className="h-full w-full object-cover scale-x-[-1]"
          playsInline
          muted
        />
        <PoseCanvas results={poseResults} />
      </div>

      {/* UI Overlay Controls */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
        <div className="flex justify-between items-start">
          <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-teal-500/20 pointer-events-auto shadow-2xl">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-bold">Form Score</p>
            <p className="text-4xl font-black text-teal-400">{formScore}%</p>
          </div>
          <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-teal-500/20 pointer-events-auto text-right shadow-2xl">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-bold">Rep Counter</p>
            <p className="text-4xl font-black text-white">{repCount}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="bg-slate-900/90 backdrop-blur-md text-white px-8 py-4 rounded-2xl shadow-2xl border border-teal-500/20 pointer-events-auto max-w-md text-center">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1 font-bold">Real-time Coaching</p>
            <p className="text-base font-bold text-teal-300">{feedbackText}</p>
          </div>

          <div className="flex gap-4 pointer-events-auto">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`px-6 py-3 rounded-full border text-sm font-bold transition-all shadow-lg flex items-center gap-2 ${
                isMuted 
                  ? 'bg-red-950/40 border-red-500/50 text-red-400' 
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{isMuted ? '🔇 Audio Muted' : '🔊 Voice Coach'}</span>
            </button>
            <button
              onClick={handleEndSession}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold px-8 py-3 rounded-full transition-all shadow-xl shadow-red-950/40 text-sm"
            >
              End Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
