import "./App.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Landing from "./pages/Landing";
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
import PageWrapper from "./component/PageWrapper";

import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<PageWrapper><Dashboard /></PageWrapper>} />
            <Route path="health-input" element={<PageWrapper><HealthInput /></PageWrapper>} />
            <Route path="prediction" element={<PageWrapper><Prediction /></PageWrapper>} />
            <Route path="results" element={<PageWrapper><Results /></PageWrapper>} />
            <Route path="history" element={<PageWrapper><History /></PageWrapper>} />
            <Route path="chat" element={<PageWrapper><ChatAssistant /></PageWrapper>} />
            <Route path="report/:id" element={<PageWrapper><Report /></PageWrapper>} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
