import { act } from 'react';
import { createRoot } from 'react-dom/client';
import Session from './Session';
import { getSavedExercises, saveCustomExercise } from '../Utils/exerciseLibrary';

let container;
let root;
const originalApiKey = process.env.REACT_APP_RAPIDAPI_KEY;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  delete process.env.REACT_APP_RAPIDAPI_KEY;
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: { randomUUID: () => 'integration-id' } });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  if (originalApiKey === undefined) delete process.env.REACT_APP_RAPIDAPI_KEY;
  else process.env.REACT_APP_RAPIDAPI_KEY = originalApiKey;
});

test('saved exercises remain selectable when the online library fails', async () => {
  saveCustomExercise({ name: 'Plank', bodyPart: 'Waist', target: 'Abs', equipment: 'None', type: 'TimeBased' });
  process.env.REACT_APP_RAPIDAPI_KEY = 'test-key';
  const originalFetch = global.fetch;
  global.fetch = jest.fn().mockRejectedValue(new Error('Offline'));
  try {
    await act(async () => root.render(<Session />));
    expect(container.textContent).toContain('Online exercises are unavailable');
    expect(container.querySelector('.exercise-title').textContent).toBe('Plank');
    act(() => container.querySelector('.select-button').click());
    expect(container.querySelector('ol').textContent).toContain('Plank');
  } finally {
    global.fetch = originalFetch;
  }
});

function fill(id, value) {
  const input = container.querySelector(`#${id}`);
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

test('create, select, remove, and reuse a custom exercise after remount without an API', () => {
  act(() => root.render(<Session />));
  fill('custom-name', 'Band row');
  fill('custom-bodyPart', 'Back');
  fill('custom-target', 'Lats');
  fill('custom-equipment', 'Band');
  act(() => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  expect(getSavedExercises()).toHaveLength(1);
  expect(container.querySelector('.exercise-title').textContent).toBe('Band row');
  act(() => container.querySelector('.select-button').click());
  expect(container.querySelector('ol').textContent).toContain('Band row');
  act(() => container.querySelector('button[aria-label="Remove Band row from routine"]').click());
  expect(container.querySelector('ol')).toBeNull();
  expect(getSavedExercises()).toHaveLength(1);
  act(() => root.unmount());
  root = createRoot(container);
  act(() => root.render(<Session />));
  expect(container.querySelector('.exercise-title').textContent).toBe('Band row');
  act(() => container.querySelector('.select-button').click());
  expect(container.querySelector('ol').textContent).toContain('Band row');
});
