# Rehaby - Frontend PRD

**Version:** 1.0  
**Date:** May 14–19, 2026  
**Build:** Hackathon

---

## 1. Product Overview

Rehaby is a web application that uses the device camera to supervise physiotherapy exercises in real time. The frontend has two distinct experiences:

- **Patient App:** Camera-based exercise session with live pose feedback.
- **Clinician Dashboard:** Session history and recovery analytics per patient.

### Tech Stack
- **Framework:** React + Vite
- **Styling:** TailwindCSS
- **Pose Detection:** MediaPipe.js (client-side)
- **Charts:** Recharts
- **Networking:** Axios

---

## 2. Screens & Components

### Screen 1 — Patient Intake
- **Route:** `/`
- **Owner:** samkiel
- **Features:**
  - Form fields: Full name, Condition (text), Pain level (1–10 slider), Exercise assigned (dropdown: Shoulder Raise, Knee Bend, Hip Flex).
  - Submit button → `POST /start-session` → redirect to `/session`.
  - Validation: All fields required before submit.
  - Simple, mobile-friendly layout.

### Screen 2 — Exercise Session (CORE SCREEN)
- **Route:** `/session`
- **Owner:** samkiel
- **Features:**
  - Live camera feed with MediaPipe skeleton overlay drawn on `<canvas>`.
  - Form Score badge (0–100) updating every second.
  - Rep counter incrementing automatically.
  - Real-time text feedback bar: e.g., "Raise arm higher", "Good form!".
  - Audio feedback trigger (Web Speech API or pre-recorded clips).
  - End Session button → `POST /end-session` → redirect to `/summary`.
  - Sends frames to backend: `POST /analyze-frame` every 500ms via WebSocket or polling.

### Screen 3 — Session Summary
- **Route:** `/summary`
- **Owner:** samkiel
- **Features:**
  - Displays: Average form score, total reps, duration, top 3 errors detected.
  - Simple card layout (no charts required).
  - Button: "Back to Home".

### Screen 4 — Clinician Dashboard
- **Route:** `/clinician`
- **Owner:** John
- **Features:**
  - Patient list on left panel → click to view sessions.
  - Session history table: date, duration, avg score, errors.
  - Form Score Trend line chart (Recharts) — last 7 sessions.
  - Common Errors panel: bar chart of most frequent errors.
  - Data from: `GET /patient/{id}/sessions` and `GET /patient/{id}/analytics`.

### Screen 5 — Navigation / Layout
- **Route:** Shared layout
- **Owner:** John
- **Features:**
  - Top navbar: Rehaby logo, Patient | Clinician links.
  - Responsive for desktop and tablet.
  - Loading states and error boundary components.

---

## 3. Task Assignment

**Deadline:** May 19, 2026. No scope additions after May 16.

| Task | Owner | Priority | Deadline |
| :--- | :--- | :--- | :--- |
| Vite + Tailwind scaffold | samkiel | **HIGH** | Day 1 (May 14) |
| React Router setup | samkiel | **HIGH** | Day 1 (May 14) |
| Patient Intake Screen | samkiel | **HIGH** | Day 2 (May 15) |
| MediaPipe.js integration | samkiel | **HIGH** | Day 2–3 |
| Canvas skeleton overlay | samkiel | **HIGH** | Day 3 (May 16) |
| Frame → backend loop | samkiel | **HIGH** | Day 3–4 |
| Form score + rep counter UI | samkiel | **HIGH** | Day 4 (May 17) |
| Audio feedback (Web Speech) | samkiel | **MED** | Day 4 |
| Session Summary screen | samkiel | **MED** | Day 5 (May 18) |
| Navbar + layout | John | **HIGH** | Day 2 (May 15) |
| Clinician patient list | John | **HIGH** | Day 3 (May 16) |
| Session history table | John | **HIGH** | Day 3–4 |
| Recharts form score trend | John | **MED** | Day 4–5 |
| Common errors bar chart | John | **MED** | Day 5 |
| Loading + error states | John | **LOW** | Day 5 |

---

## 4. MediaPipe Integration Notes

Use MediaPipe.js (browser-native). **Do NOT use Python OpenCV on the frontend.**

### Installation
```bash
npm install @mediapipe/pose @mediapipe/camera_utils @mediapipe/drawing_utils
```

### Basic Setup
```javascript
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

const pose = new Pose({ locateFile: (file) =>
  `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}` 
});

pose.setOptions({ 
  modelComplexity: 1, 
  smoothLandmarks: true, 
  minDetectionConfidence: 0.5 
});

pose.onResults((results) => {
  // 1. Draw skeleton on canvas
  // 2. Send landmarks to backend
});
```

**Key landmarks for shoulder raise:** `LEFT_SHOULDER` (11), `RIGHT_SHOULDER` (12), `LEFT_ELBOW` (13), `RIGHT_ELBOW` (14), `LEFT_WRIST` (15), `RIGHT_WRIST` (16).

---

## 5. Frontend ↔ Backend Contract

**Base URL (Local Dev):** `http://localhost:8000`  
**All responses:** JSON

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/start-session` | Create new session, returns `session_id` |
| POST | `/analyze-frame` | Send pose landmarks, get score + feedback |
| POST | `/end-session` | Close session, get summary |
| GET | `/patient/{id}/sessions` | All sessions for a patient |
| GET | `/patient/{id}/analytics` | Score trends + error frequency |
| GET | `/session/{id}/details` | Full detail of one session |

> [!TIP]
> If backend is not ready, mock all endpoints with static JSON in `/src/mocks/api.js` so frontend development is never blocked.

---

## 6. Team Rules

1. samkiel scaffolds the repo and pushes to GitHub. John clones.
2. **Never work on the same file at the same time** — divide by route.
3. Daily standup message in group chat: what samkiel did, what's next, any blockers.
4. If blocked for more than 2 hours, flag it immediately — don't wait.
5. No new features after May 16. Only polish and bug fixes after that.