"use client";

import { useEffect } from "react";

export function ErrorSuppressor() {
  useEffect(() => {
    const handler = (event: PromiseRejectionEvent) => {
      if (event.reason === undefined || event.reason === null) {
        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", handler);
    return () => window.removeEventListener("unhandledrejection", handler);
  }, []);

  return null;
}
