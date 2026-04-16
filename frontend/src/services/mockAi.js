export const CONDITION_OPTIONS = [
  "Hypertension",
  "Diabetes",
  "Asthma",
  "Cardiac history",
  "Kidney disease",
  "Obesity",
];

export const SYMPTOM_OPTIONS = [
  "Fatigue",
  "Shortness of breath",
  "Chest discomfort",
  "Headache",
  "Dizziness",
  "Swelling",
];

export const ACTIVITY_OPTIONS = [
  {
    value: "sedentary",
    label: "sedentary",
    description: "Low daily movement, limited exercise, desk-heavy routine.",
  },
  {
    value: "moderate",
    label: "moderate",
    description: "Regular walking or light workouts most days of the week.",
  },
  {
    value: "high",
    label: "high",
    description: "Strong activity consistency with exercise and recovery habits.",
  },
];

const REQUIRED_FIELDS = [
  ["age", "Age"],
  ["gender", "Gender"],
  ["weight", "Weight"],
  ["height", "Height"],
  ["systolic", "Systolic BP"],
  ["diastolic", "Diastolic BP"],
  ["heartRate", "Heart rate"],
  ["glucose", "Glucose"],
  ["sleepHours", "Sleep hours"],
  ["activityLevel", "Activity level"],
];

function hasValue(value) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (value === null || value === undefined) {
    return false;
  }

  return String(value).trim().length > 0;
}

function toNumber(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function calculateBmi(weight, height) {
  const numericWeight = toNumber(weight);
  const numericHeight = toNumber(height);

  if (!numericWeight || !numericHeight) {
    return 0;
  }

  return numericWeight / (numericHeight / 100) ** 2;
}

export function createEmptyHealthProfile(seedUser = {}) {
  return {
    age: seedUser.age ? String(seedUser.age) : "",
    gender: seedUser.gender || "",
    weight: "",
    height: "",
    systolic: "",
    diastolic: "",
    heartRate: "",
    glucose: "",
    oxygen: "",
    sleepHours: "",
    activityLevel: "moderate",
    conditions: [],
    symptoms: [],
    medications: "",
    notes: "",
    report: null,
    updatedAt: null,
  };
}

export function getProfileCompletion(profile) {
  const missingFields = REQUIRED_FIELDS.filter(([key]) => !hasValue(profile[key])).map(
    ([, label]) => label,
  );

  const completeCount = REQUIRED_FIELDS.length - missingFields.length;
  const optionalBoost =
    (profile.report ? 1 : 0) +
    (profile.conditions?.length > 0 ? 1 : 0) +
    (profile.symptoms?.length > 0 ? 1 : 0) +
    (hasValue(profile.notes) ? 1 : 0);
  const totalSlots = REQUIRED_FIELDS.length + 4;
  const percentage = Math.round(((completeCount + optionalBoost) / totalSlots) * 100);

  return {
    percentage,
    missingFields,
    isReady: missingFields.length === 0,
  };
}

function createDriver(label, value, impact, reason, score) {
  return { label, value, impact, reason, score };
}

export function generatePredictionFromProfile(profile, user) {
  const age = toNumber(profile.age);
  const systolic = toNumber(profile.systolic);
  const diastolic = toNumber(profile.diastolic);
  const glucose = toNumber(profile.glucose);
  const heartRate = toNumber(profile.heartRate);
  const oxygen = toNumber(profile.oxygen);
  const sleepHours = toNumber(profile.sleepHours);
  const bmi = calculateBmi(profile.weight, profile.height);
  const completion = getProfileCompletion(profile);

  const drivers = [];
  let score = 18;

  if (age >= 55) {
    score += 14;
    drivers.push(
      createDriver("Age profile", `${age} years`, "Elevated", "Age-related risk factors increase monitoring intensity.", 14),
    );
  } else if (age >= 40) {
    score += 8;
    drivers.push(
      createDriver("Age profile", `${age} years`, "Moderate", "Mid-life risk factors suggest preventive follow-up.", 8),
    );
  }

  if (systolic >= 145 || diastolic >= 95) {
    score += 20;
    drivers.push(
      createDriver(
        "Blood pressure",
        `${systolic}/${diastolic}`,
        "High",
        "Blood pressure is above the desired target and strongly increases the score.",
        20,
      ),
    );
  } else if (systolic >= 130 || diastolic >= 85) {
    score += 10;
    drivers.push(
      createDriver(
        "Blood pressure",
        `${systolic}/${diastolic}`,
        "Moderate",
        "Borderline elevated blood pressure raises cardiometabolic risk.",
        10,
      ),
    );
  } else if (systolic > 0 && diastolic > 0) {
    drivers.push(
      createDriver(
        "Blood pressure",
        `${systolic}/${diastolic}`,
        "Protective",
        "Blood pressure is within a healthier operating range.",
        -4,
      ),
    );
    score -= 4;
  }

  if (glucose >= 140) {
    score += 16;
    drivers.push(
      createDriver(
        "Glucose",
        `${glucose} mg/dL`,
        "High",
        "Elevated glucose is a major signal for metabolic stress.",
        16,
      ),
    );
  } else if (glucose >= 110) {
    score += 8;
    drivers.push(
      createDriver(
        "Glucose",
        `${glucose} mg/dL`,
        "Moderate",
        "Glucose levels are above optimal and worth monitoring.",
        8,
      ),
    );
  }

  if (bmi >= 30) {
    score += 12;
    drivers.push(
      createDriver(
        "Body mass index",
        bmi.toFixed(1),
        "High",
        "BMI indicates added cardiometabolic burden.",
        12,
      ),
    );
  } else if (bmi >= 25) {
    score += 6;
    drivers.push(
      createDriver(
        "Body mass index",
        bmi.toFixed(1),
        "Moderate",
        "BMI suggests opportunity for weight optimization.",
        6,
      ),
    );
  } else if (bmi > 0) {
    score -= 3;
  }

  if (heartRate >= 100 || heartRate <= 52) {
    score += 8;
    drivers.push(
      createDriver(
        "Heart rate",
        `${heartRate} bpm`,
        "Moderate",
        "Heart rate is outside the common resting range.",
        8,
      ),
    );
  }

  if (oxygen > 0 && oxygen <= 94) {
    score += 10;
    drivers.push(
      createDriver(
        "Oxygen saturation",
        `${oxygen}%`,
        "High",
        "Lower oxygen saturation can indicate respiratory strain.",
        10,
      ),
    );
  }

  if (sleepHours > 0 && sleepHours < 6) {
    score += 8;
    drivers.push(
      createDriver(
        "Sleep quality",
        `${sleepHours} hrs`,
        "Moderate",
        "Reduced sleep can amplify inflammation and recovery issues.",
        8,
      ),
    );
  } else if (sleepHours >= 7 && sleepHours <= 8.5) {
    score -= 5;
  }

  if (profile.activityLevel === "sedentary") {
    score += 8;
    drivers.push(
      createDriver(
        "Activity level",
        "Sedentary",
        "Moderate",
        "Low movement reduces resilience and long-term health capacity.",
        8,
      ),
    );
  } else if (profile.activityLevel === "high") {
    score -= 8;
  } else {
    score -= 3;
  }

  score += Math.min(profile.conditions.length * 5, 18);
  score += Math.min(profile.symptoms.length * 3, 15);

  if (profile.conditions.length > 0) {
    drivers.push(
      createDriver(
        "Known conditions",
        profile.conditions.join(", "),
        profile.conditions.length >= 3 ? "High" : "Moderate",
        "Pre-existing conditions increase baseline risk and care complexity.",
        Math.min(profile.conditions.length * 5, 18),
      ),
    );
  }

  if (profile.report) {
    score -= 2;
  }

  const riskScore = clamp(Math.round(score), 12, 96);
  const confidence = clamp(
    Math.round(68 + completion.percentage * 0.24 + (profile.report ? 5 : 0)),
    70,
    97,
  );

  let riskLevel = "Low";
  let carePriority = "Routine wellness follow-up";
  let reviewWindow = "Review in 60-90 days";

  if (riskScore >= 76) {
    riskLevel = "Critical";
    carePriority = "Urgent physician review";
    reviewWindow = "Review within 24-48 hours";
  } else if (riskScore >= 58) {
    riskLevel = "High";
    carePriority = "Expedited care follow-up";
    reviewWindow = "Review within 7 days";
  } else if (riskScore >= 36) {
    riskLevel = "Moderate";
    carePriority = "Guided monitoring plan";
    reviewWindow = "Review in 2-4 weeks";
  }

  const topDrivers = drivers
    .sort((first, second) => Math.abs(second.score) - Math.abs(first.score))
    .slice(0, 4)
    .map(({ score: _score, ...driver }) => driver);

  const recommendations = [
    riskLevel === "Critical"
      ? "Arrange clinician outreach immediately and verify symptoms in real time."
      : riskLevel === "High"
        ? "Schedule a near-term physician follow-up and repeat vitals within the week."
        : riskLevel === "Moderate"
          ? "Maintain closer monitoring and repeat lab markers at the next scheduled visit."
          : "Continue preventive routines and keep routine follow-up on schedule.",
    systolic >= 130 || diastolic >= 85
      ? "Track blood pressure twice daily and share readings with the care team."
      : "Maintain current blood pressure habits with hydration and consistent activity.",
    glucose >= 110
      ? "Review nutrition balance and consider a fasting glucose recheck."
      : "Preserve stable glucose patterns with balanced meals and movement.",
    profile.activityLevel === "sedentary"
      ? "Introduce gradual daily walking or mobility sessions to lift cardiometabolic resilience."
      : "Sustain current activity levels and recovery habits.",
  ];

  const now = new Date().toISOString();
  const identifier = globalThis.crypto?.randomUUID?.() ?? `prediction-${Date.now()}`;
  const name = user?.name?.split(" ")[0] ?? "Patient";

  return {
    id: identifier,
    createdAt: now,
    savedAt: null,
    riskLevel,
    riskScore,
    confidence,
    carePriority,
    reviewWindow,
    headline: `${name}'s ${riskLevel.toLowerCase()}-risk care outlook`,
    summary:
      riskLevel === "Low"
        ? "The AI model sees a relatively stable profile with room to maintain healthy routines and continue routine monitoring."
        : riskLevel === "Moderate"
          ? "The current profile shows several moderate signals that justify closer tracking and preventive action over the next few weeks."
          : riskLevel === "High"
            ? "Multiple risk drivers are elevated, suggesting the patient should move into an accelerated follow-up plan."
            : "The combined clinical picture indicates urgent review and rapid intervention planning should be prioritized.",
    confidenceNarrative: profile.report
      ? "Confidence is strengthened by structured intake data plus an attached clinical document."
      : "Confidence is based on intake data alone and can improve with a report upload.",
    drivers: topDrivers,
    recommendations,
    profileSnapshot: profile,
  };
}
