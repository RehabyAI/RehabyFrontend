import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startSession } from '../mocks/api';

export default function Intake() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patient_name: '',
    condition: '',
    pain_level: 5,
    exercise_type: 'shoulder_raise'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await startSession(formData);
      navigate('/session', { state: { sessionId: response.session_id, exerciseType: formData.exercise_type } });
    } catch (error) {
      console.error('Failed to start session', error);
      alert('Error starting session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-slate-900 rounded-xl shadow-2xl border border-slate-800">
      <h1 className="text-3xl font-bold text-teal-500 mb-2">Patient Intake</h1>
      <p className="text-slate-400 mb-8">Please fill in the details to begin your session.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
          <input
            required
            type="text"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={formData.patient_name}
            onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Condition</label>
          <input
            required
            type="text"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={formData.condition}
            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            placeholder="e.g., Shoulder Pain"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1 flex justify-between">
            <span>Pain Level</span>
            <span className="text-teal-500 font-bold">{formData.pain_level}</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            value={formData.pain_level}
            onChange={(e) => setFormData({ ...formData, pain_level: parseInt(e.target.value) })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Assigned Exercise</label>
          <select
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
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
          className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-teal-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Starting...' : 'Start Session'}
        </button>
      </form>
    </div>
  );
}
