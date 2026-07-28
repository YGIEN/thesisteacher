import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="hero py-20 md:py-32 bg-gradient-to-b from-base-100 to-base-200">
        <div className="hero-content text-center flex-col max-w-4xl">
          <div className="badge badge-primary badge-lg mb-4 font-medium">
            AI-Powered Thesis Breakdown
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Turn Complex Thesis
            <br />
            <span className="text-primary">into Easy Understanding</span>
          </h1>
          <p className="text-xl md:text-2xl text-base-content/70 max-w-2xl mt-6 leading-relaxed">
            Upload your thesis paper and let AI break it down into simple,
            engaging explanations. No jargon. No confusion. Just clear learning.
          </p>
          <div className="flex gap-4 mt-8">
            {session ? (
              <Link href="/dashboard" className="btn btn-primary btn-lg text-white">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="btn btn-primary btn-lg text-white"
                >
                  Get Started Free
                </Link>
                <Link href="/login" className="btn btn-outline btn-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="card-body items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="card-title text-xl">Upload or Paste</h3>
              <p className="text-base-content/70">
                Upload a PDF or paste your thesis text directly. We support both
                methods for your convenience.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="card-body items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="card-title text-xl">AI Explains Simply</h3>
              <p className="text-base-content/70">
                Our AI breaks down your thesis into digestible concepts,
                analogies, and clear explanations.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="card-body items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-accent"
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
              </div>
              <h3 className="card-title text-xl">Ask Questions</h3>
              <p className="text-base-content/70">
                Have follow-up questions? Chat with the AI to dive deeper into
                any concept.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-content">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Understand Your Thesis?
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Join thousands of students who use Thesisteacher to make sense of
            complex academic papers.
          </p>
          {session ? (
            <Link href="/dashboard" className="btn btn-lg bg-white text-primary hover:bg-gray-100">
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/register"
              className="btn btn-lg bg-white text-primary hover:bg-gray-100"
            >
              Get Started Free
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer sm:footer-horizontal footer-center p-8 bg-base-200 text-base-content/60">
        <p>© 2026 Thesisteacher. Making academic papers accessible to everyone.</p>
      </footer>
    </div>
  );
}