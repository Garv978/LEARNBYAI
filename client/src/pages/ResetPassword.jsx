import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";

import { checkPasswordStrength } from "../utils/zxcvbn";
import { getEmailParts } from "../utils/emailUtils";
import { resetPassword as resetPasswordAPI } from "../services/AuthServices";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e) => {
    const value = e.target.value;

    setPassword(value);

    if (!value) {
      setStrength(null);
      return;
    }

    setStrength(
      checkPasswordStrength(value, [
        email,
        ...getEmailParts(email),
      ])
    );
  };

  const handleResetResult = (result) => {
    if (result.success) {
      setMessage(
        result.message ||
          "Password reset successful! You can now log in."
      );
      return;
    }

    setError(result.message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await resetPasswordAPI({
        email,
        token,
        newPassword: password,
      });

      handleResetResult(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-2xl px-8 py-10"
      >
        <h1 className="text-gray-900 text-2xl font-semibold text-center">
          Reset Password
        </h1>

        <p className="text-gray-500 text-sm text-center mt-2">
          Enter your new password below
        </p>

        {error && (
          <div className="text-red-500 text-sm mt-4 text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="text-green-600 text-sm mt-4 text-center">
            {message}
          </div>
        )}

        {/* New password */}
        <div className="flex items-center w-full mt-8 border border-gray-300 rounded-lg overflow-hidden px-4 h-12">
          <input
            type="password"
            placeholder="New password"
            className="bg-transparent text-gray-700 placeholder-gray-400 outline-none text-sm w-full h-full"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>

        <PasswordStrengthMeter strength={strength} />

        {/* Confirm password */}
        <div className="flex items-center w-full mt-6 border border-gray-300 rounded-lg overflow-hidden px-4 h-12">
          <input
            type="password"
            placeholder="Confirm password"
            className="bg-transparent text-gray-700 placeholder-gray-400 outline-none text-sm w-full h-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || (strength && strength.score < 3)}
          className="mt-6 w-full h-11 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <p className="text-gray-500 text-sm text-center mt-6">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:underline font-medium"
          >
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;