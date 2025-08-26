"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Affixes its children:
 *  - static before entering viewport,
 *  - fixed under the header while scrolling,
 *  - sticks to the bottom of its column when the column ends.
 *
 * It reads --header-h from :root so it stays perfectly under your fixed header.
 */
export default function AffixSidebar({
  children,
  gap = 16, // extra space below header
}: {
  children: React.ReactNode;
  gap?: number;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null); // the column wrapper
  const boxRef = useRef<HTMLDivElement | null>(null);      // the affixed box
  const [mode, setMode] = useState<"static" | "fixed" | "bottom">("static");
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });

  const getHeaderH = () => {
    const v = getComputedStyle(document.documentElement).getPropertyValue("--header-h");
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };

  const measure = () => {
    const wrap = wrapperRef.current;
    const box = boxRef.current;
    if (!wrap || !box) return;

    const rect = wrap.getBoundingClientRect();
    const headerH = getHeaderH();
    const topOffset = headerH + gap;

    // compute positions relative to viewport
    const width = rect.width;
    const left = rect.left;

    // the heights/positions we need to decide modes
    const boxH = box.offsetHeight;
    const wrapTopDoc = rect.top + window.scrollY;
    const wrapBottomDoc = rect.bottom + window.scrollY;

    const scrollTop = window.scrollY;
    const viewportTop = scrollTop + topOffset;
    const boxBottomIfFixed = viewportTop + boxH;

    if (viewportTop <= wrapTopDoc) {
      // box hasn't reached the top of the wrapper yet
      setMode("static");
    } else if (boxBottomIfFixed >= wrapBottomDoc) {
      // box would overflow past wrapper bottom -> stick to bottom
      setMode("bottom");
    } else {
      // in the middle zone -> fixed to viewport
      setMode("fixed");
    }

    setCoords({ top: topOffset, left, width, height: boxH });
  };

  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          measure();
          ticking = false;
        });
        ticking = true;
      }
    };
    const onResize = () => measure();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // header height can change (mobile menu); re-measure on attribute/style changes
    const ro = new ResizeObserver(() => measure());
    if (wrapperRef.current) ro.observe(wrapperRef.current);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wrapper must be relative so "bottom" absolute positioning works
  const wrapperStyle: React.CSSProperties = { position: "relative" };

  // Compute styles per mode
  const fixedStyle: React.CSSProperties =
    mode === "fixed"
      ? {
          position: "fixed",
          top: coords.top,
          left: coords.left,
          width: coords.width,
          zIndex: 40,
        }
      : mode === "bottom"
      ? {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }
      : {
          position: "static",
        };

  return (
    <div ref={wrapperRef} style={wrapperStyle}>
      <div ref={boxRef} style={fixedStyle}>
        {children}
      </div>
    </div>
  );
}
