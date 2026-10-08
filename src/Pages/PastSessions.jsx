import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import './Home.css';
import './PastSessions.css';
import {
  toDayKey,
  getSessionHistory,
  saveSessionToHistory,
  deleteSessionFromHistory,
  groupSessionsByDay,
  getSessionDisplayName,
  getSessionStats,
  getMonthGrid
} from '../Utils/sessionHistory';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildSampleSession(daysAgo, name, exercises) {
  const start = new Date();
  start.setDate(start.getDate() - daysAgo);
  start.setHours(17, 30, 0, 0);
  const end = new Date(start.getTime() + 50 * 60000);
  return {
    sessionName: name,
    date: start.toISOString(),
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    exerciseList: exercises
  };
}

function addSampleSessions() {
  saveSessionToHistory(buildSampleSession(1, 'Push Day', [
    { exerciseName: 'Bench Press', setList: [{ weight: 135, reps: 10 }, { weight: 155, reps: 8 }, { weight: 175, reps: 5 }] },
    { exerciseName: 'Overhead Press', setList: [{ weight: 95, reps: 8 }, { weight: 95, reps: 8 }] }
  ]));
  saveSessionToHistory(buildSampleSession(3, 'Leg Day', [
    { exerciseName: 'Squat', setList: [{ weight: 225, reps: 5 }, { weight: 245, reps: 5 }, { weight: 265, reps: 3 }] },
    { exerciseName: 'Romanian Deadlift', setList: [{ weight: 185, reps: 10 }, { weight: 185, reps: 10 }] }
  ]));
  saveSessionToHistory(buildSampleSession(6, 'Pull Day', [
    { exerciseName: 'Pull Ups', setList: [{ weight: 0, reps: 12 }, { weight: 0, reps: 10 }] },
    { exerciseName: 'Barbell Row', setList: [{ weight: 155, reps: 8 }, { weight: 155, reps: 8 }] }
  ]));
}

function formatSet(set) {
  if (set.type === 'TimeBased' || (!set.reps && set.time)) return `${set.time}s`;
  if (!set.weight) return `${set.reps} reps`;
  return `${set.weight} lb × ${set.reps}`;
}

function formatTime(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function PastSessions() {
  const navigate = useNavigate();
  const [history, setHistory] = useState(getSessionHistory);
  const latest = history[0] ? new Date(history[0].date) : new Date();
  const [viewMonth, setViewMonth] = useState({ year: latest.getFullYear(), month: latest.getMonth() });
  const [selectedDay, setSelectedDay] = useState(history[0] ? toDayKey(history[0].date) : null);

  const sessionsByDay = useMemo(() => groupSessionsByDay(history), [history]);
  const grid = useMemo(() => getMonthGrid(viewMonth.year, viewMonth.month), [viewMonth]);
  const todayKey = toDayKey(new Date());
  const monthLabel = new Date(viewMonth.year, viewMonth.month, 1)
    .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const selectedSessions = selectedDay ? sessionsByDay[selectedDay] || [] : [];

  const changeMonth = (offset) => {
    const next = new Date(viewMonth.year, viewMonth.month + offset, 1);
    setViewMonth({ year: next.getFullYear(), month: next.getMonth() });
  };

  const handleDelete = (id) => {
    setHistory(deleteSessionFromHistory(id));
  };

  const handleAddSamples = () => {
    addSampleSessions();
    const updated = getSessionHistory();
    setHistory(updated);
    if (updated[0]) {
      const newest = new Date(updated[0].date);
      setViewMonth({ year: newest.getFullYear(), month: newest.getMonth() });
      setSelectedDay(toDayKey(newest));
    }
  };

  return (
    <div className="home-root">
      <header className="home-header">
        <h1 className="neon-title text">Previous Workouts</h1>
        <p className="neon-subtitle text">
          {history.length} {history.length === 1 ? 'session' : 'sessions'} logged
        </p>
      </header>

      <main className="history-main">
        <section className="links-panel history-calendar" aria-label="Workout calendar">
          <div className="calendar-header">
            <button type="button" className="calendar-nav" onClick={() => changeMonth(-1)} aria-label="Previous month">‹</button>
            <h2 className="calendar-title">{monthLabel}</h2>
            <button type="button" className="calendar-nav" onClick={() => changeMonth(1)} aria-label="Next month">›</button>
          </div>

          <div className="calendar-grid" role="grid">
            {WEEKDAYS.map((day) => (
              <div key={day} className="calendar-weekday" role="columnheader">{day}</div>
            ))}
            {grid.map((date, index) => {
              if (!date) return <div key={`empty-${index}`} className="calendar-cell empty" />;
              const key = toDayKey(date);
              const count = (sessionsByDay[key] || []).length;
              const classes = [
                'calendar-cell',
                count > 0 ? 'has-workout' : '',
                key === selectedDay ? 'selected' : '',
                key === todayKey ? 'today' : ''
              ].filter(Boolean).join(' ');
              return (
                <button
                  key={key}
                  type="button"
                  className={classes}
                  onClick={() => setSelectedDay(key)}
                  aria-pressed={key === selectedDay}
                  aria-label={`${date.toDateString()}${count ? `, ${count} workout${count > 1 ? 's' : ''}` : ''}`}
                >
                  <span className="calendar-day-number">{date.getDate()}</span>
                  {count > 0 && <span className="calendar-dot" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </section>

        <section className="links-panel history-details" aria-live="polite">
          {history.length === 0 ? (
            <div className="history-empty">
              <p>No workouts logged yet. Finish a workout session and it will show up here.</p>
              <button type="button" className="auth-begin-button" onClick={() => navigate('/session')}>
                Begin Workout
              </button>
              {process.env.NODE_ENV === 'development' && (
                <button type="button" className="history-secondary-button" onClick={handleAddSamples}>
                  Add sample workouts
                </button>
              )}
            </div>
          ) : !selectedDay ? (
            <p className="history-empty">Pick a day on the calendar to see that workout.</p>
          ) : selectedSessions.length === 0 ? (
            <p className="history-empty">
              No workout on {new Date(`${selectedDay}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.
            </p>
          ) : (
            selectedSessions.map((entry) => {
              const stats = getSessionStats(entry);
              const start = formatTime(entry.startTime);
              const end = formatTime(entry.endTime);
              return (
                <article key={entry.id} className="session-card">
                  <div className="session-card-header">
                    <div>
                      <h3 className="session-name">{getSessionDisplayName(entry)}</h3>
                      <p className="session-meta">
                        {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        {start && end ? ` · ${start} – ${end}` : ''}
                        {entry.durationMinutes ? ` · ${entry.durationMinutes} min` : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="session-delete"
                      onClick={() => handleDelete(entry.id)}
                      aria-label={`Delete ${getSessionDisplayName(entry)}`}
                    >
                      Delete
                    </button>
                  </div>

                  <div className="session-stats">
                    <span>{stats.exerciseCount} {stats.exerciseCount === 1 ? 'exercise' : 'exercises'}</span>
                    <span>{stats.setCount} {stats.setCount === 1 ? 'set' : 'sets'}</span>
                    <span>{stats.totalVolume.toLocaleString()} lb volume</span>
                  </div>

                  <ul className="session-exercises">
                    {entry.exercises.map((exercise, index) => (
                      <li key={`${exercise.name}-${index}`}>
                        <span className="exercise-name">{exercise.name}</span>
                        <span className="exercise-sets">
                          {exercise.sets.length ? exercise.sets.map(formatSet).join(', ') : 'No sets logged'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}

export default PastSessions;
