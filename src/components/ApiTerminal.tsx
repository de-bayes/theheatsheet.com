"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const PROMPT = "~ $";

const SUGGESTIONS = [
  { label: "Senate", cmd: 'curl "/api/grades?chamber=senate&format=table"' },
  { label: "House", cmd: 'curl "/api/grades?chamber=house&format=table"' },
  { label: "Iowa", cmd: 'curl "/api/grades?state=IA&format=table"' },
  { label: "Single race", cmd: 'curl "/api/grades?race=S2026IA02&format=table"' },
  { label: "A-graded", cmd: 'curl "/api/grades?grade=A&format=table"' },
  { label: "JSON", cmd: 'curl "/api/grades?chamber=senate"' },
];

interface HistoryEntry {
  command: string;
  output: string;
  isError?: boolean;
}

export default function ApiTerminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      command: "",
      output:
        "The Heat Sheet — Market Grades API\nType a curl command or click a suggestion below.\n",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdIndex, setCmdIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, loading]);

  const runCommand = useCallback(
    async (cmd: string) => {
      if (loading) return;
      const trimmed = cmd.trim();
      if (!trimmed) return;

      setCmdHistory((prev) => [...prev, trimmed]);
      setCmdIndex(-1);
      setInput("");

      // Parse the curl command to extract the path
      const curlMatch = trimmed.match(
        /^curl\s+["']?\/?(.+?)["']?\s*$/i
      );

      if (!curlMatch) {
        setHistory((prev) => [
          ...prev,
          {
            command: trimmed,
            output: `command not found: ${trimmed.split(" ")[0]}\nTry: curl /api/grades`,
            isError: true,
          },
        ]);
        return;
      }

      let apiPath = curlMatch[1];
      // Ensure it starts with api/grades
      if (!apiPath.startsWith("api/") && !apiPath.startsWith("/api/")) {
        apiPath = `api/grades${apiPath.startsWith("?") ? apiPath : "?" + apiPath}`;
      }
      if (apiPath.startsWith("/")) apiPath = apiPath.slice(1);

      setLoading(true);
      setHistory((prev) => [...prev, { command: trimmed, output: "" }]);

      try {
        const res = await fetch(`/${apiPath}`);
        const contentType = res.headers.get("content-type") || "";
        let formatted: string;

        if (contentType.includes("text/plain")) {
          formatted = await res.text();
        } else {
          const data = await res.json();
          formatted = JSON.stringify(data, null, 2);
        }

        setHistory((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            command: trimmed,
            output: formatted,
            isError: !res.ok,
          };
          return copy;
        });
      } catch {
        setHistory((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            command: trimmed,
            output: "curl: (7) Failed to connect",
            isError: true,
          };
          return copy;
        });
      }

      setLoading(false);
    },
    [loading]
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      runCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const newIdx =
          cmdIndex === -1 ? cmdHistory.length - 1 : Math.max(0, cmdIndex - 1);
        setCmdIndex(newIdx);
        setInput(cmdHistory[newIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cmdIndex >= 0) {
        const newIdx = cmdIndex + 1;
        if (newIdx >= cmdHistory.length) {
          setCmdIndex(-1);
          setInput("");
        } else {
          setCmdIndex(newIdx);
          setInput(cmdHistory[newIdx]);
        }
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-2xl border border-white/10">
      {/* Title bar */}
      <div className="bg-[#2d2d2d] px-4 py-2.5 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-[#9d9d9d] text-xs font-mono ml-2 flex-1 text-center">
          Terminal — theheatsheet.com
        </span>
        <div className="w-[54px]" /> {/* balance the dots */}
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="bg-[#1e1e1e] p-4 font-mono text-sm overflow-y-auto cursor-text"
        style={{ maxHeight: "420px", minHeight: "280px" }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* History */}
        {history.map((entry, i) => (
          <div key={i} className="mb-3">
            {entry.command && (
              <div className="flex gap-2">
                <span className="text-[#28c840] shrink-0 select-none">
                  {PROMPT}
                </span>
                <span className="text-[#e0e0e0]">{entry.command}</span>
              </div>
            )}
            {entry.output && (
              <pre
                className={`mt-1 whitespace-pre-wrap break-words text-xs leading-relaxed ${
                  entry.isError ? "text-[#ff5f57]" : "text-[#c8c8c8]"
                }`}
              >
                {entry.output}
              </pre>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="text-[#9d9d9d] text-xs animate-pulse">
            fetching...
          </div>
        )}

        {/* Input line */}
        {!loading && (
          <div className="flex gap-2 items-center">
            <span className="text-[#28c840] shrink-0 select-none">
              {PROMPT}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-[#e0e0e0] outline-none border-none caret-[#28c840] font-mono text-sm p-0"
              spellCheck={false}
              autoComplete="off"
              placeholder="curl /api/grades"
            />
          </div>
        )}
      </div>

      {/* Suggestion chips */}
      <div className="bg-[#252525] px-4 py-2.5 flex flex-wrap gap-1.5 border-t border-white/5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            onClick={() => runCommand(s.cmd)}
            disabled={loading}
            className="px-2.5 py-1 text-xs font-mono text-[#9d9d9d] bg-[#333] rounded hover:bg-[#444] hover:text-white transition-colors disabled:opacity-40 cursor-pointer border border-white/5"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
