export const startSession = async (data) => {
  console.log('Mock: startSession', data);
  return {
    session_id: "abc123",
    patient_id: "p_001",
    exercise_type: data.exercise_type,
    started_at: new Date().toISOString(),
    status: "active"
  };
};

export const analyzeFrame = async (data) => {
  return {
    form_score: 78,
    rep_count: 4,
    feedback_text: "Raise your left arm slightly higher",
    feedback_severity: "warning",
    errors_detected: ["left_arm_low"],
    is_safe: true
  };
};

export const endSession = async (data) => {
  return {
    session_id: data.session_id,
    duration_seconds: 420,
    total_reps: 12,
    avg_form_score: 74,
    peak_form_score: 91,
    errors_summary: [
      { error_type: "left_arm_low", count: 8 },
      { error_type: "back_not_straight", count: 3 }
    ],
    overall_rating: "good"
  };
};

export const getPatientSessions = async (patientId) => {
  return {
    patient_id: patientId,
    patient_name: "Ahmed Khan",
    sessions: [
      {
        session_id: "abc123",
        date: "2026-05-15",
        duration_seconds: 420,
        exercise_type: "shoulder_raise",
        avg_form_score: 74,
        total_reps: 12,
        overall_rating: "good"
      }
    ]
  };
};

export const getPatientAnalytics = async (patientId) => {
  return {
    patient_id: patientId,
    score_trend: [
      { date: "2026-05-10", avg_score: 61 },
      { date: "2026-05-12", avg_score: 68 },
      { date: "2026-05-15", avg_score: 74 }
    ],
    common_errors: [
      { error_type: "left_arm_low", total_count: 24, label: "Left arm too low" },
      { error_type: "back_not_straight", total_count: 11, label: "Back not straight" }
    ],
    total_sessions: 3,
    total_reps: 38,
    improvement_pct: 21
  };
};

export const getSessionDetails = async (sessionId) => {
  return {
    session_id: sessionId,
    patient_id: "p_001",
    exercise_type: "shoulder_raise",
    started_at: "2026-05-15T10:00:00Z",
    ended_at: "2026-05-15T10:07:00Z",
    duration_seconds: 420,
    total_reps: 12,
    avg_form_score: 74,
    score_over_time: [
      { second: 1, score: 60 },
      { second: 2, score: 65 }
    ],
    errors_summary: [
      { error_type: "left_arm_low", count: 8 }
    ]
  };
};
