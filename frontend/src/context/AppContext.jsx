import { createContext, useContext, useEffect, useState } from "react";
import {
  createEmptyHealthProfile,
  generatePredictionFromProfile,
  getProfileCompletion,
} from "../services/mockAi";

const STORAGE_KEYS = {
  users: "mediscope.users",
  session: "mediscope.session",
  profiles: "mediscope.profiles",
  currentPredictions: "mediscope.currentPredictions",
  histories: "mediscope.histories",
};

const DEFAULT_USERS = [
  {
    id: "demo-user",
    name: "Drishti Mehra",
    email: "demo@healthai.com",
    password: "Health123!",
    age: 36,
    gender: "Female",
  },
];

const seededProfile = {
  ...createEmptyHealthProfile(DEFAULT_USERS[0]),
  age: "36",
  gender: "Female",
  weight: "69",
  height: "168",
  systolic: "132",
  diastolic: "86",
  heartRate: "78",
  glucose: "118",
  oxygen: "98",
  sleepHours: "6.8",
  activityLevel: "moderate",
  conditions: ["Hypertension"],
  symptoms: ["Fatigue"],
  medications: "Amlodipine 5mg daily",
  notes: "Patient reports work-related stress and inconsistent sleep.",
  report: {
    name: "quarterly-labs.pdf",
    size: 412000,
    type: "application/pdf",
    lastModified: 1768800000000,
  },
  updatedAt: "2026-03-20T09:30:00.000Z",
};

const seedPredictionOne = {
  ...generatePredictionFromProfile(seededProfile, DEFAULT_USERS[0]),
  id: "seed-prediction-1",
  createdAt: "2026-03-19T08:30:00.000Z",
  savedAt: "2026-03-19T08:35:00.000Z",
};

const seedPredictionTwo = {
  ...generatePredictionFromProfile(
    {
      ...seededProfile,
      systolic: "126",
      diastolic: "82",
      glucose: "109",
      sleepHours: "7.3",
      activityLevel: "high",
      symptoms: [],
    },
    DEFAULT_USERS[0],
  ),
  id: "seed-prediction-2",
  createdAt: "2026-03-12T08:10:00.000Z",
  savedAt: "2026-03-12T08:14:00.000Z",
};

const seedPredictionThree = {
  ...generatePredictionFromProfile(
    {
      ...seededProfile,
      systolic: "138",
      diastolic: "88",
      glucose: "124",
      sleepHours: "6.1",
      activityLevel: "sedentary",
      symptoms: ["Fatigue", "Headache"],
    },
    DEFAULT_USERS[0],
  ),
  id: "seed-prediction-3",
  createdAt: "2026-03-02T07:45:00.000Z",
  savedAt: "2026-03-02T07:52:00.000Z",
};

const INITIAL_PROFILES = {
  "demo-user": seededProfile,
};

const INITIAL_HISTORIES = {
  "demo-user": [seedPredictionOne, seedPredictionTwo, seedPredictionThree],
};

const INITIAL_CURRENT_PREDICTIONS = {
  "demo-user": seedPredictionOne,
};

const AppContext = createContext(null);

function readStoredValue(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch {
    return fallback;
  }
}

function useStoredState(key, fallback) {
  const [state, setState] = useState(() => readStoredValue(key, fallback));

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export function AppProvider({ children }) {
  const [users, setUsers] = useStoredState(STORAGE_KEYS.users, DEFAULT_USERS);
  const [session, setSession] = useStoredState(STORAGE_KEYS.session, null);
  const [profiles, setProfiles] = useStoredState(STORAGE_KEYS.profiles, INITIAL_PROFILES);
  const [currentPredictions, setCurrentPredictions] = useStoredState(
    STORAGE_KEYS.currentPredictions,
    INITIAL_CURRENT_PREDICTIONS,
  );
  const [histories, setHistories] = useStoredState(STORAGE_KEYS.histories, INITIAL_HISTORIES);

  const user = users.find((item) => item.id === session?.userId) ?? null;
  const healthProfile = user
    ? profiles[user.id] ?? createEmptyHealthProfile(user)
    : createEmptyHealthProfile();
  const currentPrediction = user ? currentPredictions[user.id] ?? null : null;
  const history = user ? histories[user.id] ?? [] : [];
  const profileCompletion = getProfileCompletion(healthProfile);
  const isAuthenticated = Boolean(session?.token && user);

  const login = async ({ email, password }) => {
    const matchingUser = users.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password,
    );

    if (!matchingUser) {
      throw new Error("Invalid email or password. Use the demo credentials or create a new account.");
    }

    const token = `session-${matchingUser.id}`;
    setSession({
      userId: matchingUser.id,
      token,
      issuedAt: new Date().toISOString(),
    });
    localStorage.setItem("token", token);

    return matchingUser;
  };

  const signup = async (form) => {
    const email = form.email.trim().toLowerCase();

    if (users.some((item) => item.email.toLowerCase() === email)) {
      throw new Error("An account with this email already exists.");
    }

    const nextUser = {
      id: globalThis.crypto?.randomUUID?.() ?? `user-${Date.now()}`,
      name: form.name.trim(),
      email,
      password: form.password,
      age: form.age,
      gender: form.gender,
    };

    setUsers((current) => [...current, nextUser]);
    setProfiles((current) => ({
      ...current,
      [nextUser.id]: {
        ...createEmptyHealthProfile(nextUser),
        age: form.age,
        gender: form.gender,
        updatedAt: new Date().toISOString(),
      },
    }));
    setHistories((current) => ({
      ...current,
      [nextUser.id]: [],
    }));
    setCurrentPredictions((current) => ({
      ...current,
      [nextUser.id]: null,
    }));
    const token = `session-${nextUser.id}`;
    setSession({
      userId: nextUser.id,
      token,
      issuedAt: new Date().toISOString(),
    });
    localStorage.setItem("token", token);

    return nextUser;
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem("token");
  };

  const saveHealthProfile = (nextProfile) => {
    if (!user) {
      return null;
    }

    const profileToPersist = {
      ...healthProfile,
      ...nextProfile,
      updatedAt: new Date().toISOString(),
    };

    setProfiles((current) => ({
      ...current,
      [user.id]: profileToPersist,
    }));

    return profileToPersist;
  };

  const runPrediction = () => {
    if (!user) {
      throw new Error("Please sign in before running a prediction.");
    }

    const completion = getProfileCompletion(healthProfile);

    if (!completion.isReady) {
      throw new Error("Please complete all required health fields before running the model.");
    }

    const nextPrediction = generatePredictionFromProfile(healthProfile, user);

    setCurrentPredictions((current) => ({
      ...current,
      [user.id]: nextPrediction,
    }));

    return nextPrediction;
  };

  const saveCurrentPrediction = () => {
    if (!user || !currentPrediction) {
      return false;
    }

    if (currentPrediction.savedAt) {
      return false;
    }

    const savedPrediction = {
      ...currentPrediction,
      savedAt: new Date().toISOString(),
    };

    setCurrentPredictions((current) => ({
      ...current,
      [user.id]: savedPrediction,
    }));

    setHistories((current) => ({
      ...current,
      [user.id]: [savedPrediction, ...(current[user.id] ?? [])],
    }));

    return true;
  };

  const deleteHistoryItem = (predictionId) => {
    if (!user) {
      return;
    }

    setHistories((current) => ({
      ...current,
      [user.id]: (current[user.id] ?? []).filter((entry) => entry.id !== predictionId),
    }));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        users,
        isAuthenticated,
        session,
        healthProfile,
        currentPrediction,
        history,
        profileCompletion,
        login,
        signup,
        logout,
        saveHealthProfile,
        runPrediction,
        saveCurrentPrediction,
        deleteHistoryItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within AppProvider.");
  }

  return context;
}
