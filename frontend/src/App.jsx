import "./App.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import HealthInput from "./pages/HealthInput";
import Prediction from "./pages/Prediction";
import Results from "./pages/Result";
import History from "./pages/History";
import ChatAssistant from "./pages/ChatAssistant";
import Report from "./pages/Report";
import { ProtectedRoute, PublicRoute } from "./component/RouteGuards";

import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="health-input" element={<HealthInput />} />
            <Route path="prediction" element={<Prediction />} />
            <Route path="results" element={<Results />} />
            <Route path="history" element={<History />} />
            <Route path="chat" element={<ChatAssistant />} />
            <Route path="report/:id" element={<Report />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
