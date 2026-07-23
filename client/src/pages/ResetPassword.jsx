import { Link, useSearchParams } from "react-router-dom";
import React, { useState } from "react";

import { checkPasswordStrength } from "../utils/zxcvbn"; // ✅ import zxcvbn wrapper
import { resetPassword as resetPasswordAPI } from "../services/AuthServices";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // ✅ new state
  const [strength, setStrength] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const result = await resetPasswordAPI({ email, token, newPassword: password });
      console.log(result);
      if (result.success) {
        setMessage(result.message || "Password reset successful! You can now log in.");
      } else {
        setError(result.message);
      }
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

        {error && <div className="text-red-500 text-sm mt-4 text-center">{error}</div>}
        {message && <div className="text-green-600 text-sm mt-4 text-center">{message}</div>}

        {/* New password */}
        <div className="flex items-center w-full mt-8 border border-gray-300 rounded-lg overflow-hidden px-4 h-12">
          <input
            type="password"
            placeholder="New password"
            className="bg-transparent text-gray-700 placeholder-gray-400 outline-none text-sm w-full h-full"
            value={password}
            onChange={(e) => {
              const value = e.target.value;
              setPassword(value);
              const emailParts = email?.toLowerCase().split(/[@._-]+/).filter(Boolean) || [];
              setStrength(
                value ? checkPasswordStrength(value, [email, ...emailParts]) : null
              );
            }}
            required
          />
        </div>

        {/* Strength meter */}
        {strength && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Password Strength</span>
              <span
                className={
                  strength.score === 0
                    ? "text-red-600"
                    : strength.score === 1
                    ? "text-orange-500"
                    : strength.score === 2
                    ? "text-yellow-500"
                    : strength.score === 3
                    ? "text-blue-600"
                    : "text-green-600"
                }
              >
                {["Very Weak", "Weak", "Fair", "Strong", "Very Strong"][strength.score]}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  strength.score === 0
                    ? "w-1/5 bg-red-600"
                    : strength.score === 1
                    ? "w-2/5 bg-orange-500"
                    : strength.score === 2
                    ? "w-3/5 bg-yellow-500"
                    : strength.score === 3
                    ? "w-4/5 bg-blue-600"
                    : "w-full bg-green-600"
                }`}
              />
            </div>
            {strength.feedback?.warning && (
              <p className="text-red-500 text-xs mt-2">{strength.feedback.warning}</p>
            )}
            {strength.feedback?.suggestions?.length > 0 && (
              <ul className="mt-2 text-xs text-gray-600 list-disc list-inside space-y-1">
                {strength.feedback.suggestions.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            )}
          </div>
        )}

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
          <Link to="/login" className="text-indigo-600 hover:underline font-medium">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
