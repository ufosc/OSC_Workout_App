import { useCallback, useEffect, useRef, useState } from "react";
import "./Timer.css";

const DEFAULT_DURATION = 60;
const PRESETS = [30, 60, 90, 120];
const SOUND_FILES = {
  turkishMarch: "/sounds/turkish-march.mp3",
  chopinTorrent: "/sounds/chopin-torrent.mp3",
  vivaldiSummer: "/sounds/vivaldi-summer.mp3",
};

export function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getValidDuration(value) {
  const duration = Number(value);
  return Number.isInteger(duration) && duration > 0
    ? duration
    : DEFAULT_DURATION;
}

function playTimerDoneSound(soundType) {
  const audio = new Audio(
    `${process.env.PUBLIC_URL}${SOUND_FILES[soundType]}`
  );
  audio.volume = 0.65;
  audio.play().catch(() => {
    // Some browsers block delayed audio. The visual and vibration alerts remain.
  });
  return audio;
}

export default function Timer({ initialSeconds = DEFAULT_DURATION, onComplete }) {
  const initialDuration = getValidDuration(initialSeconds);
  const [duration, setDuration] = useState(initialDuration);
  const [secondsLeft, setSecondsLeft] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [customTime, setCustomTime] = useState("");
  const [customTimeError, setCustomTimeError] = useState("");
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

  const stopTimerDoneSound = useCallback(() => {
    if (!activeAudioRef.current) return;

    activeAudioRef.current.pause();
    activeAudioRef.current.currentTime = 0;
    activeAudioRef.current = null;
  }, []);

  useEffect(() => {
    if (!isRunning) return undefined;

    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.ceil((endTimeRef.current - Date.now()) / 1000)
      );
      setSecondsLeft(remaining);

      if (remaining === 0) {
        setIsRunning(false);
        setIsComplete(true);

        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        stopTimerDoneSound();
        activeAudioRef.current = playTimerDoneSound(soundTypeRef.current);
        onCompleteRef.current?.();
      }
    };

    const intervalId = setInterval(updateTimer, 250);
    return () => clearInterval(intervalId);
  }, [isRunning, stopTimerDoneSound]);

  useEffect(() => stopTimerDoneSound, [stopTimerDoneSound]);

  const prepareDuration = (seconds) => {
    stopTimerDoneSound();
    setIsRunning(false);
    setDuration(seconds);
    setSecondsLeft(seconds);
    setIsComplete(false);
  };

  const handleStart = () => {
    stopTimerDoneSound();
    const nextSeconds = secondsLeft === 0 ? duration : secondsLeft;

    endTimeRef.current = Date.now() + nextSeconds * 1000;
    setSecondsLeft(nextSeconds);
    setIsComplete(false);
    setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    prepareDuration(duration);
  };

  const handlePreset = (seconds) => {
    setCustomTimeError("");
    prepareDuration(seconds);
  };

  const handleCustomTime = (event) => {
    event.preventDefault();
    const newTime = Number(customTime);

    if (!Number.isInteger(newTime) || newTime < 1) {
      setCustomTimeError("Enter a whole number greater than zero.");
      return;
    }

    setCustomTimeError("");
    setCustomTime("");
    prepareDuration(newTime);
  };

  const addThirtySeconds = () => {
    stopTimerDoneSound();

    if (isRunning) {
      endTimeRef.current += 30000;
    }

    setSecondsLeft((currentSeconds) => currentSeconds + 30);
    setDuration((currentDuration) => currentDuration + 30);
    setIsComplete(false);
  };

  return (
    <section className="rest-timer" aria-labelledby="rest-timer-title">
      <div className="rest-timer__heading">
        <div>
          <p className="rest-timer__eyebrow">Between sets</p>
          <h2 id="rest-timer-title">Rest timer</h2>
        </div>
        <span className={`rest-timer__state${isRunning ? " is-running" : ""}`}>
          {isRunning ? "Running" : isComplete ? "Complete" : "Ready"}
        </span>
      </div>

      <div
        className="rest-timer__display"
        role="timer"
        aria-label={`${secondsLeft} seconds remaining`}
        aria-live="off"
      >
        {formatTime(secondsLeft)}
      </div>

      <progress
        className="rest-timer__progress"
        value={secondsLeft}
        max={duration}
        aria-label="Rest time remaining"
      />

      <div className="rest-timer__presets" aria-label="Timer presets">
        {PRESETS.map((seconds) => (
          <button
            className="rest-timer__preset"
            type="button"
            key={seconds}
            onClick={() => handlePreset(seconds)}
            disabled={isRunning}
            aria-pressed={duration === seconds}
          >
            {formatTime(seconds)}
          </button>
        ))}
      </div>

      <form className="rest-timer__custom" onSubmit={handleCustomTime}>
        <label htmlFor="custom-rest-time">Custom time (seconds)</label>
        <div className="rest-timer__custom-controls">
          <input
            id="custom-rest-time"
            type="number"
            inputMode="numeric"
            placeholder="e.g. 45"
            value={customTime}
            onChange={(event) => {
              setCustomTime(event.target.value);
              setCustomTimeError("");
            }}
            min="1"
            step="1"
            disabled={isRunning}
            aria-invalid={Boolean(customTimeError)}
            aria-describedby={customTimeError ? "custom-rest-time-error" : undefined}
          />
          <button type="submit" disabled={isRunning}>Set time</button>
        </div>
        {customTimeError && (
          <span id="custom-rest-time-error" className="rest-timer__error" role="alert">
            {customTimeError}
          </span>
        )}
      </form>

      <div className="rest-timer__sound">
        <label htmlFor="timer-sound">Finish sound</label>
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

      <div className="rest-timer__actions">
        {isRunning ? (
          <button className="rest-timer__primary" type="button" onClick={handlePause}>
            Pause
          </button>
        ) : (
          <button className="rest-timer__primary" type="button" onClick={handleStart}>
            {secondsLeft === 0 ? "Restart" : "Start"}
          </button>
        )}
        <button type="button" onClick={handleReset}>Reset</button>
        <button type="button" onClick={addThirtySeconds}>+30s</button>
      </div>

      <p className="rest-timer__message" role="status" aria-live="polite">
        {isComplete ? "Rest complete. Your next set is ready." : "\u00a0"}
      </p>
    </section>
  );
}
