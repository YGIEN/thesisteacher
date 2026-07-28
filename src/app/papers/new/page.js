"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewPaperPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputMode, setInputMode] = useState("paste"); // "paste" | "upload"

  async function extractTextFromPDF(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/extract-pdf", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to extract text from PDF");
    }

    const data = await res.json();
    return data.text;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let paperContent = content;

      if (inputMode === "upload" && file) {
        paperContent = await extractTextFromPDF(file);
      }

      if (!title.trim() || !paperContent.trim()) {
        setError("Title and content are required");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/papers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: paperContent.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create paper");
        setLoading(false);
        return;
      }

      // Navigate to the explanation page
      router.push(`/papers/${data.paper._id}`);
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  }

  async function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      // Auto-extract title from filename
      if (!title) {
        setTitle(selectedFile.name.replace(/\.pdf$/i, ""));
      }
    } else {
      setError("Please select a PDF file");
      setFile(null);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-base-content/60 hover:text-base-content flex items-center gap-2 text-sm mb-4"
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
        <h1 className="text-3xl font-bold">Upload Thesis</h1>
        <p className="text-base-content/60 mt-1">
          Paste your thesis text or upload a PDF file
        </p>
      </div>

      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body p-6">
          {/* Input Mode Toggle */}
          <div className="tabs tabs-box mb-6">
            <button
              className={`tab tab-lg flex-1 ${inputMode === "paste" ? "tab-active" : ""}`}
              onClick={() => setInputMode("paste")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Paste Text
            </button>
            <button
              className={`tab tab-lg flex-1 ${inputMode === "upload" ? "tab-active" : ""}`}
              onClick={() => setInputMode("upload")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Upload PDF
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Thesis Title</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Machine Learning Applications in Healthcare"
                className="input input-bordered"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {inputMode === "paste" ? (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Thesis Content
                  </span>
                </label>
                <textarea
                  placeholder="Paste your thesis paper content here..."
                  className="textarea textarea-bordered min-h-[400px] font-mono text-sm leading-relaxed"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required={inputMode === "paste"}
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/40">
                    Paste the full text of your thesis paper
                  </span>
                </label>
              </div>
            ) : (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">PDF File</span>
                </label>
                <div className="border-2 border-dashed border-base-300 rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                  {file ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <div className="text-left">
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-base-content/40">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => setFile(null)}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-base-content/30 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-base-content/60 mb-1">
                        Click to upload a PDF
                      </p>
                      <p className="text-sm text-base-content/30">
                        or drag and drop
                      </p>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-error text-sm py-2">{error}</div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full text-white"
              disabled={loading || (inputMode === "upload" && !file)}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Processing...
                </>
              ) : (
                "Analyze Thesis"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}