import { render, screen, fireEvent, act } from "@testing-library/react";
import Timer from "./Timer";

// A fake Audio so no real sound plays; we keep every one that was created
let audioInstances;

beforeEach(() => {
  audioInstances = [];
  global.Audio = function FakeAudio(src) {
    this.src = src;
    this.play = () => Promise.resolve();
    this.pause = () => {};
    audioInstances.push(this);
  };
  jest.useFakeTimers(); // also fakes Date.now, which the timer uses
});

afterEach(() => {
  jest.useRealTimers();
});

const clock = () => screen.getByRole("timer");
const button = (name) => screen.getByRole("button", { name });

// move the fake clock forward and let React update
function pass(ms) {
  act(() => {
    jest.advanceTimersByTime(ms);
  });
}

test("starts at 1:00 by default", () => {
  render(<Timer />);
  expect(clock()).toHaveTextContent("1:00");
});

test("a preset changes the time", () => {
  render(<Timer />);
  fireEvent.click(button("120s"));
  expect(clock()).toHaveTextContent("2:00");
});

test("Start counts down and Reset goes back", () => {
  render(<Timer />);
  fireEvent.click(button("Start"));
  pass(3000);
  expect(clock()).toHaveTextContent("0:57");

  fireEvent.click(button("Reset"));
  expect(clock()).toHaveTextContent("1:00");
});

test("Pause stops the countdown", () => {
  render(<Timer />);
  fireEvent.click(button("Start"));
  pass(2000);
  fireEvent.click(button("Pause"));
  pass(5000);
  expect(clock()).toHaveTextContent("0:58");
});

test("custom time is rounded down to whole seconds", () => {
  render(<Timer />);
  fireEvent.change(screen.getByLabelText("Custom seconds"), { target: { value: "1.5" } });
  fireEvent.click(button("Set Time"));
  expect(clock()).toHaveTextContent("0:01");
});

test("custom time is capped at 60 minutes", () => {
  render(<Timer />);
  fireEvent.change(screen.getByLabelText("Custom seconds"), { target: { value: "5000" } });
  fireEvent.click(button("Set Time"));
  expect(clock()).toHaveTextContent("60:00");
});

test("finishing shows the message, plays the sound and calls onComplete", () => {
  const onComplete = jest.fn();
  render(<Timer initialSeconds={2} onComplete={onComplete} />);
  fireEvent.click(button("Start"));
  pass(2500);

  expect(clock()).toHaveTextContent("0:00");
  expect(screen.getByRole("status")).toHaveTextContent("Rest complete");
  expect(audioInstances).toHaveLength(1);
  expect(onComplete).toHaveBeenCalledTimes(1);
});

test("the finish sound can be stopped with its own button", () => {
  render(<Timer initialSeconds={1} />);
  fireEvent.click(button("Start"));
  pass(1500);

  fireEvent.click(button("Stop sound"));
  expect(screen.queryByRole("button", { name: "Stop sound" })).toBeNull();
});
