// Filename - Secondtimer.js
// Based on the approach in the GeeksforGeeks tutorial "How to create a countdown timer using ReactJS" 

import React, {useState, useRef} from "react";
const Secondtimer=()=>{
    // Uses Ref to hold react values 
    const Ref=useRef(null);
    const deadlineRef=useRef(null);
    const pausedRef=useRef(null);
    // Timer state
    const [timer, setTimer]=useState("00:00");
    const getTimeRemaining=(e)=>{
        const total=Date.parse(e)-Date.parse(new Date());
        const seconds=Math.floor((total/1000)%60);
        const minutes=Math.floor((total/1000/60)%60);
        return {total, minutes, seconds};
    };
    //Function to start the timer
    const startTimer=(e)=>{
        let { total, minutes, seconds } =
            getTimeRemaining(e);
        if (total>=0) {
            // update the timer if it is still not at 0
            setTimer(
                (minutes>9 ? minutes: "0"+minutes)+":"+(seconds>9 ? seconds:"0"+seconds)
            );
            // if it is at 0 stop counting
        } else{
            clearInterval(Ref.current);
            Ref.current=null;
            deadlineRef.current=null;
        }
    };
    //functionality for reset timer to cleanly reset to 0
    const clearTimer=(e)=>{
        pausedRef.current=null;
        deadlineRef.current=e;
        startTimer(e);
        if (!Ref.current){
            Ref.current=setInterval(()=>{
            startTimer(deadlineRef.current);
        }, 1000);
    }
    };
    //gets the time of when the countdown needs to end before running
    const getDeadTime=(seconds)=>{
        let deadline=new Date();
        deadline.setSeconds(deadline.getSeconds() + seconds);
        return deadline;
    };
    // functionality for the button that resets the timer at 0
    const onClickReset=()=>{
        pausedRef.current=null;
        clearInterval(Ref.current);
        Ref.current=null;
        deadlineRef.current=null;
        setTimer("00:00");
    };
    // functionality for the button that adds time to the 
    // timer based on which button clicked
    const onClickAdd=(seconds)=>{
        const current= deadlineRef.current;
        if (current &&current> new Date()){
        clearTimer(new Date(current.getTime()+seconds*1000));
        }
        else{
            clearTimer(getDeadTime(seconds));
        }
    };
    //functionality to pause and resume the timer
    const onClickPauseResume=()=>{
        if (deadlineRef.current){
            pausedRef.current=deadlineRef.current-new Date();
            clearInterval(Ref.current);
            Ref.current=null;
            deadlineRef.current=null;
        } else if(pausedRef.current){
            clearTimer(new Date(Date.now()+pausedRef.current));
        }
    };
    //frontend look with text timer and buttons displayed
    return (
        <div
            style={{ textAlign: "center", margin: "auto" }}>
            <h1 style={{ color: "blue" }}>
                Workout Rest Timer
            </h1>
            <h3>Choose Your Rest Time</h3>
            <h2>{timer}</h2>
            <button onClick={onClickReset}>Reset</button>
            <button onClick={() =>onClickAdd(30)}>30 Sec</button>
            <button onClick={() =>onClickAdd(60)}>1 Min</button>
            <button onClick={() =>onClickAdd(120)}>2 Min</button>
            <button onClick={() =>onClickAdd(180)}>3 Min</button>
            <h4>
            <button onClick={() =>onClickPauseResume()}>Pause</button>
            <button onClick={() =>onClickPauseResume()}>Resume</button>
            </h4>
        </div>
    );
};

export default Secondtimer;