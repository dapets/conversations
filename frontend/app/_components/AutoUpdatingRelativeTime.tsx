"use client";

import { useEffect, useState } from "react";
import { getRelativeLocalTimeStrFromUtcDate } from "utils/configuredDayjs";

export function AutoUpdatingRelativeTime({
  className,
  date,
}: {
  className?: string;
  date: Date;
}) {
  const [localTime, setLocalTime] = useState(
    getRelativeLocalTimeStrFromUtcDate(date),
  );
  useEffect(() => {
    function updateTime() {
      setLocalTime(getRelativeLocalTimeStrFromUtcDate(date));
    }

    const timeout = setInterval(() => updateTime(), 1000 * 30);

    const visibilityChangedAbortController = new AbortController();
    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.visibilityState === "visible") {
          updateTime();
        }
      },
      { signal: visibilityChangedAbortController.signal },
    );
    return () => {
      clearInterval(timeout);
      visibilityChangedAbortController.abort();
    };
  }, [date]);

  return (
    <time
      suppressHydrationWarning
      dateTime={date.toISOString()}
      className={className}
    >
      {localTime}
    </time>
  );
}
