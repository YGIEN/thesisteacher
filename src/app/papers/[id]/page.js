"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function PaperExplanationPage() {
  const params = useParams();
  const [paper, setPaper] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [explaining, setExplaining] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    async function loadPaper() {
      try {
        const res = await fetch(`/api/papers/${params.id}`);
        if (!res.ok) throw new Error("Paper not found");
        const data = await res.json();
        setPaper(data.paper);

        if (data.paper.explanation) {
          setExplanation(data.paper.explanation);
        } else {
          // Auto-trigger explanation
          await triggerExplanation();
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadPaper();
  }, [params.id]);

  async function triggerExplanation() {
    setExplaining(true);
    setError("");

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paperId: params.id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to explain");
      }

      const data = await res.json();
      setExplanation(data.explanation);
    } catch (err) {
      setError(err.message);
    } finally {
      setExplaining(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error && !explanation) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="alert alert-error mb-4">{error}</div>
        <button onClick={triggerExplanation} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary mb-4" />
          <p className="text-base-content/60">
            {explaining
              ? "AI is analyzing your thesis..."
              : "Preparing your explanation..."}
          </p>
        </div>
      </div>
    );
  }

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "concepts", label: "Key Concepts" },
    { id: "sections", label: "Breakdown" },
    { id: "methodology", label: "Methodology" },
    { id: "findings", label: "Findings" },
    { id: "glossary", label: "Glossary" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/dashboard"
          className="text-base-content/60 hover:text-base-content flex items-center gap-2 text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </Link>

        <Link
          href={`/papers/${params.id}/chat`}
          className="btn btn-outline btn-sm gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Ask Questions
        </Link>
      </div>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {explanation.title || paper.title}
        </h1>
        <div className="badge badge-primary">AI Explained</div>
      </div>

      {/* TLDR */}
      {explanation.tldr && (
        <div className="card bg-primary/5 border border-primary/20 mb-8">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="font-bold text-lg">TL;DR</h2>
            </div>
            <p className="text-base-content/80 leading-relaxed text-lg">
              {explanation.tldr}
            </p>
          </div>
        </div>
      )}

      {/* Section Tabs */}
      <div className="tabs tabs-box mb-8 overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`tab tab-sm whitespace-nowrap ${
              activeSection === section.id ? "tab-active" : ""
            }`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview */}
        {activeSection === "overview" && (
          <div className="space-y-6">
            {explanation.overview && (
              <div className="card bg-base-100 border border-base-200">
                <div className="card-body">
                  <h3 className="card-title text-xl mb-2">Overview</h3>
                  <p className="text-base-content/70 leading-relaxed">
                    {explanation.overview}
                  </p>
                </div>
              </div>
            )}
            {explanation.whyItMatters && (
              <div className="card bg-secondary/5 border border-secondary/20">
                <div className="card-body">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-secondary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                    <h3 className="font-bold text-lg">Why It Matters</h3>
                  </div>
                  <p className="text-base-content/70 leading-relaxed">
                    {explanation.whyItMatters}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Key Concepts */}
        {activeSection === "concepts" && (
          <div className="space-y-4">
            {explanation.keyConcepts?.map((concept, index) => (
              <div
                key={index}
                className="collapse collapse-arrow bg-base-100 border border-base-200"
              >
                <input type="checkbox" defaultChecked={index === 0} />
                <div className="collapse-title text-xl font-semibold">
                  {concept.term}
                </div>
                <div className="collapse-content space-y-3">
                  <p className="text-base-content/70">
                    {concept.simpleExplanation}
                  </p>
                  {concept.analogy && (
                    <div className="alert bg-warning/10 border border-warning/20 text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                      <span>
                        <strong>Think of it like:</strong> {concept.analogy}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Breakdown */}
        {activeSection === "sections" && (
          <div className="space-y-4">
            {explanation.sections?.map((section, index) => (
              <div
                key={index}
                className="card bg-base-100 border border-base-200"
              >
                <div className="card-body">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="badge badge-primary badge-sm">
                      Part {index + 1}
                    </div>
                    <h3 className="card-title text-lg">{section.heading}</h3>
                  </div>
                  <p className="text-base-content/70 leading-relaxed">
                    {section.content}
                  </p>
                  {section.keyTakeaway && (
                    <div className="mt-3 p-3 bg-base-200 rounded-lg">
                      <p className="text-sm font-medium">
                        <span className="text-primary">Key Takeaway:</span>{" "}
                        {section.keyTakeaway}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Methodology */}
        {activeSection === "methodology" && (
          <div className="card bg-base-100 border border-base-200">
            <div className="card-body space-y-4">
              <h3 className="card-title text-xl">
                {explanation.methodology?.approach || "Methodology"}
              </h3>
              <p className="text-base-content/70 leading-relaxed">
                {explanation.methodology?.simplified ||
                  explanation.methodology?.approach}
              </p>
            </div>
          </div>
        )}

        {/* Findings */}
        {activeSection === "findings" && (
          <div className="space-y-4">
            {explanation.findings?.map((item, index) => (
              <div
                key={index}
                className="card bg-base-100 border border-base-200"
              >
                <div className="card-body">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-success"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-lg">
                        {item.finding}
                      </p>
                      {item.significance && (
                        <p className="text-base-content/60 text-sm mt-1">
                          {item.significance}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Glossary */}
        {activeSection === "glossary" && (
          <div className="card bg-base-100 border border-base-200">
            <div className="card-body">
              <h3 className="card-title text-xl mb-4">Glossary of Terms</h3>
              <div className="space-y-3">
                {explanation.glossary?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                  >
                    <div className="badge badge-ghost badge-sm mt-0.5 shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{item.term}</p>
                      <p className="text-sm text-base-content/60">
                        {item.definition}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <Link
          href={`/papers/${params.id}/chat`}
          className="btn btn-primary btn-lg text-white gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Ask Follow-up Questions
        </Link>
      </div>
    </div>
  );
}