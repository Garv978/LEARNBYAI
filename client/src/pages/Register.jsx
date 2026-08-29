import { useState } from "react";
import { Link } from "react-router-dom";

import { checkPasswordStrength } from "../utils/zxcvbn";
import { getEmailParts } from "../utils/emailUtils";
import { useAuth } from "../context/useAuth";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

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

  const updatePasswordStrength = (passwordValue, nameValue, emailValue) => {
    if (!passwordValue) {
      setStrength(null);
      return;
    }

    setStrength(
      checkPasswordStrength(passwordValue, [
        nameValue,
        emailValue,
        ...getEmailParts(emailValue),
      ])
    );
  };

  const handleNameChange = (e) => {
    const value = e.target.value;

    setName(value);

    updatePasswordStrength(value ? password : "", value, email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;

    setEmail(value);

    updatePasswordStrength(password, name, value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;

    setPassword(value);

    updatePasswordStrength(value, name, email);
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
      const result = await register({
        name,
        email,
        password,
      });

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

          <PasswordStrengthMeter strength={strength} />
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