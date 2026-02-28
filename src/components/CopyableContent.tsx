"use client";

import { useEffect, useRef } from "react";

interface Props {
  html: string;
  className?: string;
}

export default function CopyableContent({ html, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const codeBlocks = container.querySelectorAll("pre");

    codeBlocks.forEach((pre) => {
      // Skip if already has a copy button
      if (pre.querySelector(".copy-btn")) return;

      // Wrap in a relative container
      const wrapper = document.createElement("div");
      wrapper.className = "code-block-wrapper";
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      // Add copy button
      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.textContent = "Copy";
      btn.setAttribute("type", "button");
      btn.addEventListener("click", () => {
        const code = pre.querySelector("code");
        const text = (code || pre).textContent || "";
        navigator.clipboard.writeText(text.trim()).then(() => {
          btn.textContent = "Copied!";
          setTimeout(() => {
            btn.textContent = "Copy";
          }, 2000);
        });
      });
      wrapper.appendChild(btn);
    });
  }, [html]);

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
