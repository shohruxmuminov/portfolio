"use client";

import { useEffect, useState } from "react";

/** Live local time in Uzbekistan (single time zone, UTC+5). */
export default function Clock({ className }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Tashkent",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={className}>
      <span aria-hidden="true">●</span> Uzbekistan{" "}
      <time suppressHydrationWarning style={{ fontVariantNumeric: "tabular-nums" }}>
        {time ?? "--:--:--"}
      </time>{" "}
      GMT+5
    </span>
  );
}
