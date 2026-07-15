import { Link, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const { verifyEmail, resendVerifyEmail } = useAuth();

  const [status, setStatus] = useState("pending"); // pending | success | error
  const [message, setMessage] = useState("");

useEffect(() => {
  const verify = async () => {
    try {
      const result = await verifyEmail({
        verificationToken: token,
        email,
      });

      if (result.success) {
        setStatus("success");
        setMessage("Email verified successfully! You can now log in.");
      } else {
        setStatus("error");
        setMessage(result.message || "Verification failed.");
      }
    } catch (err) {
      setStatus("error");
      setMessage(
        err?.response?.data?.msg ||
          err?.message ||
          "Verification link has expired."
      );
    }
  };

  if (!token || !email) {
    setStatus("error");
    setMessage("Invalid verification link.");
    return;
  }

  verify();
}, [token, email]);

  const handleResend = async () => {
    const result = await resendVerifyEmail({ email });
    setMessage(result.message);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white border border-gray-300/60 rounded-2xl px-8 py-10 text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-indigo-600/20 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-indigo-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l9 6 9-6m-18 8h18V8l-9 6-9-6v8z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-semibold text-gray-900 mt-6">
          Verify Your Email
        </h1>

        <p className="text-gray-600 mt-3">
          {status === "pending" && "Verifying your email..."}
          {status === "success" && message}
          {status === "error" && message}
        </p>

        {status === "error" && (
          <button
            onClick={handleResend}
            className="mt-8 w-full h-11 rounded-full bg-indigo-500 hover:opacity-90 text-white transition"
          >
            Resend Email
          </button>
        )}

        <Link
          to="/login"
          className="block mt-5 text-indigo-500 hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;