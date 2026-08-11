import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import EmailSignup from "./pages/EmailSignUp";
import Home from "./pages/Home";
import MedicalProfile from "./pages/MedicalProfile";
import UploadReports from "./pages/UploadReports";
import MedicalHistory from "./pages/MedicalHistory";
import ConsultDoctor from "./pages/ConsultDoctor";
import Profile from "./pages/Profile";
import ReportSummary from "./pages/ReportSummary";
import CreatePassword from "./pages/CreatePassword";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>

      {/* Public Routes */}

      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/email-signup"
        element={<EmailSignup />}
      />

      {/* Signup completion - MUST remain public */}
      <Route
        path="/create-password"
        element={<CreatePassword />}
      />


      {/* Protected Routes */}

      <Route
        path="/medical-profile"
        element={
          <ProtectedRoute>
            <MedicalProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload-reports"
        element={
          <ProtectedRoute>
            <UploadReports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/medical-history"
        element={
          <ProtectedRoute>
            <MedicalHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/consult-doctor"
        element={
          <ProtectedRoute>
            <ConsultDoctor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/report-summary"
        element={
          <ProtectedRoute>
            <ReportSummary />
          </ProtectedRoute>
        }
      />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}