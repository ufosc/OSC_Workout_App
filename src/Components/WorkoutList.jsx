// generated list of workouts based on relevance to user, muscle group or frequently used
import React, {useState, useEffect, useMemo} from 'react';
import CustomExerciseForm from './CustomExerciseForm';
import { getSavedExercises, rememberExercise, EXERCISE_TYPES, EXERCISE_LIBRARY_KEY } from '../Utils/exerciseLibrary';
import './WorkoutList.css';

const WorkoutList = ({onSelectExercise, userFavorites = []}) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedExercises, setSavedExercises] = useState(getSavedExercises);
  const [storageError, setStorageError] = useState('');
  const library = useMemo(() => [
    ...savedExercises,
    ...exercises.filter(exercise => !savedExercises.some(saved => saved.id === exercise.id)),
  ], [savedExercises, exercises]);

  //filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [viewTab, setViewTab] = useState('all'); // 'all', 'saved', 'frequently_used'

  //track frequently used exercises locally or via props
  const [frequentlyUsedIds, setFrequentlyUsedIds] = useState(userFavorites);

  useEffect(() => {
    const controller = new AbortController();
    const fetchExercises = async () => {
      if (!process.env.REACT_APP_RAPIDAPI_KEY) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // ExerciseDB API via RapidAPI or local Kaggle dataset JSON
        const response = await fetch('https://exercisedb.p.rapidapi.com/exercises?limit=100', {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY || '',
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Unexpected exercise library response');
        setExercises(data);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const refresh = event => {
      if (event.key === EXERCISE_LIBRARY_KEY || event.key === null) setSavedExercises(getSavedExercises());
    };
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, []);

  //Extract unique muscle groups/body parts dynamically
  const muscleGroups = useMemo(() => {
    const groups = new Set(library.map((ex) => ex.bodyPart?.toLowerCase()).filter(Boolean));
    return ['all', ...Array.from(groups)];
  }, [library]);

  //filter logic based on search, selected muscle group, and view tab
  const filteredExercises = useMemo(() => {
    return library.filter((exercise) => {
      if (viewTab === 'saved' && !savedExercises.some(saved => saved.id === exercise.id)) return false;
      //1. Frequently Used filter
      if (viewTab === 'frequently_used' && !frequentlyUsedIds.includes(exercise.id)) {
        return false;
      }

      //2. Muscle Group filter
      const matchesMuscle =
        selectedMuscle === 'all' ||
        exercise.bodyPart?.toLowerCase() === selectedMuscle.toLowerCase();

      //3. Search query filter
      const matchesSearch = exercise.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesMuscle && matchesSearch;
    });
  }, [library, savedExercises, viewTab, selectedMuscle, searchTerm, frequentlyUsedIds]);

  const handleSelect = (exercise) => {
    setStorageError('');
    try {
      rememberExercise(exercise);
      setSavedExercises(getSavedExercises());
    } catch (err) {
      setStorageError(err.message);
      return;
    }
    //dynamically add to frequently used list when selected
    if (!frequentlyUsedIds.includes(exercise.id)) {
      setFrequentlyUsedIds((prev) => [...prev, exercise.id]);
    }
    if (onSelectExercise) {
      onSelectExercise(exercise);
    }
  };

  return (
    <div className="workout-list-container">
      <h2>Workout Exercises</h2>
      <CustomExerciseForm onCreated={() => {
        setSavedExercises(getSavedExercises());
        setViewTab('saved');
        setSearchTerm('');
        setSelectedMuscle('all');
      }} />
      {loading && <p role="status">Loading online exercise library...</p>}
      {error && <p role="status">Online exercises are unavailable. You can still create and use saved exercises.</p>}
      {storageError && <p role="alert">{storageError}</p>}

      {/* View Tabs: All, Frequently Used */}
      <div className="tab-navigation">
        <button aria-pressed={viewTab === 'saved'} onClick={() => setViewTab('saved')}>
          Saved Exercises ({savedExercises.length})
        </button>
        <button
          aria-pressed={viewTab === 'all'}
          className={viewTab === 'all' ? 'tab active' : 'tab'}
          onClick={() => setViewTab('all')}
        >
          All Exercises
        </button>
        <button
          aria-pressed={viewTab === 'frequently_used'}
          className={viewTab === 'frequently_used' ? 'tab active' : 'tab'}
          onClick={() => setViewTab('frequently_used')}
        >
          Frequently Used ({frequentlyUsedIds.length})
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="filter-controls">
        <input
          type="text"
          aria-label="Search exercises by name"
          placeholder="Search workouts by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <select
          value={selectedMuscle}
          aria-label="Filter by body part"
          onChange={(e) => setSelectedMuscle(e.target.value)}
          className="muscle-dropdown"
        >
          <option value="all">Filter by Muscle Group</option>
          {muscleGroups
            .filter((m) => m !== 'all')
            .map((muscle) => (
              <option key={muscle} value={muscle}>
                {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
              </option>
            ))}
        </select>
      </div>

      {/*Exercise Grid Display */}
      <div className="exercise-grid">
        {filteredExercises.length === 0 ? (
          <p className="no-results">No exercises match your selection.</p>
        ) : (
          filteredExercises.map((exercise) => (
            <div key={exercise.id} className="exercise-card">
              {exercise.gifUrl && (
                <img
                  src={exercise.gifUrl}
                  alt={exercise.name}
                  loading="lazy"
                  className="exercise-image"
                />
              )}
              <h3 className="exercise-title">{exercise.name}</h3>
              {exercise.isCustom && <span>Custom exercise</span>}
              {exercise.type && <p>{EXERCISE_TYPES[exercise.type] || exercise.type}</p>}
              {exercise.notes && <p>{exercise.notes}</p>}
              <div className="exercise-meta">
                <span className="badge muscle">{exercise.bodyPart}</span>
                <span className="badge target">{exercise.target}</span>
                <span className="badge equipment">{exercise.equipment}</span>
              </div>

              <button
                onClick={() => handleSelect(exercise)}
                className="select-button"
              >
                Add to Routine
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkoutList;
