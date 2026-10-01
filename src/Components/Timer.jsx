import { useState, useEffect, useRef } from "react";

const PRESETS = [30, 60, 90, 120];

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function Timer({ initialSeconds = 60, onComplete }) {
  const [duration, setDuration] = useState(initialSeconds);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [customTime, setCustomTime] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const endTimeRef = useRef(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isRunning) return undefined;

    endTimeRef.current = Date.now() + secondsLeft * 1000;

    const id = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.ceil((endTimeRef.current - Date.now()) / 1000)
      );
      setSecondsLeft(remaining);

      if (remaining === 0) {
        clearInterval(id);
        setIsRunning(false);
        setIsComplete(true);

        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }, 250);

    return () => clearInterval(id);
  }, [isRunning]);

  const handleStart = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(duration);
    }

    setIsComplete(false);
    setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(duration);
    setIsComplete(false);
  };

  const handlePreset = (seconds) => {
    setIsRunning(false);
    setDuration(seconds);
    setSecondsLeft(seconds);
    setIsComplete(false);
  };

  function handleCustomTime() {
    const newTime = Number(customTime);

    if(newTime > 0) {
      setIsRunning(false);
      setDuration(newTime);
      setSecondsLeft(newTime);
      setIsComplete(false);
      setCustomTime("");
    }
  }

  function addThirtySeconds() {
    const newTime = secondsLeft + 30;

    setSecondsLeft(newTime);
    setDuration(newTime);
    setIsComplete(false);
  }

  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      <h2>Rest Timer</h2>

      <div
        role="timer"
        aria-live="off"
        style={{ fontSize: "3rem", fontWeight: "bold", margin: "0.5rem 0" }}
      >
        {formatTime(secondsLeft)}
      </div>
      <progress
        value={secondsLeft}
        max={duration}
        style={{ width: "250px" }}
      ></progress>

      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
        {PRESETS.map((seconds) => (
          <button
            key={seconds}
            onClick={() => handlePreset(seconds)}
            disabled={isRunning}
            aria-pressed={duration === seconds}
          >
            {seconds}s
          </button>
        ))}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <input
          type="number"
          placeholder="Custom seconds"
          value={customTime}
          onChange={(event) => setCustomTime(event.target.value)}
          min="1"
          step="1"
        />

        <button
          onClick={handleCustomTime}
          disabled={isRunning}
        >
          Set Time
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          justifyContent: "center",
          marginTop: "1rem",
        }}
      >
        {isRunning ? (
          <button onClick={handlePause}>Pause</button>
        ) : (
          <button onClick={handleStart}>Start</button>
        )}
        <button onClick={handleReset}>Reset</button>

        <button
          onClick={addThirtySeconds}
          disabled={isRunning}
        >
          +30s
        </button>
      </div>
      {isComplete && (
        <h3>Rest Complete!</h3>
      )}
    </div>
  );
}