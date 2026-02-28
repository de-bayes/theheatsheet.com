"use client";

import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "heatsheet2026";
const SESSION_KEY = "ths-admin-auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setAuthed(true);
    }
    setChecking(false);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
      setInput("");
    }
  }

  if (checking) {
    return null;
  }

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto mt-24">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin</h1>
        <form onSubmit={handleSubmit}>
          <label className="block text-xs uppercase tracking-widest text-meta-gray mb-1">
            Password
          </label>
          <input
            type="password"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(false);
            }}
            className="w-full px-3 py-2 bg-cream border border-charcoal/15 rounded text-charcoal focus:outline-none focus:border-charcoal/40 transition-colors font-serif"
            placeholder="Enter admin password"
            autoFocus
          />
          {error && (
            <p className="text-sm text-brand-red mt-2">Wrong password.</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full px-4 py-2 bg-charcoal text-cream rounded hover:bg-charcoal/80 transition-colors cursor-pointer"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
