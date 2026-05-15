import { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import usePose from '../hooks/usePose';
import useSession from '../hooks/useSession';
import PoseCanvas from '../components/PoseCanvas';
import { endSession } from '../mocks/api';

export default function Session() {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionId = location.state?.sessionId;
  
  const videoRef = useRef(null);
  const [poseResults, setPoseResults] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const lastSpokenText = useRef("");

  // Prompt 2: MediaPipe Hook
  usePose(videoRef, (results) => {
    setPoseResults(results);
  });

  // Prompt 5 & 6: Session Data Hook
  const { formScore, repCount, feedbackText, isSafe } = useSession(
    sessionId, 
    poseResults?.poseLandmarks
  );

  // Prompt 7: Audio Feedback
  useEffect(() => {
    if (!isMuted && feedbackText && feedbackText !== lastSpokenText.current) {
      const utterance = new SpeechSynthesisUtterance(feedbackText);
      window.speechSynthesis.speak(utterance);
      lastSpokenText.current = feedbackText;
    }
  }, [feedbackText, isMuted]);

  const handleEndSession = async () => {
    try {
      const summary = await endSession({ session_id: sessionId });
      navigate('/summary', { state: { summary } });
    } catch (error) {
      console.error("Failed to end session", error);
      navigate('/');
    }
  };

  if (!sessionId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-xl text-slate-400 mb-4">No active session found.</p>
        <button onClick={() => navigate('/')} className="bg-teal-600 px-6 py-2 rounded-lg">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-[calc(100vh-64px)] bg-black overflow-hidden">
      {/* Unsafe Movement Warning */}
      {!isSafe && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-full font-bold animate-pulse flex items-center gap-2">
          <span className="text-xl">⚠️</span> Unsafe movement detected — please stop.
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
          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-teal-500/30 pointer-events-auto">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Form Score</p>
            <p className="text-4xl font-black text-teal-500">{formScore}%</p>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-teal-500/30 pointer-events-auto text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Rep Counter</p>
            <p className="text-4xl font-black text-white">{repCount}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="bg-teal-600 text-white px-8 py-4 rounded-2xl shadow-2xl shadow-teal-900/40 border border-teal-400/50 pointer-events-auto max-w-md text-center">
            <p className="text-lg font-bold">{feedbackText}</p>
          </div>

          <div className="flex gap-4 pointer-events-auto">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full border transition-all ${
                isMuted ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-slate-900/80 border-slate-700 text-slate-300'
              }`}
            >
              {isMuted ? '🔇 Muted' : '🔊 Speaking'}
            </button>
            <button
              onClick={handleEndSession}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-full transition-all"
            >
              End Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
