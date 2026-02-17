import React from 'react';

const Timer = () => {
    const ref = React.useRef(null);
    const [secondsRemaining, setSecondsRemaining] = React.useState(180);
    const [isRunning, setIsRunning] = React.useState(false);
    const [preset, setPreset] = React.useState(180);

    const getRemaining = (total) => {
        const seconds = Math.floor((total % 60));
        const minutes = Math.floor((total / 60));
        return (
            (minutes > 9 ? minutes : "0" + minutes) + ":"
             + (seconds > 9 ? seconds : "0" + seconds)
        );

    };

    const startTimer = (e) => {
        if(ref.current) clearInterval(ref.current);

        ref.current = setInterval(() => {
            setSecondsRemaining((prev) => { 
                if(prev <= 1) {
                    clearInterval(ref.current);
                    setIsRunning(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        setIsRunning(true);
    };

    const setTime = (seconds) => {
        clearInterval(ref.current);
        setIsRunning(false);
        setSecondsRemaining(seconds);
        setPreset(seconds);
    };

    const pauseTimer = () => {
        clearInterval(ref.current);
        setIsRunning(false);
    };


    const resetTimer = () => {  
        clearInterval(ref.current);
        setIsRunning(false);
        setSecondsRemaining(preset);
    };

    React.useEffect(() => {
        return () => clearInterval(ref.current);
    }, []);


    return (
        <div style={{ textAlign: "center", margin: "auto" }}>

            <h3>Rest Timer</h3>
            <h2>{getRemaining(secondsRemaining)}</h2>

            <div>
                <button onClick={() => setTime(120)}>2:00</button>
                <button onClick={() => setTime(150)}>2:30</button>
                <button onClick={() => setTime(180)}>3:00</button>
            </div>

            <div> 
                {isRunning ? (
                    <button onClick={pauseTimer}>Pause</button>
                ) : (
                    <button onClick={startTimer}>Start</button>
                )}
                <button onClick={resetTimer}>Reset</button>
            </div>
        </div>
    );
};
export default Timer;