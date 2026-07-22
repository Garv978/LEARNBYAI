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
        className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">Sign up</h1>
        <p className="text-gray-500 text-sm mt-2">
          Please create an account to continue
        </p>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        {success && (
          <div className="text-green-600 text-sm mt-2">{success}</div>
        )}

        <div className="flex items-center w-full mt-10 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          {/* Name icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            className="text-gray-400"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="5" /> <path d="M20 21a8 8 0 0 0-16 0" />
          </svg>
          <input
            type="text"
            placeholder="Name"
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            value={name}
            onChange={(e) => {
              const value = e.target.value;
              setName(value);

              if (password) {
                setStrength(checkPasswordStrength(password, [value, email]));
              }
            }}
            required
          />
        </div>

        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          {/* Email icon */}
          <svg
            width="16"
            height="11"
            viewBox="0 0 16 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
              fill="#6B7280"
            />
          </svg>
          <input
            type="email"
            placeholder="Email id"
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            value={email}
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value);

              if (password) {
                setStrength(checkPasswordStrength(password, [name, value]));
              }
            }}
            required
          />
        </div>

        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          {/* Password icon */}
          <svg
            width="13"
            height="17"
            viewBox="0 0 13 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
              fill="#6B7280"
            />
          </svg>
          <input
            type="password"
            placeholder="Password"
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            value={password}
            onChange={(e) => {
              const value = e.target.value;
              setPassword(value);

              if (value) {
                const result = checkPasswordStrength(value, [name, email]);
                setStrength(result);
              } else {
                setStrength(null);
              }
            }}
            required
          />
          {strength && (
            <div className="mt-3">
              {/* Strength label */}
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

              {/* Progress bar */}
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

              {/* Warning */}
              {strength.feedback.warning && (
                <p className="text-red-500 text-xs mt-2">
                  {strength.feedback.warning}
                </p>
              )}

              {/* Suggestions */}
              {strength.feedback.suggestions.length > 0 && (
                <ul className="mt-2 text-xs text-gray-600 list-disc list-inside space-y-1">
                  {strength.feedback.suggestions.map((suggestion) => (
                    <li key={suggestion}>{suggestion}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || (strength && strength.score < 3)}
          className="mt-6 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign up"}
        </button>

        <p className="text-gray-500 text-sm mt-3 mb-11">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
