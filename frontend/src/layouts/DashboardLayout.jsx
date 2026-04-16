import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";

const ROUTE_META = {
  "/dashboard": { title: "Overview" },
  "/dashboard/health-input": { title: "Clinical Profile" },
  "/dashboard/prediction": { title: "Risk Analysis" },
  "/dashboard/results": { title: "Analysis Results" },
  "/dashboard/history": { title: "Patient History" },
  "/dashboard/chat": { title: "AI Assistant" },
};

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  
  let pageTitle = "Pulse AI";
  if (location.pathname.startsWith("/dashboard/report")) {
    pageTitle = "Clinical Report";
  } else {
    pageTitle = ROUTE_META[location.pathname]?.title ?? "Pulse AI";
  }

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="relative z-10 min-h-screen lg:pl-[19rem]">
        <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
          <Navbar
            title={pageTitle}
            onMenuToggle={() => setIsSidebarOpen(true)}
          />

          <main className="mt-6 pb-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
