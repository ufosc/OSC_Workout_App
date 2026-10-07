// generated list of workouts based on relevance to user, muscle group or frequently used
import React, {useState, useEffect, useMemo} from 'react';
import CreateExercise from './CreateExercise';

const WorkoutList = ({onSelectExercise, userFavorites = []}) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [viewTab, setViewTab] = useState('all'); // 'all', 'frequently_used', 'relevant'

  //track frequently used exercises locally or via props
  const [frequentlyUsedIds, setFrequentlyUsedIds] = useState(userFavorites);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        // ExerciseDB API via RapidAPI or local Kaggle dataset JSON
        const response = await fetch('https://exercisedb.p.rapidapi.com/exercises?limit=100', {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY || '',
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const customExercises = JSON.parse(localStorage.getItem('customExercises')) || [];
        
        setExercises([...data, ...customExercises]);

      } catch (err) {
        setError(err.message);

        const customExercises = JSON.parse(localStorage.getItem('customExercises')) || [];

        setExercises(customExercises);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  //Extract unique muscle groups/body parts dynamically
  const muscleGroups = useMemo(() => {
    const groups = new Set(exercises.map((ex) => ex.bodyPart).filter(Boolean));
    return ['all', ...Array.from(groups)];
  }, [exercises]);

  //filter logic based on search, selected muscle group, and view tab
  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
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
  }, [exercises, viewTab, selectedMuscle, searchTerm, frequentlyUsedIds]);

  const handleExerciseCreated = (newExercise) => {
  setExercises((prevExercises) => [
      newExercise,
      ...prevExercises
    ]);
  };

  const handleSelect = (exercise) => {
    //dynamically add to frequently used list when selected
    if (!frequentlyUsedIds.includes(exercise.id)) {
      setFrequentlyUsedIds((prev) => [...prev, exercise.id]);
    }
    if (onSelectExercise) {
      onSelectExercise(exercise);
    }
  };

  if (loading) return <div className="loading-spinner">Loading exercise library...</div>;

  return (
    <div className="workout-list-container">
      <h2>Workout Exercises</h2>

      {error && (
        <div className="error-message">
          Exercise library unavailable: {error}
        </div>
      )}

      <CreateExercise onExerciseCreated={handleExerciseCreated} />

      {/* View Tabs: All, Frequently Used */}
      <div className="tab-navigation">
        <button
          className={viewTab === 'all' ? 'tab active' : 'tab'}
          onClick={() => setViewTab('all')}
        >
          All Exercises
        </button>
        <button
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
          placeholder="Search workouts by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <select
          value={selectedMuscle}
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