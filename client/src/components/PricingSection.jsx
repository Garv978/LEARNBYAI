import React from "react";

const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      description:
        "Explore AI Learn with essential study tools at no cost.",
      buttonText: "Start Free",
      popular: false,
      features: [
        "Upload up to 5 PDFs",
        "AI Chat with PDFs",
        "AI Summaries",
        "Basic Flashcards",
        "Basic Quizzes",
        "5 AI requests per day",
      ],
    },
    {
      name: "Pro",
      price: "₹299",
      duration: "/month",
      description:
        "Everything you need for daily AI-powered learning.",
      buttonText: "Get Pro",
      popular: true,
      features: [
        "Unlimited PDF uploads",
        "Unlimited AI Chat",
        "Unlimited Summaries",
        "Unlimited Flashcards",
        "Unlimited Quizzes",
        "Smart AI Notes",
        "OCR for scanned PDFs",
        "Priority document processing",
        "Export notes & flashcards",
      ],
    },
    {
      name: "Premium",
      price: "₹599",
      duration: "/month",
      description:
        "For researchers, professionals, and heavy AI users.",
      buttonText: "Go Premium",
      popular: false,
      features: [
        "Everything in Pro",
        "Priority AI responses",
        "Largest AI context window",
        "Unlimited Cloud Storage",
        "Study Analytics",
        "Priority Support",
        "Early access to new AI features",
        "Future premium tools included",
      ],
    },
  ];

  return (
    <section className="bg-zinc-950 py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center">
          <span className="inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-sm font-medium text-blue-400">
            Pricing
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-white">
            Choose your learning plan
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-zinc-400">
            Start for free and upgrade whenever you need more AI power.
            No hidden charges. Cancel anytime.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-2 ${
                plan.popular
                  ? "border-blue-600 bg-zinc-900 shadow-xl shadow-blue-500/10"
                  : "border-zinc-800 bg-zinc-900/40"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                  ⭐ Most Popular
                </span>
              )}

              <h3 className="text-2xl font-bold text-white">
                {plan.name}
              </h3>

              <p className="mt-3 text-zinc-400">
                {plan.description}
              </p>

              <div className="mt-8 flex items-end gap-2">
                <span className="text-5xl font-bold text-white">
                  {plan.price}
                </span>

                {plan.duration && (
                  <span className="pb-2 text-zinc-400">
                    {plan.duration}
                  </span>
                )}
              </div>

              <button
                className={`mt-8 w-full rounded-xl py-3 font-semibold transition ${
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-zinc-700 text-white hover:bg-zinc-800"
                }`}
              >
                {plan.buttonText}
              </button>

              <div className="mt-8 border-t border-zinc-800 pt-6 space-y-4">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20">
                      <svg
                        className="h-3 w-3 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <span className="text-sm text-zinc-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default PricingSection;