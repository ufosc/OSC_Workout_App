import React, { useState, useEffect } from "react";

function Timer({duration = 60, completionType = "flash"}) {
  const [timeLeft, setTimeLeft] = useState(duration); // default duration (60s)
  const [isFlashing, setIsFlashing] = useState(false); // default no flashing
  const [completed, setCompleted] = useState(false); // default not completed
  const [popScale, setPopScale] = useState(1); // default 1 = normal size
  const [isPopped, setIsPopped] = useState(false); // default not popped

  // sets up the countdown aspect of the timer
  useEffect(() => {
    if (timeLeft <= 0 && !completed) {
      setCompleted(true);
      onComplete();
      return;
    }

    let timerId
    if (timeLeft > 0) {
      timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }

    return () => clearTimeout(timerId); // cleanup
  }, [timeLeft, completed]);

  // formats the timer so that it shows MM:SS instead of just seconds
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`; // pads with 0s as needed
  }

  // resets the timer to duration
  function resetTimer() {
    setTimeLeft(duration);
    setIsFlashing(false);
    setCompleted(false);
    setIsPopped(false);
    setPopScale(0);
  }

  // when the timer finishes 
  // ************************************
  // customize ending here!!!
  function onComplete() {
    if (completionType === "flash") {
      setIsFlashing(true);
      const flashInterval = setInterval(() => {
        setIsFlashing(prev => !prev); // toggle visibility
      }, 500);

      // stop flashing after a 5 seconds (5 flashes)
      setTimeout(() => {
        clearInterval(flashInterval);
        setIsFlashing(false);
      }, 5000);


    } else if (completionType === "pop") {
      setIsPopped(false);
      // seamlessly increases the size of the text
      for (let i = 1; i <= 100; i++) {
        setTimeout(() => {
          setPopScale(1 + (4 / 100) * i);
        }, 50 * i);
      }
      // pops the balloon! (this is done by hiding the text)
      setTimeout(() => {
        setIsPopped(true);
      }, 5200);
    } else {
      // always modifiable to add more completion types or a different default (besides a log message)
      console.log("Timer complete!");
    }
  }

  // formatting for the visuals of the timer (includes the two animations after completion)
  return (
  <div>
    <h1>{formatTime(timeLeft)}</h1>
    <button onClick={resetTimer}>Reset</button>
    {timeLeft <= 0 && completed && (
    <h2
      style={{
        color: completionType === "flash" ? (isFlashing ? "red" : "transparent") : "red",
        fontSize: "4rem",
        textAlign: "center",
        transform: completionType === "pop" ? `scale(${popScale})` : "scale(1)",
        transition: completionType === "pop" ? "transform 0.3s ease" : "none",
        display: completionType === "pop" && isPopped ? "none" : "block", // hides after pop
      }}
    >
      REST DONE
    </h2>
    )}
  </div>
  );
}
export default Timer;