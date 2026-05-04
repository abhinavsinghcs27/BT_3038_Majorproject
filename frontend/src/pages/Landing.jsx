import { Link } from "react-router-dom";
import PublicNavbar from "../component/PublicNavbar";
import { 
  FiActivity, 
  FiShield, 
  FiClock, 
  FiCpu, 
  FiCheckCircle, 
  FiArrowRight,
  FiFileText,
  FiHeart
} from "react-icons/fi";
import { motion } from "framer-motion";
import FAQAccordion from "../component/FAQAccordion";

export default function Landing() {
  return (
    <div className="min-h-screen  bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 selection:bg-cyan-500/30 font-sans">
      <PublicNavbar />

      <main>
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 inset-x-0 h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]"></div>
            <div className="absolute top-40 -left-40 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 text-sm font-semibold mb-6 border border-cyan-100 dark:border-cyan-800/50">
                <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></span>
                Next-Gen Clinical Intelligence
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8">
                Transforming Healthcare with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-emerald-500">
                  Predictive AI
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Empower your clinical decisions with real-time risk assessment, deep health profiling, and intelligent symptom synthesis. Proactive care starts here.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] hover:shadow-cyan-500/40"
                >
                  Start Free Trial <FiArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-800"
                >
                  View Demo
                </a>
              </div>
            </motion.div>

            {/* Dashboard Mockup Preview */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-20 relative mx-auto max-w-5xl"
            >
              <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-2 shadow-2xl overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/10">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 h-[300px] md:h-[500px] flex flex-col relative overflow-hidden">
                  {/* macOS style title bar */}
                  <div className="h-10 border-b border-slate-200 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex items-center px-4 gap-2 shrink-0">
                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  {/* Layout */}
                  <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar skeleton */}
                    <div className="hidden sm:flex flex-col w-48 border-r border-slate-200 dark:border-slate-800/60 bg-white/30 dark:bg-slate-900/30 p-4 gap-4">
                      <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-md mb-4"></div>
                      <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md opacity-70"></div>
                      <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-md opacity-70"></div>
                      <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-md opacity-70"></div>
                      <div className="h-4 w-full bg-cyan-100 dark:bg-cyan-900/30 rounded-md text-cyan-500 flex items-center px-2"></div>
                      <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md opacity-70 mt-auto"></div>
                    </div>
                    {/* Main Content */}
                    <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 md:gap-6 relative bg-grid-slate-200/50 dark:bg-grid-slate-800/50 bg-[length:32px_32px]">
                       {/* Floating glowing orbs for premium feel */}
                       <div className="absolute top-10 right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]"></div>
                       
                       <div className="flex justify-between items-center mb-2">
                         <div className="h-8 w-32 md:w-40 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                         <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                       </div>
                       
                       <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                         {/* Card 1: Risk Score */}
                         <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between group hover:border-cyan-500/50 transition-colors">
                           <div className="flex items-center gap-2 mb-4">
                             <FiActivity className="text-emerald-500 w-5 h-5" />
                             <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Risk Score</span>
                           </div>
                           <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Low</div>
                           <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-4 overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "25%" }}
                                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                                className="bg-emerald-500 h-full"
                              ></motion.div>
                           </div>
                         </div>
                         
                         {/* Card 2: AI Status */}
                         <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
                           <div className="flex items-center gap-2 mb-4">
                             <FiCpu className="text-cyan-500 w-5 h-5" />
                             <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Engine</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <span className="relative flex h-3 w-3 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                              </span>
                             <span className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400 truncate">Processing vitals...</span>
                           </div>
                           <div className="space-y-2 mt-4">
                             <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                             <div className="h-1.5 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                           </div>
                         </div>
                         
                         {/* Card 3: Heart Rate (Hidden on mobile) */}
                         <div className="hidden lg:flex bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex-col justify-between">
                           <div className="flex items-center gap-2 mb-4">
                             <FiHeart className="text-rose-500 w-5 h-5" />
                             <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Heart Rate</span>
                           </div>
                           <div className="flex items-end gap-2">
                             <span className="text-3xl font-black text-slate-900 dark:text-white">72</span>
                             <span className="text-sm text-slate-500 pb-1">bpm</span>
                           </div>
                           <div className="flex gap-1 mt-4 items-end h-8">
                             {[40, 70, 45, 90, 65, 85, 50].map((h, i) => (
                               <motion.div 
                                 key={i}
                                 initial={{ height: 0 }}
                                 animate={{ height: `${h}%` }}
                                 transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                 className="w-full bg-rose-500/50 rounded-t-sm"
                               />
                             ))}
                           </div>
                         </div>
                       </div>
                       
                       {/* Main Chart Area Skeleton */}
                       <div className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col min-h-0">
                         <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-md mb-6 shrink-0"></div>
                         <div className="flex-1 relative flex items-end gap-2 overflow-hidden">
                           <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pb-0">
                             <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-800 h-0"></div>
                             <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-800 h-0"></div>
                             <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-800 h-0"></div>
                             <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-800 h-0"></div>
                           </div>
                           {/* Simulated Line Chart using SVG */}
                           <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                             <motion.path
                               initial={{ pathLength: 0 }}
                               whileInView={{ pathLength: 1 }}
                               viewport={{ once: true }}
                               transition={{ duration: 2, ease: "easeInOut", delay: 0.8 }}
                               d="M0,80 Q10,70 20,80 T40,60 T60,70 T80,30 T100,40"
                               fill="none"
                               stroke="url(#gradient)"
                               strokeWidth="3"
                               className="drop-shadow-lg"
                             />
                             <defs>
                               <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                 <stop offset="0%" stopColor="#0891b2" />
                                 <stop offset="100%" stopColor="#10b981" />
                               </linearGradient>
                             </defs>
                           </svg>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* TRUSTED PARTNERS MARQUEE */}
        <section className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 py-10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Powered by trusted clinical technology</p>
          </div>
          <div className="flex w-full overflow-hidden">
            <motion.div 
              className="flex whitespace-nowrap items-center gap-16 px-8"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 20, repeat: Infinity }}
            >
              {/* Duplicate array for seamless looping */}
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-16">
                  <div className="text-2xl font-black text-slate-300 dark:text-slate-700 opacity-60">TensorFlow</div>
                  <div className="text-2xl font-black text-slate-300 dark:text-slate-700 opacity-60">Azure Health</div>
                  <div className="text-2xl font-black text-slate-300 dark:text-slate-700 opacity-60">React</div>
                  <div className="text-2xl font-black text-slate-300 dark:text-slate-700 opacity-60">PyTorch</div>
                  <div className="text-2xl font-black text-slate-300 dark:text-slate-700 opacity-60">AWS Medical</div>
                  <div className="text-2xl font-black text-slate-300 dark:text-slate-700 opacity-60">OpenAI</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-24 bg-white dark:bg-slate-900 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-sm font-semibold text-cyan-600 tracking-wide uppercase">Core Capabilities</h2>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Intelligence at Every Step
              </p>
              <p className="mt-4 max-w-2xl text-xl text-slate-500 dark:text-slate-400 mx-auto">
                Pulse AI combines advanced machine learning with clinical data to provide unparalleled insights.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <FiCpu />,
                  title: "Predictive Analytics",
                  desc: "Utilize ML models to predict risks for heart disease, diabetes, and other chronic conditions based on vitals."
                },
                {
                  icon: <FiHeart />,
                  title: "Vitals Tracking",
                  desc: "Monitor longitudinal health data. Track blood pressure, glucose, BMI, and other critical metrics over time."
                },
                {
                  icon: <FiFileText />,
                  title: "Smart Lab Reports",
                  desc: "Upload PDF lab reports. Our NLP engine extracts key biomarkers and highlights abnormalities automatically."
                },
                {
                  icon: <FiShield />,
                  title: "Secure & Compliant",
                  desc: "Built with enterprise-grade security. All patient data is encrypted at rest and in transit."
                },
                {
                  icon: <FiClock />,
                  title: "Real-time Monitoring",
                  desc: "Immediate feedback and risk recalculation as soon as new clinical data is inputted into the system."
                },
                {
                  icon: <FiActivity />,
                  title: "AI Chat Assistant",
                  desc: "Interact with our specialized medical AI to query patient histories or get quick clinical hypotheses."
                }
              ].map((feature, idx) => (
                <div key={idx} className="relative group bg-slate-50 dark:bg-slate-950 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="inline-flex items-center justify-center p-3 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-xl mb-5">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-950">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
             <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-sm font-semibold text-emerald-600 tracking-wide uppercase">Workflow</h2>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                How Pulse AI Works
              </p>
            </div>

            <div className="relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-cyan-200 via-emerald-200 to-cyan-200 dark:from-cyan-900 dark:via-emerald-900 dark:to-cyan-900"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                {[
                  {
                    step: "01",
                    title: "Input Clinical Data",
                    desc: "Enter patient vitals manually or upload laboratory PDFs for automatic data extraction."
                  },
                  {
                    step: "02",
                    title: "AI Synthesis",
                    desc: "Our models analyze the data points against millions of clinical records to identify patterns."
                  },
                  {
                    step: "03",
                    title: "Actionable Insights",
                    desc: "Receive a comprehensive risk report with prioritized recommendations and care pathways."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="relative text-center">
                    <div className="w-24 h-24 mx-auto bg-white dark:bg-slate-900 border-4 border-slate-50 dark:border-slate-950 shadow-xl rounded-full flex items-center justify-center mb-6 relative z-10 font-black text-3xl text-transparent bg-clip-text bg-gradient-to-br from-cyan-500 to-emerald-500">
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* SOLUTIONS SECTION */}
        <section id="solutions" className="py-24 bg-white dark:bg-slate-900">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="bg-slate-900 dark:bg-slate-950 rounded-3xl overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-10 lg:p-16 flex flex-col justify-center">
                  <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-6">
                    Ready to modernize your clinical workflow?
                  </h2>
                  <p className="text-lg text-slate-300 mb-8">
                    Whether you are a solo practitioner looking for second opinions, or a clinic aiming to standardize risk assessments, Pulse AI scales with you.
                  </p>
                  <ul className="space-y-4 mb-10">
                    {["Reduce diagnostic errors", "Save time on manual chart reviews", "Improve patient outcomes"].map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-slate-300 gap-3">
                        <FiCheckCircle className="text-emerald-400 w-5 h-5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div>
                    <Link
                      to="/signup"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-cyan-500"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-cyan-900/50 to-slate-900 p-10 flex items-center justify-center min-h-[300px]">
                  {/* Abstract Graphic */}
                  <div className="relative w-full max-w-sm">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>
                    <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                       <div className="h-4 w-1/3 bg-white/20 rounded mb-4"></div>
                       <div className="h-4 w-full bg-white/20 rounded mb-4"></div>
                       <div className="h-4 w-2/3 bg-white/20 rounded mb-8"></div>
                       <div className="flex gap-4">
                         <div className="h-10 w-24 bg-cyan-500/50 rounded-lg"></div>
                         <div className="h-10 w-24 bg-white/10 rounded-lg"></div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-24 bg-slate-50 dark:bg-slate-950">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                Everything you need to know about the product and billing.
              </p>
            </div>
            <FAQAccordion />
          </motion.div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-50 dark:bg-slate-950 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <FiActivity className="text-cyan-600 w-6 h-6" />
            <span className="text-xl font-bold text-slate-900 dark:text-white">Pulse AI</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            © {new Date().getFullYear()} Pulse AI Intelligence. All rights reserved. Not intended to replace professional medical advice.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-cyan-600 transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-cyan-600 transition-colors">Terms</a>
            <a href="#" className="text-slate-400 hover:text-cyan-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
