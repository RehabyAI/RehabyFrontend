import { useLocation, useNavigate } from 'react-router-dom';

export default function Summary() {
  const location = useLocation();
  const navigate = useNavigate();
  const summary = location.state?.summary;

  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-xl text-slate-400 mb-4">No summary data available.</p>
        <button onClick={() => navigate('/')} className="bg-teal-600 px-6 py-2 rounded-lg text-white">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8">
      <h1 className="text-4xl font-black text-white mb-2">Session <span className="text-teal-500">Summary</span></h1>
      <p className="text-slate-400 mb-8">Great job today! Here is how you performed.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-bold">Avg. Form</p>
          <p className="text-4xl font-black text-teal-500">{summary.avg_form_score}%</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-bold">Total Reps</p>
          <p className="text-4xl font-black text-white">{summary.total_reps}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-bold">Duration</p>
          <p className="text-4xl font-black text-white">{Math.round(summary.duration_seconds / 60)}m</p>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl mb-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-teal-500 rounded-full"></span>
          Common Improvements Needed
        </h3>
        <div className="space-y-4">
          {summary.errors_summary.slice(0, 3).map((error, idx) => (
            <div key={idx} className="flex justify-between items-center p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <span className="text-slate-200 font-medium capitalize">{error.error_type.replace(/_/g, ' ')}</span>
              <span className="bg-slate-800 text-slate-400 px-3 py-1 rounded-lg text-sm font-bold">Detected {error.count}x</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate('/')}
        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all border border-slate-700"
      >
        Back to Home
      </button>
    </div>
  );
}
