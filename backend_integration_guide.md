# Pulse AI: Backend Integration Guide

This document provides a technical overview of the Pulse AI frontend to assist backend developers in planning API integration.

## 1. Technology Stack
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v6)
- **State Management**: React Context API ([AppContext.jsx](file:///c:/Users/abhiy/OneDrive/Desktop/Major_Frontend/frontend/src/context/AppContext.jsx))
- **Visualizations**: Recharts
- **Feedback**: React Hot Toast
- **Icons**: Lucide/Feather (via React Icons)

---

## 2. Key Pages & Routes
| Route | Component | Purpose |
| :--- | :--- | :--- |
| `/` | [Login.jsx](file:///c:/Users/abhiy/OneDrive/Desktop/Major_Frontend/frontend/src/pages/Login.jsx) | User authentication entry point. |
| `/signup` | [Signup.jsx](file:///c:/Users/abhiy/OneDrive/Desktop/Major_Frontend/frontend/src/pages/Signup.jsx) | New user onboarding. |
| `/dashboard` | [Dashboard.jsx](file:///c:/Users/abhiy/OneDrive/Desktop/Major_Frontend/frontend/src/pages/Dashboard.jsx) | Multi-metric overview and trends. |
| `/dashboard/health-input` | [HealthInput.jsx](file:///c:/Users/abhiy/OneDrive/Desktop/Major_Frontend/frontend/src/pages/HealthInput.jsx) | Clinical data entry (Vitals, Lab reports). |
| `/dashboard/prediction` | [Prediction.jsx](file:///c:/Users/abhiy/OneDrive/Desktop/Major_Frontend/frontend/src/pages/Prediction.jsx) | AI "Synthesis" launchpad (triggers analysis). |
| `/dashboard/results` | [Result.jsx](file:///c:/Users/abhiy/OneDrive/Desktop/Major_Frontend/frontend/src/pages/Result.jsx) | High-fidelity analysis output. |
| `/dashboard/history` | [History.jsx](file:///c:/Users/abhiy/OneDrive/Desktop/Major_Frontend/frontend/src/pages/History.jsx) | Chronological list of past assessments. |
| `/dashboard/chat` | [ChatAssistant.jsx](file:///c:/Users/abhiy/OneDrive/Desktop/Major_Frontend/frontend/src/pages/ChatAssistant.jsx) | Medical AI chat interface. |
| `/dashboard/report/:id` | [Report.jsx](file:///c:/Users/abhiy/OneDrive/Desktop/Major_Frontend/frontend/src/pages/Report.jsx) | Detailed clinical report for specific records. |

---

## 3. Data Flow & State
The application uses a centralized `AppContext` for state management, currently persisting to `localStorage`.

### Key Data Entities
- **User**: `{ id, name, email, age, gender }`
- **Health Profile**: `{ weight, height, systolic, diastolic, heartRate, glucose, oxygen, sleepHours, activityLevel, conditions, symptoms, medications, notes, report }`
- **Prediction**: `{ id, riskLevel, riskScore, confidence, carePriority, reviewWindow, headline, summary, drivers[], recommendations[], profileSnapshot, createdAt, savedAt }`

### Core Services ([src/services/mockAi.js](file:///c:/Users/abhiy/OneDrive/Desktop/Major_Frontend/frontend/src/services/mockAi.js))
Currently, all "AI" logic is client-side. To integrate a real backend:
1. **POST /auth/login**: Replace [login()](file:///c:/Users/abhiy/OneDrive/Desktop/Major_Frontend/frontend/src/context/AppContext.jsx#152-172) in context.
2. **POST /auth/signup**: Replace [signup()](file:///c:/Users/abhiy/OneDrive/Desktop/Major_Frontend/frontend/src/context/AppContext.jsx#173-217) in context.
3. **GET /profile**: Replace `healthProfile` initialization.
4. **POST /analysis/run**: Replace [generatePredictionFromProfile()](file:///c:/Users/abhiy/OneDrive/Desktop/Major_Frontend/frontend/src/services/mockAi.js#129-396).
5. **GET /history**: Replace `histories` state.

### Integration Checklist
- [ ] Implement JWT-based authentication.
- [ ] Create Patient/Profile endpoints.
- [ ] Develop a Risk Analysis engine (to replace [mockAi.js](file:///c:/Users/abhiy/OneDrive/Desktop/Major_Frontend/frontend/src/services/mockAi.js) logic).
- [ ] Set up file storage for laboratory PDF reports.
