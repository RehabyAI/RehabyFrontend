import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPatient } from '../services/api';

export default function Intake() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: 'Male',
    condition: '',
    rehab_plan: '',
    exercise_type: 'shoulder_raise' // Keep this to pass along the selected exercise
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await createPatient({
        full_name: formData.full_name,
        age: Number(formData.age),
        gender: formData.gender,
        condition: formData.condition,
        rehab_plan: formData.rehab_plan
      });
      
      // Store returned patient_id (and map to sessionId for Session page compatibility)
      navigate('/session', {
        state: {
          patientId: response.patient_id,
          sessionId: response.patient_id, // For backwards compatibility if any hook relies on sessionId
          exerciseType: formData.exercise_type
        }
      });
    } catch (error) {
      console.error('Failed to create patient & start session', error);
      setErrorMsg(error.response?.data?.detail || 'Failed to create patient profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-8 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 relative overflow-hidden">
      {/* Visual Accent Gradient */}
      <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600"></div>
      
      <h1 className="text-3xl font-black text-white tracking-tight mb-2">
        Patient <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Intake Form</span>
      </h1>
      <p className="text-slate-400 mb-8 text-sm">Please register the patient details to initiate the AI-guided rehabilitation session.</p>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-950/40 border border-red-500/40 text-red-300 rounded-xl text-sm flex items-center gap-3">
          <span className="text-lg">⚠️</span>
          <div>
            <span className="font-bold">Registration Failed:</span> {errorMsg}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
            <input
              required
              type="text"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-sm"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="e.g., Jane Doe"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Age</label>
            <input
              required
              type="number"
              min="1"
              max="120"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-sm"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              placeholder="e.g., 34"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gender</label>
            <select
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-sm cursor-pointer"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Primary Diagnosis / Condition</label>
          <input
            required
            type="text"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-sm"
            value={formData.condition}
            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            placeholder="e.g., Post-op Rotator Cuff Repair"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Rehabilitation Plan</label>
          <textarea
            required
            rows="3"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-sm resize-none"
            value={formData.rehab_plan}
            onChange={(e) => setFormData({ ...formData, rehab_plan: e.target.value })}
            placeholder="e.g., 3 sets of 10 shoulder raises, focusing on 90-degree range of motion and joint stability."
          />
        </div>

        <div className="border-t border-slate-800/80 pt-6">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Active Exercise</label>
          <select
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-sm cursor-pointer"
            value={formData.exercise_type}
            onChange={(e) => setFormData({ ...formData, exercise_type: e.target.value })}
          >
            <option value="shoulder_raise">Shoulder Raise</option>
            <option value="knee_bend">Knee Bend</option>
            <option value="hip_flex">Hip Flex</option>
          </select>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full relative bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-teal-950/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 overflow-hidden text-sm"
        >
          {loading ? (
            <>
              {/* Spinner */}
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Registering Patient...</span>
            </>
          ) : (
            <span>Register & Start Session</span>
          )}
        </button>
      </form>
    </div>
  );
}
