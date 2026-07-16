import { FaBookOpen, FaClipboardList, FaFilePdf, FaLightbulb, FaRobot } from "react-icons/fa";

import React from "react";

const features = [
  {
    icon: <FaFilePdf size={28} className="text-blue-500" />,
    title: "Upload PDFs",
    description: "Easily upload and manage your PDFs in a secure, modern dashboard.",
  },
  {
    icon: <FaRobot size={28} className="text-blue-500" />,
    title: "AI-Powered Chat",
    description: "Ask questions and interact with your documents using AI-driven chat.",
  },
  {
    icon: <FaBookOpen size={28} className="text-blue-500" />,
    title: "Smart Summaries",
    description: "Get concise summaries of long documents to save time and effort.",
  },
  {
    icon: <FaClipboardList size={28} className="text-blue-500" />,
    title: "Quizzes & Flashcards",
    description: "Turn your PDFs into interactive quizzes and flashcards for learning.",
  },
  {
    icon: <FaLightbulb size={28} className="text-blue-500" />,
    title: "Insights & Notes",
    description: "Generate smart notes and insights to enhance your study sessions.",
  },
];

const Features = () => {
  return (
    <section className="bg-zinc-950 py-20 px-6">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Powerful Features for Smarter Learning
        </h2>
        <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
          Explore the tools that make studying with your PDFs faster, easier, and more interactive.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-left hover:border-blue-600 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                {feature.icon}
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
