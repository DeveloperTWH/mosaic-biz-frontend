"use client";

import { useSyncExternalStore } from "react";

function subscribeMarketSession(onStoreChange: () => void) {
  window.addEventListener("auth:login", onStoreChange);
  window.addEventListener("auth:logout", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("auth:login", onStoreChange);
    window.removeEventListener("auth:logout", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getMarketSessionSnapshot() {
  return localStorage.getItem("user_session") === "true";
}

function getMarketSessionServerSnapshot() {
  return false;
}

/** Client-side market session flag from localStorage; SSR defaults to guest. */
export function useIsMarketLoggedIn(): boolean {
  return useSyncExternalStore(
    subscribeMarketSession,
    getMarketSessionSnapshot,
    getMarketSessionServerSnapshot
  );
}
