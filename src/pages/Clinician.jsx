import { useState, useEffect } from 'react';
import { getPatientSessions, getPatientAnalytics } from '../mocks/api';

export default function Clinician() {
  const [patients, setPatients] = useState([
    { id: 'p_001', name: 'Ahmed Khan' },
    { id: 'p_002', name: 'Sara Smith' }
  ]);
  const [selectedPatient, setSelectedPatient] = useState('p_001');
  const [sessions, setSessions] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const sData = await getPatientSessions(selectedPatient);
      const aData = await getPatientAnalytics(selectedPatient);
      setSessions(sData.sessions);
      setAnalytics(aData);
    };
    fetchData();
  }, [selectedPatient]);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-950">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-800 p-6 flex flex-col gap-4">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Patients</h2>
        <div className="space-y-2">
          {patients.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPatient(p.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium ${
                selectedPatient === p.id 
                ? 'bg-teal-600/20 text-teal-400 border border-teal-500/30' 
                : 'text-slate-400 hover:bg-slate-900 border border-transparent'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-white">Patient <span className="text-teal-500">Analytics</span></h1>
          <p className="text-slate-400">Reviewing progress for {patients.find(p => p.id === selectedPatient)?.name}</p>
        </header>

        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Total Sessions</p>
              <p className="text-3xl font-black text-white">{analytics.total_sessions}</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Total Reps</p>
              <p className="text-3xl font-black text-white">{analytics.total_reps}</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Improvement</p>
              <p className="text-3xl font-black text-teal-500">+{analytics.improvement_pct}%</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Status</p>
              <p className="text-3xl font-black text-emerald-500">Recovering</p>
            </div>
          </div>
        )}

        <section className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Exercise</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Score</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Reps</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sessions.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-slate-300">{s.date}</td>
                  <td className="px-6 py-4 text-slate-100 font-medium capitalize">{s.exercise_type.replace(/_/g, ' ')}</td>
                  <td className="px-6 py-4 text-teal-500 font-bold">{s.avg_form_score}%</td>
                  <td className="px-6 py-4 text-slate-300">{s.total_reps}</td>
                  <td className="px-6 py-4">
                    <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold uppercase">
                      {s.overall_rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
