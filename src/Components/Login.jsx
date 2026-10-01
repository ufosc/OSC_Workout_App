import React, { useState } from 'react';
import '../Pages/Home.css';
import {
    recordLogin,
    getStreak,
    getBestStreak,
    getFreezes,
    getMilestone,
    getCurrentUser,
    setCurrentUser,
    clearCurrentUser
} from '../Utils/streak';

function Login() {
    const [user, setUser] = useState(getCurrentUser());
    const [username, setUsername] = useState('');
    const [usedFreeze, setUsedFreeze] = useState(false);

    const handleLogin = (event) => {
        event.preventDefault();
        const name = username.trim();
        if (!name) return;

        // logging in records today's entry and bumps the streak
        const result = recordLogin(name);
        setUsedFreeze(Boolean(result.usedFreeze));
        setCurrentUser(name);
        setUser(name);
        setUsername('');
    };

    const handleLogout = () => {
        clearCurrentUser();
        setUser(null);
        setUsedFreeze(false);
    };

    if (user) {
        const streak = getStreak(user);
        const best = getBestStreak(user);
        const freezes = getFreezes(user);
        const milestone = getMilestone(streak);

        return (
            <div className="auth-root">
                <h2>Welcome, {user}</h2>
                <p>🔥 Login streak: {streak} {streak === 1 ? 'day' : 'days'}</p>
                <p>🏆 Best streak: {best} {best === 1 ? 'day' : 'days'}</p>
                <p>❄️ Freezes: {freezes}</p>
                {usedFreeze && <p>You missed a day, so a freeze saved your streak.</p>}
                {milestone && <p>{milestone}</p>}
                <button className="auth-begin-button" onClick={handleLogout}>Log out</button>
            </div>
        );
    }

    return (
        <div className="auth-root">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />
                <button className="auth-begin-button" type="submit">Log in</button>
            </form>
        </div>
    );
}

export default Login;
