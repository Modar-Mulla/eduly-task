"use client";

import * as React from "react";

export function usePolling(cb: () => void, min = 3000, max = 5000) {
  React.useEffect(() => {
    let alive = true;
    const tick = () => {
      const delay = Math.floor(min + Math.random() * (max - min));
      const id = setTimeout(async () => {
        if (!alive) return;
        await cb();
        if (!alive) return;
        tick();
      }, delay);
      return () => clearTimeout(id);
    };
    const cleanup = tick();
    return () => {
      alive = false;
      cleanup && cleanup();
    };
  }, [cb, min, max]);
}
