"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ChatPage() {
  const params = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [paperTitle, setPaperTitle] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function loadPaper() {
      try {
        const res = await fetch(`/api/papers/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setPaperTitle(data.paper.title);
        }
      } catch {}
    }

    loadPaper();
  }, [params.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paperId: params.id,
          message: userMessage.content,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to get response");
      }

      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`/papers/${params.id}`}
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
          Back to Explanation
        </Link>
        <h2 className="text-sm font-medium truncate max-w-[300px]">
          {paperTitle}
        </h2>
      </div>

      <h1 className="text-2xl font-bold mb-2">Ask About Your Thesis</h1>
      <p className="text-base-content/60 mb-8">
        Ask questions about concepts, methodology, findings, or anything you
        don't understand
      </p>

      {/* Chat Messages */}
      <div className="card bg-base-100 border border-base-200 mb-4">
        <div className="card-body p-0">
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-base-content/40">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto mb-4 opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="text-lg font-medium mb-1">
                    Start a conversation
                  </p>
                  <p className="text-sm">
                    Ask anything about this thesis paper
                  </p>
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-image avatar">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      msg.role === "user"
                        ? "bg-primary text-primary-content"
                        : "bg-secondary text-secondary-content"
                    }`}
                  >
                    {msg.role === "user" ? "U" : "AI"}
                  </div>
                </div>
                <div
                  className={`chat-bubble max-w-[80%] ${
                    msg.role === "user"
                      ? "chat-bubble-primary"
                      : "chat-bubble-ghost"
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat chat-start">
                <div className="chat-image avatar">
                  <div className="w-10 h-10 rounded-full bg-secondary text-secondary-content flex items-center justify-center text-sm font-bold">
                    AI
                  </div>
                </div>
                <div className="chat-bubble chat-bubble-ghost">
                  <span className="loading loading-dots loading-sm" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          placeholder="Type your question here..."
          className="input input-bordered flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="btn btn-primary text-white"
          disabled={loading || !input.trim()}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
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
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}