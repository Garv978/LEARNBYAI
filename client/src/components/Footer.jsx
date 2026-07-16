import { FaBrain, FaEnvelope, FaExternalLinkAlt, FaGithub, FaLinkedin } from "react-icons/fa";

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid gap-12 md:grid-cols-3">

          {/* Logo + Description */}
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl">
                <FaBrain size={22} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                AI<span className="text-blue-500">Learn</span>
              </h2>
            </div>

            <p className="mt-5 text-zinc-400 leading-7 max-w-sm">
              Transform your PDFs into interactive learning experiences with
              AI-powered chat, summaries, flashcards, quizzes, and smart notes.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-lg">Quick Links</h3>
            <div className="mt-5 flex flex-col gap-3">
              <a href="/" className="text-zinc-400 hover:text-blue-500 transition">Home</a>
              <a href="#features" className="text-zinc-400 hover:text-blue-500 transition">Features</a>
              <a href="#pricing" className="text-zinc-400 hover:text-blue-500 transition">Pricing</a>
              <a href="#contact" className="text-zinc-400 hover:text-blue-500 transition">Contact</a>
            </div>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-white font-semibold text-lg">Connect With Me</h3>
            <div className="mt-5 space-y-4">

              {/* GitHub */}
              <a
                href="https://github.com/Garv978"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-zinc-800 p-4 text-zinc-300 hover:border-blue-600 hover:bg-zinc-900 transition-all"
              >
                <div className="flex items-center gap-3">
                  <FaGithub size={22} />
                  <span>GitHub</span>
                </div>
                <FaExternalLinkAlt size={18} />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/garv-tayal-b34740322/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-zinc-800 p-4 text-zinc-300 hover:border-[#0A66C2] hover:bg-zinc-900 transition-all"
              >
                <div className="flex items-center gap-3">
                  <FaLinkedin size={22} />
                  <span>LinkedIn</span>
                </div>
                <FaExternalLinkAlt size={18} />
              </a>

              {/* Email */}
              <a
                href="mailto:your-email@example.com"
                className="flex items-center justify-between rounded-xl border border-zinc-800 p-4 text-zinc-300 hover:border-green-500 hover:bg-zinc-900 transition-all"
              >
                <div className="flex items-center gap-3">
                  <FaEnvelope size={22} />
                  <span>Email</span>
                </div>
                <FaExternalLinkAlt size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} AI Learn. All rights reserved.
          </p>
          <p className="text-zinc-500 text-sm">
            Designed & Developed by{" "}
            <span className="text-white font-medium">Garv Tayal</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
