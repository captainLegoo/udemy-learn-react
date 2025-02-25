import { useEffect, useState } from "react";

export default function ProgressBar({timer}) {
  const [remainingTime, setRemainingTime] = useState(timer);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Interval...");
      setRemainingTime(prev => prev - 10);
    }, 10);

    return () => {
      console.log('clearning interval...');
      clearInterval(interval);
    };
  }, []);

  return (
    <progress value={remainingTime} max={timer} />
  );
}