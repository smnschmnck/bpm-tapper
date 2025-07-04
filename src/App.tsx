import { useState, useEffect, useRef, useCallback } from "react";
import { RotateCcw } from "lucide-react";

function App() {
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [bpm, setBpm] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const resetBpm = () => {
    setTapTimes([]);
    setBpm(0);
  };

  const handleTap = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const now = Date.now();
    const newTapTimes = [...tapTimes, now];

    const filteredTaps = newTapTimes.slice(-10);
    setTapTimes(filteredTaps);

    if (filteredTaps.length >= 2) {
      const intervals = filteredTaps
        .slice(1)
        .map((time, i) => time - filteredTaps[i]);
      const avgInterval =
        intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      setBpm(calculatedBpm);
    }

    timeoutRef.current = window.setTimeout(resetBpm, 3000);
  }, [tapTimes]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.match(/^[a-zA-Z]$/)) {
        handleTap();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleTap]);

  return (
    <div className="flex flex-col gap-8 h-full w-full lg:p-12 p-6">
      <div className="flex w-full items-center justify-between">
        <a href="/" className="font-bold text-2xl">
          BPM Tapper
        </a>
        <button
          onClick={resetBpm}
          className="flex h-10 gap-1.5 justify-center items-center rounded-lg bg-zinc-100 p-4 cursor-pointer hover:bg-zinc-200 transition"
        >
          <RotateCcw width={16} strokeWidth={2.5} />
          <span className="font-medium">Reset</span>
        </button>
      </div>
      <div className="flex bg-white h-full w-full justify-center items-center">
        <button
          onMouseDown={handleTap}
          className="flex h-full w-full justify-center items-center bg-blue-300 rounded-2xl active:bg-blue-400 transition cursor-pointer"
        >
          <span className="text-4xl font-bold text-blue-900">
            {bpm > 0 ? `${bpm} BPM` : "Tap to start"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default App;
