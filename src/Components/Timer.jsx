import { useEffect, useState } from 'react';
import './Timer.css';

const DEFAULT_SECONDS = 60;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function Timer() {
  const [initialSeconds, setInitialSeconds] = useState(DEFAULT_SECONDS);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SECONDS);
  const [timeInput, setTimeInput] = useState(String(DEFAULT_SECONDS));
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          setIsRunning(false);
          return 0;
        }

        return currentTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  const handleTimeInputChange = (event) => {
    const value = event.target.value;
    setTimeInput(value);

    if (/^\d*$/.test(value)) {
      const seconds = Number(value);
      if (value !== '') {
        setInitialSeconds(seconds);
        setTimeLeft(seconds);
        setIsRunning(false);
      }
    }
  };

  const adjustTime = (amount) => {
    if (isRunning) {
      setTimeLeft((currentTime) => Math.max(0, currentTime + amount));
      return;
    }

    const nextTime = Math.max(0, initialSeconds + amount);
    setInitialSeconds(nextTime);
    setTimeLeft(nextTime);
    setTimeInput(String(nextTime));
  };

  const handleStartPause = () => {
    if (isRunning) {
      setIsRunning(false);
    } else if (timeLeft > 0) {
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialSeconds);
    setTimeInput(String(initialSeconds));
  };

  return (
    <main className="timer-page">
      <section className="timer-card" aria-label="Workout countdown timer">
        <h1>Workout Timer</h1>
        <div className="timer-display" role="timer" aria-live="polite">
          {formatTime(timeLeft)}
        </div>

        <label className="timer-input-label" htmlFor="timer-seconds">
          Set time (seconds)
        </label>
        <input
          id="timer-seconds"
          className="timer-input"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={timeInput}
          onChange={handleTimeInputChange}
          aria-label="Countdown time in seconds"
        />

        <div className="timer-adjustments">
          <button type="button" onClick={() => adjustTime(-30)}>-30s</button>
          <button type="button" onClick={() => adjustTime(-15)}>-15s</button>
          <button type="button" onClick={() => adjustTime(15)}>+15s</button>
          <button type="button" onClick={() => adjustTime(30)}>+30s</button>
        </div>

        <div className="timer-controls">
          <button type="button" className="timer-primary-button" onClick={handleStartPause}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
      </section>
    </main>
  );
}

export default Timer;