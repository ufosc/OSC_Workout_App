// Adds a button for a finish workout, which will be used to grow the streak rather than simply logging in.
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { recordWorkout, getCurrentUser, getMilestone } from '../Utils/streak';

function FinishWorkout() {
    const user = getCurrentUser();
    const [result, setResult] = useState(null);

    if (!user) {
        return (
            <p>
                <NavLink to="/login">Log in</NavLink> to track your workout streak.
            </p>
        );
    }

    const handleFinish = () => {
        setResult(recordWorkout(user));
    };

    if (result) {
        const milestone = getMilestone(result.streak);
        return (
            <div>
                {result.alreadyCounted ? (
                    <p>You have already completed your workout for today. Way to go through! 🔥 Streak: {result.streak}</p>
                ) : (
                    <p>You finished your workout! 🔥 Current Streak: {result.streak} {result.streak === 1 ? 'day' : 'days'}</p>
                )}
                {result.usedFreeze && <p>Your Streak has been saved by a freeze!</p>}
                {milestone && !result.alreadyCounted && <p>{milestone}</p>}
            </div>
        );
    }

    return (
        <button className="auth-begin-button" onClick={handleFinish}>
            Finish workout
        </button>
    );
}

export default FinishWorkout;