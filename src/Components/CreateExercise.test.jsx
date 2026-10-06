import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import CreateExercise from './CreateExercise';
import { loadCustomExercises } from '../Utils/customExercises';

// tell React we're in a test so act() works
global.IS_REACT_ACT_ENVIRONMENT = true;

// a fake exercise that looks like one from the ExerciseDB API
const squat = { id: '0043', name: 'barbell full squat', bodyPart: 'upper legs', target: 'glutes', equipment: 'barbell', secondaryMuscles: ['quadriceps'] };

let container;
let root;

// fresh page and empty storage before every test
beforeEach(() => {
    localStorage.clear();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
});

// clean up the page after every test
afterEach(() => {
    act(() => root.unmount());
    container.remove();
});

// helper to type into a field like a real user
function typeInto(element, value) {
    const proto = element.tagName === 'SELECT' ? window.HTMLSelectElement.prototype : window.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(element, value);
    element.dispatchEvent(new Event(element.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
}

// helper to find the Create button
const createButton = () => [...container.querySelectorAll('button')].find((b) => b.textContent === 'Create Exercise');

test('shows existing exercises in the variant dropdown', () => {
    act(() => root.render(<CreateExercise existingExercises={[squat]} />));
    const options = [...container.querySelectorAll('select[name="variantOfId"] option')].map((o) => o.textContent);
    expect(options).toContain('barbell full squat');
});

test('shows an error when the name is empty', () => {
    act(() => root.render(<CreateExercise existingExercises={[squat]} />));
    act(() => createButton().click());
    expect(container.querySelector('[role="alert"]').textContent).toBe('Exercise name is required.');
});

test('creates a variant and passes it back', () => {
    const onCreated = jest.fn();
    act(() => root.render(<CreateExercise existingExercises={[squat]} onCreated={onCreated} />));

    act(() => typeInto(container.querySelector('input[name="name"]'), 'paused squat'));
    act(() => typeInto(container.querySelector('select[name="variantOfId"]'), '0043'));
    act(() => createButton().click());

    const created = onCreated.mock.calls[0][0];
    expect(created.name).toBe('paused squat');
    expect(created.variantOfName).toBe('barbell full squat');
    expect(created.target).toBe('glutes');
    expect(loadCustomExercises()).toHaveLength(1);
});
