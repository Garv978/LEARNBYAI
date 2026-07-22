import React, { useState } from "react";

import { Link } from "react-router-dom";
import { checkPasswordStrength } from "../utils/zxcvbn";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(null);

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await register({ name, email, password });

      if (result.success) {
        setSuccess(
          "Registration successful! Please check your email to verify your account.",
        );
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Register error:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.msg ||
          err.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full text-center border border-gray-300 rounded-2xl px-8 py-6 bg-white shadow-lg"
      >
        <h1 className="text-gray-900 text-3xl font-semibold">Sign up</h1>
        <p className="text-gray-500 text-sm mt-2">
          Please create an account to continue
        </p>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        {success && (
          <div className="text-green-600 text-sm mt-2">{success}</div>
        )}

        {/* Name */}
        <div className="flex items-center w-full mt-6 border border-gray-300 h-12 rounded-full pl-6 gap-2">
          <input
            type="text"
            placeholder="Name"
            className="bg-transparent text-gray-700 placeholder-gray-400 outline-none text-sm w-full h-full"
            value={name}
            onChange={(e) => {
              const value = e.target.value;
              setName(value);
              const emailParts = email
                .toLowerCase()
                .split(/[@._-]+/)
                .filter(Boolean);
              if (password)
                setStrength(
                  checkPasswordStrength(password, [
                    value,
                    email,
                    ...emailParts,
                  ]),
                );
            }}
            required
          />
        </div>

        {/* Email */}
        <div className="flex items-center mt-4 w-full border border-gray-300 h-12 rounded-full pl-6 gap-2">
          <input
            type="email"
            placeholder="Email id"
            className="bg-transparent text-gray-700 placeholder-gray-400 outline-none text-sm w-full h-full"
            value={email}
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value);
              const emailParts = value
                .toLowerCase()
                .split(/[@._-]+/)
                .filter(Boolean);
              if (password)
                setStrength(
                  checkPasswordStrength(password, [name, value, ...emailParts]),
                );
            }}
            required
          />
        </div>

        {/* Password */}
        <div className="flex flex-col mt-4 w-full">
          <div className="flex items-center border border-gray-300 h-12 rounded-full pl-6 gap-2">
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent text-gray-700 placeholder-gray-400 outline-none text-sm w-full h-full"
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                const emailParts = email
                  .toLowerCase()
                  .split(/[@._-]+/)
                  .filter(Boolean);
                setStrength(
                  value ? checkPasswordStrength(value, [name, email,...emailParts]) : null,
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
                  {
                    ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"][
                      strength.score
                    ]
                  }
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
                <p className="text-red-500 text-xs mt-2">
                  {strength.feedback.warning}
                </p>
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
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || (strength && strength.score < 3)}
          className="mt-6 w-full h-11 rounded-full text-white bg-indigo-500 hover:bg-indigo-600 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign up"}
        </button>

        <p className="text-gray-500 text-sm mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
