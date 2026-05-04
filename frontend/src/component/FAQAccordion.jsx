import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

const faqs = [
  {
    question: "Is my medical data secure and private?",
    answer:
      "Absolutely. Pulse AI employs enterprise-grade AES-256 encryption for all data at rest and in transit. We comply with modern health data standards and never share your identifiable information with third parties without explicit consent.",
  },
  {
    question: "How accurate is the AI Prediction Engine?",
    answer:
      "Our predictive models are trained on millions of anonymized clinical records and achieve a high confidence interval. However, Pulse AI is designed to assist, not replace, professional medical diagnosis. Always consult a healthcare provider for medical decisions.",
  },
  {
    question: "Can I export my risk analysis reports?",
    answer:
      "Yes. Every prediction generates a comprehensive clinical report that you can easily export as a formatted PDF to share with your primary care physician or specialist.",
  },
  {
    question: "Does Pulse AI support lab report uploads?",
    answer:
      "Yes! You can upload PDF lab reports directly into the Dashboard. Our NLP engine automatically extracts key biomarkers (like glucose, cholesterol, etc.) and integrates them into your health profile for more accurate predictions.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mx-auto mt-16 max-w-3xl space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = index === openIndex;

        return (
          <motion.div
            key={index}
            initial={false}
            className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
              isOpen
                ? "border-cyan-500/50 bg-white shadow-md dark:border-cyan-500/30 dark:bg-slate-900"
                : "border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
            }`}
          >
            <button
              className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <span className="text-base font-semibold text-slate-900 dark:text-white">
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  isOpen
                    ? "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400"
                    : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                <FiChevronDown />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: "auto", marginBottom: 20 },
                    collapsed: { opacity: 0, height: 0, marginBottom: 0 },
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-6 text-slate-600 dark:text-slate-400">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
