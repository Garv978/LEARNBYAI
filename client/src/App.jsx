import "./App.css";
import "./utils/zxcvbn";

import { Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
// PDF workspace pages
import Chat from "./pages/pdf/Chat";
import Dashboard from "./pages/Dashboard";
import Flashcards from "./pages/pdf/Flashcards";
import ForgotPassword from "./pages/ForgotPassword";
// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Notes from "./pages/pdf/Notes";
import PdfLayout from "./layouts/PdfLayout";
import PdfList from "./pages/PdfList";
import ProtectedRoute from "./utils/ProtectedRoute";
import Quiz from "./pages/pdf/Quiz";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Summary from "./pages/pdf/Summary";
import UserLayout from "./layouts/UserLayout";
import VerifyEmail from "./pages/VerifyEmail";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/test" element={<h1>TEST PAGE</h1>} />

        {/* Protected user routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pdfs" element={<PdfList />} />

          {/* PDF workspace */}
          <Route path="pdfs/:pdfId" element={<PdfLayout />}>
            <Route path="chat" element={<Chat />} />
            <Route path="flashcards" element={<Flashcards />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="summary" element={<Summary />} />
            <Route path="notes" element={<Notes />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
