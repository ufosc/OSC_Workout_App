import { useEffect, useState } from 'react';

function Timer({ initialSeconds = 60 }) {
	const startingSeconds = Number.isFinite(initialSeconds)
		? Math.max(0, Math.floor(initialSeconds))
		: 60;
	const [restSeconds, setRestSeconds] = useState(startingSeconds);
	const [seconds, setSeconds] = useState(startingSeconds);
	const [isRunning, setIsRunning] = useState(false);

	useEffect(() => {
		if (!isRunning || seconds === 0) {
			return undefined;
		}

		const intervalId = window.setInterval(() => {
			setSeconds((currentSeconds) => Math.max(0, currentSeconds - 1));
		}, 1000);

		return () => window.clearInterval(intervalId);
	}, [isRunning, seconds]);

	useEffect(() => {
		if (seconds === 0) {
			setIsRunning(false);
		}
	}, [seconds]);

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	const formattedTime = `${String(minutes).padStart(2, '0')}:${String(
		remainingSeconds,
	).padStart(2, '0')}`;

	function resetTimer() {
		setIsRunning(false);
		setSeconds(restSeconds);
	}

	function applyRestTime() {
		resetTimer();
	}

	return (
		<section aria-label="Countdown timer">
			<label htmlFor="rest-time">Rest time (seconds)</label>
			<input
				id="rest-time"
				type="number"
				min="0"
				step="1"
				value={restSeconds}
				onChange={(event) => {
					const value = Number(event.target.value);
					if (Number.isFinite(value)) {
						setRestSeconds(Math.max(0, Math.floor(value)));
					}
				}}
			/>
			<button type="button" onClick={applyRestTime}>
				Apply Rest Time
			</button>
			<p aria-live="polite">{formattedTime}</p>
			<button
				type="button"
				onClick={() => setIsRunning((running) => !running)}
				disabled={seconds === 0}
			>
				{isRunning ? 'Pause' : 'Start'}
			</button>
			<button type="button" onClick={resetTimer}>
				Reset
			</button>
		</section>
	);
}

export default Timer;
