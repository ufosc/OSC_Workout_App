import { useState, useEffect } from "react";
import "./Timer.css";

function Timer() {
    const [timeLeft, setTimeLeft] = useState(60);
    const [selectedTime, setSelectedTime] = useState(60);
    const [isRunning, setIsRunning] = useState(false);
    const [customTime, setCustomTime] = useState("");

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    useEffect(() => {
        if (timeLeft <= 0) {
            setIsRunning(false);
            return;
        }

        if (!isRunning) {
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((previousTime) => previousTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isRunning, timeLeft]);

    const resetTimer = () => {
        setTimeLeft(selectedTime);
        setIsRunning(false);
    };

    const selectTime = (seconds) => {
        setSelectedTime(seconds);
        setTimeLeft(seconds);
        setIsRunning(false);
    };

    const setCustomTimer = () => {
        const seconds = Number(customTime);

        if (seconds > 0) {
            setSelectedTime(seconds);
            setTimeLeft(seconds);
            setIsRunning(false);
        }
    };

    return (
        <div className="timer-container">
            <h2 className="timer-title">Rest Timer</h2>

            <div className="timer-presets">
                <button
                    className="timer-button"
                    onClick={() => selectTime(30)}
                >
                    30 sec
                </button>

                <button
                    className="timer-button"
                    onClick={() => selectTime(60)}
                >
                    60 sec
                </button>

                <button
                    className="timer-button"
                    onClick={() => selectTime(90)}
                >
                    90 sec
                </button>
            </div>

            <div className="timer-custom">
                <input
                    className="timer-input"
                    type="number"
                    placeholder="Seconds"
                    value={customTime}
                    onChange={(event) => setCustomTime(event.target.value)}
                    min="1"
                />

                <button
                    className="timer-button timer-set-button"
                    onClick={setCustomTimer}
                >
                    Set
                </button>
            </div>

            <div className="timer-display">
                {minutes}:{seconds.toString().padStart(2, "0")}
            </div>

            <div className="timer-controls">
                <button
                    className="timer-button"
                    onClick={() => setIsRunning(!isRunning)}
                >
                    {isRunning ? "Pause" : "Start"}
                </button>

                <button
                    className="timer-button"
                    onClick={resetTimer}
                >
                    Reset
                </button>
            </div>
        </div>
    );
}

export default Timer;