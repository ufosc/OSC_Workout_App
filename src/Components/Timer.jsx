import { useState, useEffect, useRef } from "react";
import "./Timer.css";

const PRESETS = [30, 60, 90, 120];

// limits for the custom time box (in seconds)
const MIN_CUSTOM_SECONDS = 1;
const MAX_CUSTOM_SECONDS = 3600;

// The countdown ring is a circle whose outline is drawn only partly (strokeDashoffset)
const RING_RADIUS = 54;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

// onStop runs when the sound ends by itself or the browser refuses to play it
function playTimerDoneSound(soundType, onStop) {
  const soundFiles = {
    turkishMarch: "/sounds/turkish-march.mp3",
    chopinTorrent: "/sounds/chopin-torrent.mp3",
    vivaldiSummer: "/sounds/vivaldi-summer.mp3",
  };

  const audio = new Audio(`${process.env.PUBLIC_URL}${soundFiles[soundType]}`);
  audio.volume = 0.65;
  audio.onended = onStop;
  audio.play().catch(onStop);

  return audio;
}

export default function Timer({ initialSeconds = 60, onComplete }) {
  const [duration, setDuration] = useState(initialSeconds);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [customTime, setCustomTime] = useState("");
  const [soundType, setSoundType] = useState("turkishMarch");
  const [isComplete, setIsComplete] = useState(false);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
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
        activeAudioRef.current = playTimerDoneSound(soundTypeRef.current, () =>
          setIsSoundPlaying(false)
        );
        setIsSoundPlaying(true);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }, 250);

    return () => clearInterval(id);
  }, [isRunning]);

  const stopTimerDoneSound = () => {
    setIsSoundPlaying(false);
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
    setIsRunning(false);
    setDuration(seconds);
    setSecondsLeft(seconds);
    setIsComplete(false);
  };

  // Fix: round down to whole seconds, ignore bad input, and cap very large numbers
  function handleCustomTime() {
    const wholeSeconds = Math.floor(Number(customTime));

    if (Number.isFinite(wholeSeconds) && wholeSeconds >= MIN_CUSTOM_SECONDS) {
      const newTime = Math.min(wholeSeconds, MAX_CUSTOM_SECONDS);

      setIsRunning(false);
      setDuration(newTime);
      setSecondsLeft(newTime);
      setIsComplete(false);
      setCustomTime("");
    }
  }

  function addThirtySeconds() {
    const newTime = secondsLeft + 30;

    if (isRunning){
      endTimeRef.current += 30000;
    }

    setSecondsLeft(newTime);
    setDuration((currentDuration) =>
      isRunning ? currentDuration + 30 : newTime);
    setIsComplete(false);
  }

  // how much of the ring is filled: full when done, otherwise time left / total time
  const progress = isComplete ? 1 : duration > 0 ? Math.min(1, secondsLeft / duration) : 0;
  const ringOffset = RING_CIRCUMFERENCE * (1 - progress);

  return (
    <div className="timer-card">
      <h2 className="timer-title">Rest Timer</h2>

      <div className={`timer-ring${isComplete ? " is-complete" : ""}`}>
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle className="timer-ring-track" cx="60" cy="60" r={RING_RADIUS} />
          <circle
            className="timer-ring-progress"
            cx="60"
            cy="60"
            r={RING_RADIUS}
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={ringOffset}
          />
        </svg>
        <div className="timer-digits" role="timer" aria-live="off">
          {formatTime(secondsLeft)}
        </div>
      </div>

      <div className="timer-presets">
        {PRESETS.map((seconds) => (
          <button
            key={seconds}
            className={`timer-chip${duration === seconds ? " is-active" : ""}`}
            onClick={() => handlePreset(seconds)}
            disabled={isRunning}
            aria-pressed={duration === seconds}
          >
            {seconds}s
          </button>
        ))}
      </div>

      <div className="timer-row">
        <input
          className="timer-input"
          type="number"
          placeholder="Custom seconds"
          aria-label="Custom seconds"
          value={customTime}
          onChange={(event) => setCustomTime(event.target.value)}
          min={MIN_CUSTOM_SECONDS}
          max={MAX_CUSTOM_SECONDS}
          step="1"
        />

        <button
          className="timer-btn timer-btn-ghost"
          onClick={handleCustomTime}
          disabled={isRunning}
        >
          Set Time
        </button>
      </div>

      <div className="timer-row">
        <label htmlFor="timer-sound" className="timer-label">
          Finish sound
        </label>

        <select
          id="timer-sound"
          className="timer-select"
          value={soundType}
          onChange={(event) => setSoundType(event.target.value)}
          disabled={isRunning}
        >
          <option value="turkishMarch">Mozart - Turkish March</option>
          <option value="chopinTorrent">Chopin - Etude Torrent</option>
          <option value="vivaldiSummer">Vivaldi - Summer</option>
        </select>
      </div>

      <div className="timer-controls">
        {isRunning ? (
          <button className="timer-btn timer-btn-primary" onClick={handlePause}>
            Pause
          </button>
        ) : (
          <button className="timer-btn timer-btn-primary" onClick={handleStart}>
            Start
          </button>
        )}
        <button className="timer-btn timer-btn-ghost" onClick={handleReset}>
          Reset
        </button>

        <button className="timer-btn timer-btn-ghost" onClick={addThirtySeconds}>
          +30s
        </button>
      </div>

      {/* Fix: the finish sound can now be stopped without pressing Reset or Start */}
      {isSoundPlaying && (
        <button className="timer-btn timer-btn-stop" onClick={stopTimerDoneSound}>
          Stop sound
        </button>
      )}

      {isComplete && (
        <p className="timer-status" role="status">
          Rest complete. Next set ready.
        </p>
      )}
    </div>
  );
}
