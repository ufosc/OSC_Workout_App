// Calendar page (issue #32): shows one month at a time and marks the days a workout was done...

import React, { useMemo, useRef, useState } from 'react';
import '../App.css';
import './Calendar.css';
import { toDayKey } from '../Utils/streak';
import { getMonthCells, getWorkoutDays, shiftMonth } from '../Utils/calendar';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SWIPE_THRESHOLD = 50;

function Calendar({ workoutDays }) {
    const today = new Date();
    const todayKey = toDayKey(today);

    // the month on screen, stored as the 1st of that month
    const [viewMonth, setViewMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedKey, setSelectedKey] = useState(null);
    const touchStart = useRef(null);

    // a Set makes "was there a workout on this day?" a quick lookup for every cell
    const workoutSet = useMemo(() => new Set(workoutDays ?? getWorkoutDays()), [workoutDays]);
    const cells = getMonthCells(viewMonth.getFullYear(), viewMonth.getMonth());
    const monthLabel = viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    function changeMonth(offset) {
        setViewMonth((current) => shiftMonth(current, offset));
        setSelectedKey(null);
    }

    function goToToday() {
        setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1));
        setSelectedKey(todayKey);
    }

    function handleTouchStart(event) {
        const touch = event.touches[0];
        touchStart.current = { x: touch.clientX, y: touch.clientY };
    }

    function handleTouchEnd(event) {
        if (!touchStart.current) {
            return;
        }
        const touch = event.changedTouches[0];
        const dx = touch.clientX - touchStart.current.x;
        const dy = touch.clientY - touchStart.current.y;
        touchStart.current = null;

        // ignore short taps and most of the vertical swipes
        if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) {
            return;
        }
        // swapping to change the month
        changeMonth(dx < 0 ? 1 : -1);
    }

    function handleDayClick(dayKey) {
        setSelectedKey(dayKey);
        // Here the app could open the day's workout details, but for now it just shows the status in the footer.
    }

    const selectedDate = selectedKey ? new Date(`${selectedKey}T00:00:00`) : null;

    return (
        <div className="calendar-root">
            <h1 className="neon-title text">Calendar</h1>

            <div className="calendar-card" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                <div className="calendar-header">
                    <button className="calendar-nav" onClick={() => changeMonth(-1)} aria-label="Previous month">
                        ‹
                    </button>
                    <h2 className="calendar-month text" aria-live="polite">{monthLabel}</h2>
                    <button className="calendar-nav" onClick={() => changeMonth(1)} aria-label="Next month">
                        ›
                    </button>
                </div>

                <div className="calendar-grid">
                    {WEEKDAYS.map((weekday) => (
                        <div key={weekday} className="calendar-weekday">{weekday}</div>
                    ))}

                    {cells.map((date, index) => {
                        if (!date) {
                            return <div key={`blank-${index}`} className="calendar-day blank" />;
                        }
                        const dayKey = toDayKey(date);
                        const hasWorkout = workoutSet.has(dayKey);
                        const classes = ['calendar-day'];
                        if (hasWorkout) classes.push('workout');
                        if (dayKey === todayKey) classes.push('today');
                        if (dayKey === selectedKey) classes.push('selected');

                        return (
                            <button
                                key={dayKey}
                                className={classes.join(' ')}
                                onClick={() => handleDayClick(dayKey)}
                                aria-pressed={dayKey === selectedKey}
                                aria-label={`${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}${hasWorkout ? ', workout done' : ''}`}
                            >
                                {date.getDate()}
                                {hasWorkout && <span className="workout-dot" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="calendar-footer">
                <p className="calendar-selected">
                    {selectedDate
                        ? `${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}: ${workoutSet.has(selectedKey) ? 'workout done 💪' : 'no workout logged'}`
                        : 'Tap a day to see it'}
                </p>
                <button className="calendar-today" onClick={goToToday}>Today</button>
            </div>
        </div>
    );
}

export default Calendar;
