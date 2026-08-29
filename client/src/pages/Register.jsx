import { useState } from "react";

import { Link } from "react-router-dom";
import { checkPasswordStrength } from "../utils/zxcvbn";
import { useAuth } from "../context/useAuth";

const getEmailParts = (value = "") =>
  value.toLowerCase().split(/[@._-]+/).filter(Boolean);

const getStrengthTextClass = (score) => {
  if (score === 0) return "text-red-600";
  if (score === 1) return "text-orange-500";
  if (score === 2) return "text-yellow-500";
  if (score === 3) return "text-blue-600";

  return "text-green-600";
};

const getStrengthBarClass = (score) => {
  if (score === 0) return "w-1/5 bg-red-600";
  if (score === 1) return "w-2/5 bg-orange-500";
  if (score === 2) return "w-3/5 bg-yellow-500";
  if (score === 3) return "w-4/5 bg-blue-600";

  return "w-full bg-green-600";
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(null);
  const [showVerifyLink, setShowVerifyLink] = useState(false);
  const { register } = useAuth();

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);

    if (!password) return;

    setStrength(
      checkPasswordStrength(password, [
        value,
        email,
        ...getEmailParts(email),
      ])
    );
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!password) return;

    setStrength(
      checkPasswordStrength(password, [
        name,
        value,
        ...getEmailParts(value),
      ])
    );
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    setStrength(
      value
        ? checkPasswordStrength(value, [
            name,
            email,
            ...getEmailParts(email),
          ])
        : null
    );
  };

  const handleRegistrationResult = (result) => {
    if (result.success) {
      setSuccess(
        "Registration successful! Please check your email to verify your account."
      );
      return;
    }

    setError(result.message);
    setShowVerifyLink(result.canResendVerification);
  };

  const handleRegistrationError = (err) => {
    console.error("Register error:", err);

    const data = err.response?.data;

    setError(data?.message || "Something went wrong");

    if (data?.canResendVerification) {
      setShowVerifyLink(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setShowVerifyLink(false);
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await register({ name, email, password });
      handleRegistrationResult(result);
    } catch (err) {
      handleRegistrationError(err);
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
        <h1 className="text-gray-900 text-3xl font-semibold">
          Sign up
        </h1>

        <p className="text-gray-500 text-sm mt-2">
          Please create an account to continue
        </p>

        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-600 text-sm mt-2">
            {success}
          </div>
        )}

        {/* Name */}
        <div className="flex items-center w-full mt-6 border border-gray-300 h-12 rounded-full pl-6 gap-2">
          <input
            type="text"
            placeholder="Name"
            className="bg-transparent text-gray-700 placeholder-gray-400 outline-none text-sm w-full h-full"
            value={name}
            onChange={handleNameChange}
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
            onChange={handleEmailChange}
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
              onChange={handlePasswordChange}
              required
            />
          </div>

          {/* Strength meter */}
          {strength && (
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Password Strength</span>

                <span className={getStrengthTextClass(strength.score)}>
                  {
                    ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"][
                      strength.score
                    ]
                  }
                </span>
              </div>

              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getStrengthBarClass(
                    strength.score
                  )}`}
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
          <Link
            to="/login"
            className="text-indigo-500 hover:underline"
          >
            Login
          </Link>
        </p>

        {showVerifyLink && (
          <div className="mt-3 text-sm">
            <Link
              to={`/verify-email?email=${encodeURIComponent(email)}`}
              className="text-indigo-600 hover:underline"
            >
              Go to email verification page
            </Link>
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;