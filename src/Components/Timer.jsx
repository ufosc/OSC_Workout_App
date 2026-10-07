import React, { useEffect, useState } from 'react';

function Timer({ initialSeconds = 60 }) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      setIsRunning(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(initialSeconds);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Rest Timer</h1>

      <h2>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </h2>

      <button onClick={startTimer} disabled={isRunning}>
        Start
      </button>

      <button onClick={pauseTimer} disabled={!isRunning}>
        Pause
      </button>

      <button onClick={resetTimer}>
        Reset
      </button>
    </div>
  );
}

export default Timer;