import { useState, useEffect } from 'react';
import { getPatients, getPatientHistory, getPatientTrends, getPatientErrors } from '../services/api';
import ScoreTrendChart from '../components/ScoreTrendChart';
import ErrorBarChart from '../components/ErrorBarChart';

export default function Clinician() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  
  // Data for the active patient
  const [history, setHistory] = useState([]);
  const [trends, setTrends] = useState([]);
  const [errors, setErrors] = useState([]);
  
  // Loading and error states
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // 1. On load, fetch the list of patients
  useEffect(() => {
    const fetchPatientsList = async () => {
      setLoadingList(true);
      setErrorMsg(null);
      try {
        const patientsData = await getPatients();
        setPatients(patientsData || []);
        if (patientsData && patientsData.length > 0) {
          const firstPatient = patientsData[0];
          setSelectedPatientId(firstPatient.patient_id || firstPatient.id);
        }
      } catch (error) {
        console.error('Failed to fetch patients:', error);
        setErrorMsg('Failed to load patient database. Please try again.');
      } finally {
        setLoadingList(false);
      }
    };
    fetchPatientsList();
  }, []);

  // 2. Fetch specific patient analytics in parallel on click/change
  useEffect(() => {
    if (!selectedPatientId) return;

    const fetchPatientData = async () => {
      setLoadingDetails(true);
      try {
        const [historyData, trendsData, errorsData] = await Promise.all([
          getPatientHistory(selectedPatientId),
          getPatientTrends(selectedPatientId),
          getPatientErrors(selectedPatientId),
        ]);

        setHistory(historyData || []);
        setTrends(trendsData || []);
        setErrors(errorsData || []);
      } catch (error) {
        console.error(`Failed to fetch analytics for patient ${selectedPatientId}:`, error);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchPatientData();
  }, [selectedPatientId]);

  // Find currently active patient object
  const activePatient = patients.find(p => (p.patient_id || p.id) === selectedPatientId);

  // Compute quick summary stats from history
  const totalSessions = history.length;
  const totalReps = history.reduce((sum, s) => sum + (s.rep_count || s.total_reps || 0), 0);
  const avgScore = totalSessions > 0
    ? Math.round(history.reduce((sum, s) => sum + (s.average_score !== undefined ? s.average_score : s.avg_form_score || 0), 0) / totalSessions)
    : 0;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar - Patient List */}
      <div className="w-80 border-r border-slate-900 bg-slate-900/20 p-6 flex flex-col gap-6 overflow-y-auto">
        <div>
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Patients Directory</h2>
          <p className="text-[10px] text-slate-400">Select a patient profile to review rehabilitation progress</p>
        </div>

        {loadingList ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <svg className="animate-spin h-6 w-6 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-xs text-slate-500 font-medium">Loading patients...</span>
          </div>
        ) : errorMsg ? (
          <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-2xl text-xs text-red-400">
            {errorMsg}
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center p-6 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed text-slate-500 text-xs">
            No patients registered yet.
          </div>
        ) : (
          <div className="flex-1 space-y-2">
            {patients.map(p => {
              const id = p.patient_id || p.id;
              const name = p.full_name || p.name || 'Unknown Patient';
              const condition = p.condition || 'No condition specified';
              const isSelected = selectedPatientId === id;

              return (
                <button
                  key={id}
                  onClick={() => setSelectedPatientId(id)}
                  className={`w-full text-left p-4 rounded-xl transition-all border flex flex-col gap-1 ${
                    isSelected 
                      ? 'bg-teal-950/40 border-teal-500/30 text-teal-300 shadow-lg shadow-teal-950/20' 
                      : 'border-transparent text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                  }`}
                >
                  <span className="font-bold text-sm truncate">{name}</span>
                  <span className="text-[10px] uppercase opacity-70 tracking-wider font-semibold truncate">{condition}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        {loadingDetails && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] z-50 flex items-center justify-center">
            <div className="bg-slate-900/90 border border-slate-800 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl">
              <svg className="animate-spin h-5 w-5 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm font-bold text-slate-300">Synchronizing clinical data...</span>
            </div>
          </div>
        )}

        {activePatient ? (
          <div>
            {/* Header Profile Section */}
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-900">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-black text-white">
                    Patient <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Dashboard</span>
                  </h1>
                </div>
                <p className="text-slate-400 text-sm">
                  Clinical profile and AI posture telemetry for <span className="font-bold text-slate-200">{activePatient.full_name || activePatient.name}</span>
                </p>
              </div>

              {/* Patient Meta Cards */}
              <div className="flex flex-wrap gap-3">
                <div className="bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800 text-center">
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Age</p>
                  <p className="text-sm font-bold text-slate-200">{activePatient.age || 'N/A'}</p>
                </div>
                <div className="bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800 text-center">
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Gender</p>
                  <p className="text-sm font-bold text-slate-200">{activePatient.gender || 'N/A'}</p>
                </div>
              </div>
            </header>

            {/* Quick Clinical Metrics Grid */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-900 shadow-xl">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total Sessions</p>
                <p className="text-3xl font-black text-white">{totalSessions}</p>
              </div>
              <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-900 shadow-xl">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total Repetitions</p>
                <p className="text-3xl font-black text-white">{totalReps}</p>
              </div>
              <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-900 shadow-xl">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Average Form Score</p>
                <p className="text-3xl font-black text-teal-400">{avgScore}%</p>
              </div>
              <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-900 shadow-xl">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Rehabilitation Status</p>
                <p className="text-2xl font-black text-emerald-400 flex items-center gap-1.5 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative"></span>
                  Active Rehab
                </p>
              </div>
            </section>

            {/* Rehab Plan Card */}
            <section className="bg-slate-900/40 p-6 rounded-2xl border border-slate-900 shadow-xl mb-8">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Rehabilitation Plan & Prescription</h3>
              <p className="text-sm text-slate-300 leading-relaxed italic bg-slate-950/40 p-4 rounded-xl border border-slate-900">
                "{activePatient.rehab_plan || 'No designated plan prescribed yet.'}"
              </p>
            </section>

            {/* Recharts Analytics Visualization Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <ScoreTrendChart data={trends} />
              <ErrorBarChart data={errors} />
            </section>

            {/* Session History Log Table */}
            <section className="bg-slate-900/30 rounded-2xl border border-slate-900 overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-900 bg-slate-900/20">
                <h3 className="text-sm font-bold text-slate-300">Session History Log</h3>
                <p className="text-xs text-slate-500">Chronological telemetry records of patient workouts</p>
              </div>
              
              {history.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No sessions recorded for this patient yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900/40 border-b border-slate-900">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Exercise Name</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Form Score</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Reps</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Clinical Feedback</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/80">
                      {history.map((s, idx) => {
                        const date = s.date || s.created_at || new Date().toLocaleDateString();
                        const exercise = s.exercise_name || s.exercise_type || "Exercise";
                        const score = s.average_score !== undefined ? s.average_score : s.avg_form_score !== undefined ? s.avg_form_score : 0;
                        const reps = s.rep_count !== undefined ? s.rep_count : s.total_reps !== undefined ? s.total_reps : 0;
                        const feedback = s.feedback_summary || "Good progression overall.";

                        return (
                          <tr key={idx} className="hover:bg-slate-900/20 transition-colors">
                            <td className="px-6 py-4 text-xs text-slate-400 font-semibold">{date}</td>
                            <td className="px-6 py-4 text-xs text-slate-200 font-bold capitalize">{exercise.replace(/_/g, ' ')}</td>
                            <td className="px-6 py-4 text-xs font-black text-teal-400">{score}%</td>
                            <td className="px-6 py-4 text-xs text-slate-300">{reps}</td>
                            <td className="px-6 py-4 text-xs text-slate-400 italic truncate max-w-xs">{feedback}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500">
            <svg className="w-12 h-12 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <p className="text-base font-bold">No Patient Selected</p>
            <p className="text-xs">Please select a patient from the directory on the left.</p>
          </div>
        )}
      </div>
    </div>
  );
}
