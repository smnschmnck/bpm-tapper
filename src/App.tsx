import { useState } from "react";

function App() {
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [bpm, setBpm] = useState(0);

  const handleTap = () => {
    const now = Date.now();
    const newTapTimes = [...tapTimes, now];

    // Only keep the last 10 taps for calculation
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
  };

  return (
    <div className="flex flex-col gap-4 h-full w-full p-12">
      <h1 className="font-bold text-2xl">BPM Tapper</h1>
      <div className="flex bg-white h-full w-full justify-center items-center">
        <button
          onClick={handleTap}
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
