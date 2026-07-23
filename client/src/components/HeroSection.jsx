import React from "react";

const HeroSection = () => {
  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
          * { font-family: "Geist", sans-serif; }
        `}
      </style>

      <section className="relative bg-zinc-950 lg:grid lg:h-screen lg:place-content-center overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-size-[20px_20px] opacity-20 pointer-events-none"></div>

        <div className="relative mx-auto w-screen max-w-7xl px-6 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-sm font-medium text-blue-400">
              AI-Powered Learning Platform
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Learn Smarter with
              <span className="text-blue-500"> AI Learn</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-zinc-400">
              Upload your PDFs and let AI transform them into interactive
              conversations, concise summaries, flashcards, quizzes, and
              organized notes—everything you need to study faster and retain
              more.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/register"
                className="inline-block rounded-md border border-blue-600 bg-blue-600 px-6 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700"
              >
                Get Started
              </a>

              <a
                href="#features"
                className="inline-block rounded-md border border-zinc-700 px-6 py-3 font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              >
                Explore Features
              </a>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;