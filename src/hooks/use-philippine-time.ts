import { useState, useEffect, useCallback } from "react";

export const usePhilippineTime = () => {
  const [time, setTime] = useState("");

  const getFormattedPhTime = useCallback(() => {
    const now = new Date();
    const phTime = new Intl.DateTimeFormat("en-PH", {
      timeZone: "Asia/Manila",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(now);

    return phTime;
  }, []);

  const updateTime = useCallback(() => {
    const formattedPhTime = getFormattedPhTime();
    setTime(formattedPhTime);
  }, [getFormattedPhTime, setTime]);

  useEffect(() => {
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [updateTime]);

  return time;
};
