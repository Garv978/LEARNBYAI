import React, { useState } from "react";

import { submitFeedback } from "../services/FeedbackServices"; // <-- Axios functions

const Feedback = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    try {
      await submitFeedback(form);
      setStatus("✅ Feedback submitted successfully!");
      setForm({ firstName: "", lastName: "", email: "", message: "" });
    } catch (err) {
      setStatus("❌ Failed to submit feedback.");
      console.error(err);
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
          * { font-family: "Geist", sans-serif; }
        `}
      </style>
      <div className="w-full py-20 px-6 flex items-center justify-center bg-zinc-950">
        <div className="w-full max-w-280 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          
          {/* Left Side */}
          <div className="flex flex-col justify-start pt-1">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="size-2 rounded-full bg-orange-500"></div>
              <span className="text-zinc-400 font-medium text-sm tracking-wide">CONTACT</span>
            </div>
            <h1 className="text-4xl font-medium text-white mb-3 sm:mb-5">
              Let’s Start a Conversation
            </h1>
            <p className="text-base text-zinc-400 leading-relaxed max-w-105">
              Have a question or need help? Reach out and our team will get back to you as soon as possible.
            </p>
          </div>

          {/* Right Side */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2.5">
                <label className="text-zinc-400 text-sm">First Name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  type="text"
                  placeholder="John"
                  className="w-full px-3.5 py-2.5 rounded-md bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-zinc-400 text-sm">Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  type="text"
                  placeholder="Doe"
                  className="w-full px-3.5 py-2.5 rounded-md bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2.5">
              <label className="text-zinc-400 text-sm">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="john@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-md bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="text-zinc-400 text-sm">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Hi, I'd like to know more about your services..."
                rows="6"
                className="w-full px-3.5 py-3 rounded-md bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-zinc-500 transition-colors resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full mt-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 rounded-md transition-colors cursor-pointer"
            >
              Submit
            </button>

            {status && (
              <p className="text-sm mt-2 text-center text-zinc-400">{status}</p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Feedback;
