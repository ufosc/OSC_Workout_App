import { act } from "react";
import { createRoot } from "react-dom/client";
import Timer, { formatTime } from "./Timer";

describe("Timer", () => {
  let container;
  let root;
  let audio;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    global.IS_REACT_ACT_ENVIRONMENT = true;

    audio = {
      currentTime: 0,
      pause: jest.fn(),
      play: jest.fn().mockResolvedValue(undefined),
      volume: 0,
    };
    global.Audio = jest.fn(() => audio);
    Object.defineProperty(navigator, "vibrate", {
      configurable: true,
      value: jest.fn(),
    });

    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    jest.useRealTimers();
    delete global.IS_REACT_ACT_ENVIRONMENT;
  });

  function renderTimer(props = {}) {
    act(() => root.render(<Timer {...props} />));
  }

  function getButton(label) {
    return [...container.querySelectorAll("button")].find(
      (button) => button.textContent === label
    );
  }

  function click(element) {
    act(() => element.dispatchEvent(new MouseEvent("click", { bubbles: true })));
  }

  test("formats durations and selects a preset", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(90)).toBe("1:30");

    renderTimer();
    expect(container.querySelector('[role="timer"]')).toHaveTextContent("1:00");

    click(getButton("1:30"));
    expect(container.querySelector('[role="timer"]')).toHaveTextContent("1:30");
    expect(getButton("1:30")).toHaveAttribute("aria-pressed", "true");
  });

  test("counts down, alerts once, and calls onComplete", () => {
    const onComplete = jest.fn();
    renderTimer({ initialSeconds: 2, onComplete });

    click(getButton("Start"));
    expect(container).toHaveTextContent("Running");

    act(() => jest.advanceTimersByTime(1000));
    expect(container.querySelector('[role="timer"]')).toHaveTextContent("0:01");

    act(() => jest.advanceTimersByTime(1000));
    expect(container.querySelector('[role="timer"]')).toHaveTextContent("0:00");
    expect(container.querySelector('[role="status"]')).toHaveTextContent(
      "Rest complete. Your next set is ready."
    );
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(navigator.vibrate).toHaveBeenCalledWith([200, 100, 200]);
    expect(audio.play).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(2000));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  test("pauses without losing time and can add thirty seconds", () => {
    renderTimer({ initialSeconds: 10 });

    click(getButton("Start"));
    act(() => jest.advanceTimersByTime(2000));
    click(getButton("Pause"));
    expect(container.querySelector('[role="timer"]')).toHaveTextContent("0:08");

    act(() => jest.advanceTimersByTime(5000));
    expect(container.querySelector('[role="timer"]')).toHaveTextContent("0:08");

    click(getButton("+30s"));
    expect(container.querySelector('[role="timer"]')).toHaveTextContent("0:38");
  });

  test("rejects invalid custom durations", () => {
    renderTimer();
    const input = container.querySelector("#custom-rest-time");
    const valueSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    ).set;

    act(() => {
      valueSetter.call(input, "0");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    click(getButton("Set time"));

    expect(container.querySelector('[role="alert"]')).toHaveTextContent(
      "Enter a whole number greater than zero."
    );
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
});
