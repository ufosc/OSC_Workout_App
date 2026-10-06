import { useState, useEffect, useRef } from "react";

const PRESETS = [30, 60, 90, 120];

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function playTimerDoneSound(soundType) {
  const soundFiles = {
    turkishMarch: "/sounds/turkish-march.mp3",
    chopinTorrent: "/sounds/chopin-torrent.mp3",
    vivaldiSummer: "/sounds/vivaldi-summer.mp3",
  };

  const audio = new Audio(`${process.env.PUBLIC_URL}${soundFiles[soundType]}`);
  audio.volume = 0.65;
  audio.play().catch(() => {});

  return audio;
}

export default function Timer({ initialSeconds = 60, onComplete }) {
  const [duration, setDuration] = useState(initialSeconds);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [customTime, setCustomTime] = useState("");
  const [soundType, setSoundType] = useState("turkishMarch");
  const [isComplete, setIsComplete] = useState(false);
  const endTimeRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const soundTypeRef = useRef(soundType);
  const activeAudioRef = useRef(null);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    soundTypeRef.current = soundType;
  }, [soundType]);

  useEffect(() => {
    if (!isRunning) return undefined;

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
        stopTimerDoneSound();
        activeAudioRef.current = playTimerDoneSound(soundTypeRef.current);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }, 250);

    return () => clearInterval(id);
  }, [isRunning]);

  const stopTimerDoneSound = () => {
    if (!activeAudioRef.current) return;

    activeAudioRef.current.pause();
    activeAudioRef.current.currentTime = 0;
    activeAudioRef.current = null;
  };

  const handleStart = () => {
    stopTimerDoneSound();

    const nextSeconds = secondsLeft === 0 ? duration : secondsLeft;

    endTimeRef.current = Date.now() + nextSeconds * 1000;
    setSecondsLeft(nextSeconds);
    setIsComplete(false);
    setIsRunning(true);
  }

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    stopTimerDoneSound();

    setIsRunning(false);
    setSecondsLeft(duration);
    setIsComplete(false);
  };

  const handlePreset = (seconds) => {
    stopTimerDoneSound();
    setIsRunning(false);
    setDuration(seconds);
    setSecondsLeft(seconds);
    setIsComplete(false);
  };

  function handleCustomTime() {
    const newTime = Number(customTime);

    if(newTime > 0) {
      stopTimerDoneSound();
      setIsRunning(false);
      setDuration(newTime);
      setSecondsLeft(newTime);
      setIsComplete(false);
      setCustomTime("");
    }
  }

  function addThirtySeconds() {
    stopTimerDoneSound();
    const newTime = secondsLeft + 30;

    if (isRunning){
      endTimeRef.current += 30000;
    }

    setSecondsLeft(newTime);
    setDuration((currentDuration) =>
      isRunning ? currentDuration + 30 : newTime);
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

      <div style={{ marginTop: "1rem" }}>
        <label htmlFor="timer-sound" style={{ marginRight: "0.5rem" }}>
          Finish sound
        </label>

        <select
          id="timer-sound"
          value={soundType}
          onChange={(event) => setSoundType(event.target.value)}
          disabled={isRunning}
        >
          <option value="turkishMarch">Mozart - Turkish March</option>
          <option value="chopinTorrent">Chopin - Etude Torrent</option>
          <option value="vivaldiSummer">Vivaldi - Summer</option>
        </select>
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

        <button onClick={addThirtySeconds}>
          +30s
        </button>
      </div>
      {isComplete && (
        <h3>Rest complete. Next set ready.</h3>
      )}
    </div>
  );
}