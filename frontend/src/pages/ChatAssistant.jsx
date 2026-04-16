import { useState, useRef, useEffect } from "react";
import {
  FiCpu,
  FiSend,
  FiUser,
  FiMessageCircle,
  FiHeart,
  FiArrowDown,
} from "react-icons/fi";
import { useApp } from "../context/AppContext";

/* ─── Mock AI health responder ─── */

const HEALTH_RESPONSES = [
  {
    keywords: ["blood pressure", "bp", "hypertension", "systolic", "diastolic"],
    reply:
      "Blood pressure is a key indicator of cardiovascular health. A reading below 120/80 mmHg is considered normal. Elevated readings (130/85+) warrant closer monitoring — tracking twice daily and sharing readings with your care team can help identify patterns. Lifestyle factors like sodium intake, stress management, and regular exercise play significant roles.",
  },
  {
    keywords: ["glucose", "sugar", "diabetes", "blood sugar", "insulin"],
    reply:
      "Blood glucose management is central to metabolic health. Fasting glucose below 100 mg/dL is typically considered normal, while levels between 100–125 suggest prediabetes. Regular monitoring, balanced nutrition with controlled carbohydrate intake, and consistent physical activity are the most effective strategies for maintaining healthy glucose levels.",
  },
  {
    keywords: ["sleep", "insomnia", "rest", "tired", "fatigue"],
    reply:
      "Quality sleep (7–9 hours for adults) is critical for immune function, cognitive performance, and metabolic regulation. Poor sleep can amplify inflammation and worsen existing conditions. Consider maintaining a consistent sleep schedule, limiting screen time before bed, and creating a cool, dark sleeping environment.",
  },
  {
    keywords: ["exercise", "activity", "workout", "fitness", "walk", "running"],
    reply:
      "Regular physical activity — even 30 minutes of brisk walking daily — can significantly reduce cardiovascular risk, improve glucose metabolism, and enhance mental well-being. The key is consistency over intensity. Start with activities you enjoy and gradually increase duration and effort.",
  },
  {
    keywords: ["heart", "chest", "cardiac", "heart rate", "palpitation"],
    reply:
      "A normal resting heart rate is typically between 60–100 bpm. Rates consistently outside this range should be evaluated by a healthcare provider. Regular cardiovascular exercise can strengthen the heart and lower resting heart rate over time. If you experience chest discomfort, shortness of breath, or irregular rhythms, seek medical evaluation promptly.",
  },
  {
    keywords: ["weight", "bmi", "obesity", "overweight", "diet", "nutrition"],
    reply:
      "Body Mass Index (BMI) is a screening tool — a BMI of 18.5–24.9 is generally considered healthy. However, body composition matters more than the number alone. Focus on sustainable dietary patterns rich in vegetables, lean proteins, and whole grains rather than restrictive diets. Small, consistent changes yield the best long-term results.",
  },
  {
    keywords: ["stress", "anxiety", "mental", "depression", "mood"],
    reply:
      "Mental health is deeply connected to physical health. Chronic stress elevates cortisol, which can impact blood pressure, glucose metabolism, and immune function. Evidence-based approaches like mindfulness, cognitive behavioral techniques, regular exercise, and maintaining social connections are effective strategies. Don't hesitate to seek professional support when needed.",
  },
  {
    keywords: ["oxygen", "breathing", "lungs", "respiratory", "spo2", "asthma"],
    reply:
      "Normal oxygen saturation (SpO₂) is typically 95–100%. Levels below 94% may indicate respiratory compromise and should be medically evaluated. Deep breathing exercises, regular cardiovascular activity, and avoiding pollutants can support lung health. If you have asthma or COPD, adhering to prescribed maintenance therapies is essential.",
  },
  {
    keywords: ["medication", "medicine", "drug", "prescription", "side effect"],
    reply:
      "Medication adherence is crucial for managing chronic conditions effectively. Always take medications as prescribed and discuss any side effects with your healthcare provider rather than adjusting doses independently. Keep a current medication list, be aware of interactions, and attend regular follow-ups to review your treatment plan.",
  },
  {
    keywords: ["headache", "migraine", "head pain"],
    reply:
      "Headaches can be triggered by dehydration, stress, poor sleep, eye strain, or underlying conditions. Keeping a headache diary (noting timing, triggers, and associated symptoms) can help identify patterns. Staying hydrated, managing stress, and maintaining regular sleep schedules are effective preventive strategies. Persistent or severe headaches should be evaluated by a healthcare professional.",
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good evening"],
    reply:
      "Hello! I'm your Pulse AI health assistant. I can help you understand your health metrics, provide general wellness guidance, and answer questions about the health data in your profile. What would you like to know?",
  },
  {
    keywords: ["thank", "thanks", "appreciate"],
    reply:
      "You're welcome! Remember, I'm here to provide general health information and guidance based on your profile data. For specific medical concerns, always consult your healthcare provider. Feel free to ask me anything else about your health metrics.",
  },
  {
    keywords: ["risk", "prediction", "score", "assessment"],
    reply:
      "Your risk assessment is based on multiple factors including biometric data, lifestyle patterns, known conditions, and clinical context. The AI model evaluates these factors holistically to generate a risk score. You can view your latest prediction on the Results page and track trends over time in the History section.",
  },
];

const FALLBACK_RESPONSES = [
  "That's a great question about health. Based on general medical guidance, I'd recommend discussing this specific concern with your healthcare provider for personalized advice. In the meantime, maintaining a balanced diet, regular exercise, and adequate sleep are foundational to overall well-being.",
  "I appreciate your question! While I can offer general health insights, your specific situation may benefit from a professional evaluation. Would you like to know more about any of your current health metrics or how they relate to your risk profile?",
  "Interesting question! Health is multifaceted, and the best approach is always personalized. I can help you understand your current biometric data and what the AI model highlights as key areas to monitor. Would you like me to walk through any specific metric?",
  "That's worth exploring further. As a health AI assistant, I focus on helping you understand your metrics and risk factors. For clinical decisions, your care team is the best resource. Is there a specific health topic I can help clarify?",
];

const SUGGESTED_QUESTIONS = [
  "What does my blood pressure reading mean?",
  "How can I improve my sleep quality?",
  "What's a healthy glucose level?",
  "How does exercise affect my risk score?",
  "What should I know about heart rate?",
  "How can I manage stress better?",
];

function getAiResponse(message, userProfile) {
  const lower = message.toLowerCase();

  // Check for profile-specific queries
  if (lower.includes("my profile") || lower.includes("my data") || lower.includes("my health")) {
    const name = userProfile?.name?.split(" ")[0] ?? "there";
    return `Hi ${name}! Based on your current health profile, here's a quick summary of your key metrics. You can view and update all your data on the Health Input page, and run a fresh AI prediction anytime from the Prediction page. Is there a specific metric you'd like me to explain?`;
  }

  // Match against keyword patterns
  for (const entry of HEALTH_RESPONSES) {
    if (entry.keywords.some((keyword) => lower.includes(keyword))) {
      return entry.reply;
    }
  }

  // Fallback
  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}

/* ─── Chat component ─── */

function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-9 w-9 flex-none items-center justify-center rounded-2xl text-sm ${
          isUser
            ? "bg-slate-950 text-white"
            : "bg-gradient-to-br from-cyan-500 to-teal-500 text-white shadow-md"
        }`}
      >
        {isUser ? <FiUser /> : <FiCpu />}
      </div>

      <div
        className={`max-w-[75%] rounded-[1.25rem] px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "rounded-tr-md bg-slate-950 text-white"
            : "rounded-tl-md border border-slate-100 bg-white text-slate-700 shadow-sm"
        }`}
      >
        {message.content}
        <p
          className={`mt-2 text-[10px] ${
            isUser ? "text-slate-400" : "text-slate-400"
          }`}
        >
          {message.time}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 text-sm text-white shadow-md">
        <FiCpu />
      </div>
      <div className="rounded-[1.25rem] rounded-tl-md border border-slate-100 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500" style={{ animationDelay: "0ms" }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: "150ms" }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-300" style={{ animationDelay: "300ms" }} />
          <span className="ml-2 text-xs text-slate-500">Pulse AI is thinking...</span>
        </div>
      </div>
    </div>
  );
}

export default function ChatAssistant() {
  const { user, healthProfile, currentPrediction } = useApp();
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: `Welcome to Pulse AI Assistant! 👋 I'm here to help you understand your health metrics, answer wellness questions, and provide guidance based on your profile data. Ask me anything about blood pressure, glucose, sleep, exercise, or your risk assessment.`,
      time: formatTime(new Date()),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  function formatTime(date) {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const scrollToBottom = (behavior = "smooth") => {
    chatEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 120);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      time: formatTime(new Date()),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay (1.2–2.5s)
    const delay = 1200 + Math.random() * 1300;
    setTimeout(() => {
      const aiReply = getAiResponse(trimmed, user);
      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: aiReply,
        time: formatTime(new Date()),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, delay);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (question) => {
    setInput(question);
    inputRef.current?.focus();
  };

  return (
    <div className="page-enter flex h-[calc(100vh-12rem)] flex-col">
      {/* Suggested questions (show only when few messages) */}
      {messages.length <= 1 && (
        <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <FiMessageCircle />
            <span>Try asking</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSuggestion(q)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                {q}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Chat area */}
      <div
        ref={chatContainerRef}
        className="premium-scroll relative flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50"
      >
        <div className="space-y-5">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={chatEndRef} />
        </div>

        {/* Scroll-to-bottom FAB */}
        {showScrollButton && (
          <button
            type="button"
            onClick={() => scrollToBottom()}
            className="fixed bottom-36 right-10 z-20 rounded-full bg-slate-900 p-3 text-white shadow-lg transition hover:bg-slate-800 dark:bg-cyan-600 dark:hover:bg-cyan-500"
          >
            <FiArrowDown />
          </button>
        )}
      </div>

      {/* Input bar */}
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-end gap-3">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-slate-900 text-sm text-white shadow dark:bg-cyan-600">
            <FiHeart />
          </div>

          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Ask about your health metrics, wellness tips, or risk factors..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-1 focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              style={{ maxHeight: "120px" }}
              disabled={isTyping}
            />
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-cyan-600 dark:hover:bg-cyan-500"
          >
            <FiSend />
          </button>
        </div>

        <p className="mt-2 text-center text-[10px] text-slate-400">
          Pulse AI provides general health information only. Always consult your healthcare provider for medical decisions.
        </p>
      </div>
    </div>
  );
}
