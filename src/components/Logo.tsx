"use client";

import { useState, useRef, useEffect } from "react";

export default function Logo() {
  const [hovered, setHovered] = useState(false);
  const collapsedRef = useRef<HTMLSpanElement>(null);
  const expandedRef = useRef<HTMLSpanElement>(null);
  const [collapsedWidth, setCollapsedWidth] = useState<number | null>(null);
  const [expandedWidth, setExpandedWidth] = useState<number | null>(null);

  useEffect(() => {
    if (collapsedRef.current) {
      setCollapsedWidth(collapsedRef.current.scrollWidth);
    }
    if (expandedRef.current) {
      setExpandedWidth(expandedRef.current.scrollWidth);
    }
  }, []);

  const currentWidth =
    collapsedWidth !== null && expandedWidth !== null
      ? hovered
        ? expandedWidth
        : collapsedWidth
      : undefined;

  return (
    <span
      className="font-logo text-3xl md:text-4xl font-light text-charcoal select-none inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="relative inline-flex items-baseline">
        <span aria-hidden="true">{"{"}</span>
        <span
          className="relative inline-block overflow-hidden transition-[width] duration-300 ease-in-out align-baseline"
          style={{ width: currentWidth !== undefined ? `${currentWidth}px` : "3ch" }}
        >
          <span
            ref={collapsedRef}
            className="inline-block transition-opacity duration-200 ease-in-out whitespace-nowrap"
            style={{ opacity: hovered ? 0 : 1 }}
          >
            THS
          </span>
          <span
            ref={expandedRef}
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
