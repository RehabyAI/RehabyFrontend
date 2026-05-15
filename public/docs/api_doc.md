# Rehaby - Backend API Documentation

**FastAPI Backend API Specification**

This document serves as the contract between the backend team (Ammara, Mohammed) and the frontend team. All endpoints listed here must be implemented exactly as specified.

---

## Base Configuration

- **Base URL:** `http://localhost:8000`
- **CORS:** Allow `http://localhost:5173` (Vite dev server)
- **Content-Type:** `application/json`
- **Auth:** None for hackathon (no tokens needed)

---

## API Endpoints

### 1. Start Session
`POST /start-session`

Called when the patient submits the intake form. Creates a new session record.

#### Request Body
```json
{
  "patient_name": "string",
  "condition": "string",
  "pain_level": 7,              // integer 1-10
  "exercise_type": "shoulder_raise"  // enum: shoulder_raise | knee_bend | hip_flex
}
```

#### Response (200 OK)
```json
{
  "session_id": "abc123",
  "patient_id": "p_001",
  "exercise_type": "shoulder_raise",
  "started_at": "2026-05-15T10:00:00Z",
  "status": "active"
}
```

---

### 2. Analyze Frame
`POST /analyze-frame`

Core real-time endpoint. Frontend sends pose landmarks every 500ms. Backend returns score, feedback, and rep count.

#### Request Body
```json
{
  "session_id": "abc123",
  "timestamp": 1715000000.0,
  "landmarks": [
    { "index": 11, "x": 0.45, "y": 0.32, "z": -0.12, "visibility": 0.98 },
    { "index": 12, "x": 0.55, "y": 0.33, "z": -0.11, "visibility": 0.97 }
    // ... all 33 MediaPipe landmarks
  ]
}
```

#### Response (200 OK)
```json
{
  "form_score": 78,              // integer 0-100
  "rep_count": 4,                // total reps so far
  "feedback_text": "Raise samkiel's left arm slightly higher",
  "feedback_severity": "warning", // info | warning | error | good
  "errors_detected": ["left_arm_low"],
  "is_safe": true               // false triggers safety alert on frontend
}
```

---

### 3. End Session
`POST /end-session`

Called when the patient clicks "End Session". Closes the record and returns the full session summary.

#### Request Body
```json
{
  "session_id": "abc123"
}
```

#### Response (200 OK)
```json
{
  "session_id": "abc123",
  "duration_seconds": 420,
  "total_reps": 12,
  "avg_form_score": 74,
  "peak_form_score": 91,
  "errors_summary": [
    { "error_type": "left_arm_low", "count": 8 },
    { "error_type": "back_not_straight", "count": 3 }
  ],
  "overall_rating": "good"     // poor | fair | good | excellent
}
```

---

### 4. Patient Sessions
`GET /patient/{patient_id}/sessions`

Returns all sessions for a specific patient. Used by the clinician dashboard.

#### Response (200 OK)
```json
{
  "patient_id": "p_001",
  "patient_name": "Ahmed Khan",
  "sessions": [
    {
      "session_id": "abc123",
      "date": "2026-05-15",
      "duration_seconds": 420,
      "exercise_type": "shoulder_raise",
      "avg_form_score": 74,
      "total_reps": 12,
      "overall_rating": "good"
    }
  ]
}
```

---

### 5. Patient Analytics
`GET /patient/{patient_id}/analytics`

Aggregated analytics for charts. Used by the clinician dashboard.

#### Response (200 OK)
```json
{
  "patient_id": "p_001",
  "score_trend": [
    { "date": "2026-05-10", "avg_score": 61 },
    { "date": "2026-05-12", "avg_score": 68 },
    { "date": "2026-05-15", "avg_score": 74 }
  ],
  "common_errors": [
    { "error_type": "left_arm_low", "total_count": 24, "label": "Left arm too low" },
    { "error_type": "back_not_straight", "total_count": 11, "label": "Back not straight" }
  ],
  "total_sessions": 3,
  "total_reps": 38,
  "improvement_pct": 21
}
```

---

### 6. Session Details
`GET /session/{session_id}/details`

Full detail of a single session, including frame-by-frame scores.

#### Response (200 OK)
```json
{
  "session_id": "abc123",
  "patient_id": "p_001",
  "exercise_type": "shoulder_raise",
  "started_at": "2026-05-15T10:00:00Z",
  "ended_at": "2026-05-15T10:07:00Z",
  "duration_seconds": 420,
  "total_reps": 12,
  "avg_form_score": 74,
  "score_over_time": [
    { "second": 1, "score": 60 },
    { "second": 2, "score": 65 }
  ],
  "errors_summary": [
    { "error_type": "left_arm_low", "count": 8 }
  ]
}
```

---

## Error Responses

All endpoints return this structure on error:

```json
{
  "detail": "Human-readable error message",
  "error_code": "SESSION_NOT_FOUND"   // optional
}
```

| HTTP Status | Description |
| :--- | :--- |
| 400 | Bad request / missing fields |
| 404 | Session or patient not found |
| 422 | Validation error (FastAPI default) |
| 500 | Internal server error |

---

## CORS Setup (FastAPI Example)

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

**Rehaby — Hackathon Build** | May 14–19, 2026 | Internal Use Only