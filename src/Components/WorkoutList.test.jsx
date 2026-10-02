import { act } from 'react';
import { createRoot } from 'react-dom/client';
import WorkoutList from './WorkoutList';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const originalKey = process.env.REACT_APP_RAPIDAPI_KEY;
let container;
let root;

const sampleExercises = [
    { id: '0001', name: '3/4 sit-up', bodyPart: 'waist', target: 'abs', equipment: 'body weight' },
    { id: '0002', name: 'push-up', bodyPart: 'chest', target: 'pectorals', equipment: 'body weight' },
    { id: '0003', name: 'pull-up', bodyPart: 'back', target: 'lats', equipment: 'body weight' }
];

beforeEach(() => {
    process.env.REACT_APP_RAPIDAPI_KEY = 'test-key';
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
});

afterEach(() => {
    act(() => root.unmount());
    container.remove();
    delete global.fetch;
    if (originalKey === undefined) {
        delete process.env.REACT_APP_RAPIDAPI_KEY;
    } else {
        process.env.REACT_APP_RAPIDAPI_KEY = originalKey;
    }
});

test('shows a setup message and does not call the API when the key is missing', async () => {
    delete process.env.REACT_APP_RAPIDAPI_KEY;
    global.fetch = jest.fn(() =>
        Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(sampleExercises) })
    );

    await act(async () => {
        root.render(<WorkoutList />);
    });

    expect(container).toHaveTextContent('Exercise library needs a RapidAPI key.');
    expect(global.fetch).not.toHaveBeenCalled();
});

test('treats a blank key as missing', async () => {
    process.env.REACT_APP_RAPIDAPI_KEY = '   ';
    global.fetch = jest.fn(() =>
        Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(sampleExercises) })
    );

    await act(async () => {
        root.render(<WorkoutList />);
    });

    expect(container).toHaveTextContent('Exercise library needs a RapidAPI key.');
    expect(global.fetch).not.toHaveBeenCalled();
});

test('shows an invalid key message on a 401 response', async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({ message: 'Invalid API key.' }) })
    );

    await act(async () => {
        root.render(<WorkoutList />);
    });

    expect(container).toHaveTextContent('Your RapidAPI key is invalid. Check subscription.');
});

test('shows an invalid key message on a 403 response', async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({ ok: false, status: 403, json: () => Promise.resolve({ message: 'You are not subscribed to this API.' }) })
    );

    await act(async () => {
        root.render(<WorkoutList />);
    });

    expect(container).toHaveTextContent('Your RapidAPI key is invalid.Check subscription.');
});

test('shows a connection message when the request fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new TypeError('Failed to fetch')));

    await act(async () => {
        root.render(<WorkoutList />);
    });

    expect(container).toHaveTextContent("Couldn't load exercises. Check your connection and try again.");
});

test('sends the key to ExerciseDB and lists the exercises it returns', async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(sampleExercises) })
    );

    await act(async () => {
        root.render(<WorkoutList />);
    });

    expect(global.fetch).toHaveBeenCalledWith(
        'https://exercisedb.p.rapidapi.com/exercises?limit=100',
        expect.objectContaining({
            headers: expect.objectContaining({ 'X-RapidAPI-Key': 'test-key' })
        })
    );
    const titles = Array.from(container.querySelectorAll('.exercise-title')).map((title) => title.textContent);
    expect(titles).toEqual(['3/4 sit-up', 'push-up', 'pull-up']);
});

test('search filters exercises by name', async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(sampleExercises) })
    );
    await act(async () => {
        root.render(<WorkoutList />);
    });

    const searchBar = container.querySelector('.search-bar');
    const setInputValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    await act(async () => {
        setInputValue.call(searchBar, 'PUSH');
        searchBar.dispatchEvent(new Event('input', { bubbles: true }));
    });

    const titles = Array.from(container.querySelectorAll('.exercise-title')).map((title) => title.textContent);
    expect(titles).toEqual(['push-up']);
});

test('muscle group filter only shows exercises for that body part', async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(sampleExercises) })
    );
    await act(async () => {
        root.render(<WorkoutList />);
    });

    const dropdown = container.querySelector('.muscle-dropdown');
    const setSelectValue = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set;
    await act(async () => {
        setSelectValue.call(dropdown, 'back');
        dropdown.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const titles = Array.from(container.querySelectorAll('.exercise-title')).map((title) => title.textContent);
    expect(titles).toEqual(['pull-up']);
});

test('shows a no results message when nothing matches', async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(sampleExercises) })
    );
    await act(async () => {
        root.render(<WorkoutList />);
    });

    const searchBar = container.querySelector('.search-bar');
    const setInputValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    await act(async () => {
        setInputValue.call(searchBar, 'deadlift');
        searchBar.dispatchEvent(new Event('input', { bubbles: true }));
    });

    expect(container.querySelectorAll('.exercise-title')).toHaveLength(0);
    expect(container).toHaveTextContent('No exercises match your selection.');
});
