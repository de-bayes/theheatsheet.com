"use client";

import { useState } from "react";

export default function Logo() {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className="font-logo text-3xl md:text-4xl font-light text-charcoal select-none inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="relative inline-flex items-baseline">
        <span aria-hidden="true">{"{"}</span>
        <span className="relative inline-block overflow-hidden transition-[width] duration-300 ease-in-out align-baseline"
          style={{ width: hovered ? "11ch" : "3ch" }}
        >
          <span
            className="inline-block transition-opacity duration-200 ease-in-out whitespace-nowrap"
            style={{ opacity: hovered ? 0 : 1 }}
          >
            THS
          </span>
          <span
            className="absolute left-0 top-0 inline-block transition-opacity duration-200 ease-in-out whitespace-nowrap"
            style={{ opacity: hovered ? 1 : 0, transitionDelay: hovered ? "100ms" : "0ms" }}
          >
            The Heat Sheet
          </span>
        </span>
        <span aria-hidden="true">{"}"}</span>
      </span>
    </span>
  );
}
