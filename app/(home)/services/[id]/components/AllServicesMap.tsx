"use client";
/* global google */

import { useEffect, useMemo, useRef } from "react";
import Script from "next/script";

type ServiceLike = {
  _id: string;
  title?: string;
  contact?: { address?: string };
  location?: { type: "Point"; coordinates: [number, number] }; // [lng, lat]
};

export default function AllServicesMap({
  services,
  selectedServiceId,
  onSelect,
}: {
  services: ServiceLike[];
  selectedServiceId?: string | null;
  onSelect?: (id: string) => void;
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const infoRef = useRef<any>(null);

  // 🔓 Make sure no ancestor clips Google overlays
  useEffect(() => {
    const root = mapContainerRef.current;
    if (!root) return;
    let el: HTMLElement | null = root.parentElement;
    while (el && el !== document.body && el !== document.documentElement) {
      const cs = getComputedStyle(el);
      if (cs.overflow !== "visible") el.style.overflow = "visible";
      if (cs.overflowX !== "visible") el.style.overflowX = "visible";
      if (cs.overflowY !== "visible") el.style.overflowY = "visible";
      el = el.parentElement;
    }
  }, []);

  const withCoords = useMemo(
    () => services.filter((s) => {
      const c = s.location?.coordinates;
      return Array.isArray(c) && c.length === 2 && Number.isFinite(c[0]) && Number.isFinite(c[1]);
    }),
    [services]
  );

  const serialById = useMemo(() => {
    const m: Record<string, number> = {};
    withCoords.forEach((s, i) => (m[s._id] = i + 1));
    return m;
  }, [withCoords]);

  const makeNumberedIcon = (num: number, selected: boolean) => {
    const size = selected ? 44 : 34;
    const r = selected ? 18 : 14;
    const fill = selected ? "#ef4444" : "#2563eb";
    const stroke = "#ffffff";
    const strokeW = selected ? 3 : 2;
    const fontSize = selected ? 16 : 13;

    const svg = encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}"/>
        <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
              font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
              font-size="${fontSize}" font-weight="700" fill="#ffffff">${String(num)}</text>
      </svg>`
    );

    return {
      url: `data:image/svg+xml;charset=UTF-8,${svg}`,
      scaledSize: new (window as any).google.maps.Size(size, size),
      anchor: new (window as any).google.maps.Point(size / 2, size / 2),
    };
  };

  const escapeHTML = (s?: string) =>
    (s || "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const initMap = () => {
    if (!mapContainerRef.current || mapRef.current) return;
    if (!(window as any).google?.maps) return;

    mapRef.current = new (window as any).google.maps.Map(mapContainerRef.current, {
      center: { lat: 20.5937, lng: 78.9629 },
      zoom: 5,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      // ⬇️ prevents the Ctrl+scroll banner & keyboard overlay
      gestureHandling: "greedy",
      keyboardShortcuts: false,
    });

    infoRef.current = new (window as any).google.maps.InfoWindow({ maxWidth: 300 });
  };

  const placeMarkers = () => {
    const map = mapRef.current;
    if (!map) return;

    const existingIds = new Set(withCoords.map((s) => s._id));
    for (const id of Object.keys(markersRef.current)) {
      if (!existingIds.has(id)) {
        markersRef.current[id].setMap(null);
        delete markersRef.current[id];
      }
    }

    const bounds = new (window as any).google.maps.LatLngBounds();
    let anyValid = false;

    withCoords.forEach((s) => {
      const [lng, lat] = s.location!.coordinates!;
      const pos = new (window as any).google.maps.LatLng(lat, lng);
      const serial = serialById[s._id] ?? 0;

      let marker = markersRef.current[s._id];
      if (!marker) {
        marker = new (window as any).google.maps.Marker({
          position: pos,
          map,
          zIndex: 1,
          icon: makeNumberedIcon(serial, false),
        });
        marker.addListener("click", () => onSelect?.(s._id));
        markersRef.current[s._id] = marker;
      } else {
        marker.setPosition(pos);
        marker.setIcon(makeNumberedIcon(serial, false));
        marker.setZIndex(1);
        marker.setTitle("");
      }

      bounds.extend(pos);
      anyValid = true;
    });

    if (anyValid && !selectedServiceId) {
      map.fitBounds(bounds, 80);
    }
  };

  const applySelection = () => {
    const map = mapRef.current;
    if (!map || !infoRef.current) return;

    infoRef.current.close();

    if (!selectedServiceId) {
      Object.entries(markersRef.current).forEach(([id, marker]) => {
        const serial = serialById[id] ?? 0;
        marker.setIcon(makeNumberedIcon(serial, false));
        marker.setZIndex(1);
        marker.setVisible(true);
        marker.setTitle("");
      });
      return;
    }

    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const serial = serialById[id] ?? 0;
      if (id === selectedServiceId) {
        marker.setIcon(makeNumberedIcon(serial, true));
        marker.setZIndex(1000);
      } else {
        marker.setIcon(makeNumberedIcon(serial, false));
        marker.setZIndex(1);
      }
      marker.setVisible(true);
      marker.setTitle("");
    });

    const selectedMarker = markersRef.current[selectedServiceId];
    if (!selectedMarker) return;

    const svc = services.find((s) => s._id === selectedServiceId);
    const serial = serialById[selectedServiceId] ?? 0;
    const title = escapeHTML(svc?.title || "Selected Service");
    const addr = escapeHTML(svc?.contact?.address || "");

    const html = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; max-width: 260px;">
        <div style="font-size:18px;font-weight:800;margin-bottom:6px;word-break:break-word;">#${serial} • ${title}</div>
        ${addr ? `<div style="font-size:14px;line-height:1.35;color:#374151;word-break:break-word;">${addr}</div>` : ""}
      </div>
    `;

    infoRef.current.setContent(html);
    infoRef.current.open({ map, anchor: selectedMarker });

    const pos = selectedMarker.getPosition?.();
    if (pos) {
      map.panTo(pos);
      map.setZoom(Math.max(map.getZoom?.() ?? 5, 16));
    }
  };

  useEffect(() => {
    if ((window as any).google?.maps) {
      initMap();
      placeMarkers();
      applySelection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services, selectedServiceId, serialById]);

  return (
    <div className="w-full h-full">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`}
        strategy="afterInteractive"
        onLoad={() => { initMap(); placeMarkers(); applySelection(); }}
      />
      {/* ✅ Real height + overflow visible so Google UI can escape if needed */}
      <div
        ref={mapContainerRef}
        className="w-full h-full overflow-visible rounded"
        style={{ minHeight: 320, position: "relative" }}
      />
    </div>
  );
}
