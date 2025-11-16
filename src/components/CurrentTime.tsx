"use client";

import React, { useState, useEffect, forwardRef } from "react";

interface CurrentTimeProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

// Memoize formatters outside component to avoid recreating on every render
const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const timezoneFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  timeZoneName: "short",
});

export const CurrentTime = forwardRef<HTMLSpanElement, CurrentTimeProps>(
  ({ className, ...props }, ref) => {
    const [currentTime, setCurrentTime] = useState("");

    // Update time every second
    useEffect(() => {
      const updateTime = () => {
        const now = new Date();
        // Convert to Seattle time (Pacific Time) using memoized formatter
        const seattleTime = timeFormatter.format(now);

        // Get timezone abbreviation (PST/PDT) using memoized formatter
        const timeZone =
          timezoneFormatter
            .formatToParts(now)
            .find((part) => part.type === "timeZoneName")?.value || "PT";

        setCurrentTime(`${seattleTime} ${timeZone}`);
      };

      // Update immediately
      updateTime();

      // Then update every second
      const interval = setInterval(updateTime, 1000);

      return () => clearInterval(interval);
    }, []);

    return (
      <span ref={ref} className={className} {...props}>
        {currentTime}
      </span>
    );
  }
);

CurrentTime.displayName = "CurrentTime";
