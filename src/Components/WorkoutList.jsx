// generated list of workouts based on relevance to user, muscle group or frequently used
import React, { useState, useEffect, useMemo } from 'react';

const WorkoutList = ({ onSelectExercise, userFavorites = [] }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matchingExercises, setMatchingExercises] = useState([]);

  //filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [viewTab, setViewTab] = useState('all'); // 'all', 'frequently_used', 'relevant'

  //track frequently used exercises locally or via props
  const [frequentlyUsedIds, setFrequentlyUsedIds] = useState(userFavorites);

  //Variables for adding custom exercises
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customBodyPart, setCustomBodyPart] = useState('');
  const [customTarget, setCustomTarget] = useState('');
  const [customEquipment, setCustomEquipment] = useState('');
  const [formError, setFormError] = useState('');

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
        setExercises(data);
      } catch (err) {
        setError(err.message);
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

  const handleSelect = (exercise) => {
    //dynamically add to frequently used list when selected
    if (!frequentlyUsedIds.includes(exercise.id)) {
      setFrequentlyUsedIds((prev) => [...prev, exercise.id]);
    }
    if (onSelectExercise) {
      onSelectExercise(exercise);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setCustomName('');
    setCustomBodyPart('');
    setCustomTarget('');
    setCustomEquipment('');
    setFormError('');
  }

  const handleAddExerciseSubmission = (event) => {
    //logic to add a custom exercise
    setIsModalOpen(true);
    event.preventDefault();

    const newExerciseObj = {
      id: Date.now(),
      name: customName,
      bodyPart: customBodyPart,
      target: customTarget,
      equipment: customEquipment,
    };

    if (!newExerciseObj.name) {
      alert("Please enter a valid exercise name.");
      return;
    }

    if (!newExerciseObj.bodyPart) {
      newExerciseObj.bodyPart = "Unknown";
    }

    if (!newExerciseObj.target) {
      newExerciseObj.target = "Unknown";
    }

    if (!newExerciseObj.equipment) {
      newExerciseObj.equipment = "Unknown";
    }

    setExercises((prev) => [...prev, newExerciseObj]);
    handleSelect(newExerciseObj);
    setIsModalOpen(false);
  }

  function isSimilar(word1, word2) {
    if (!word1 || !word2) return false;
    const searchWords = word2.toLowerCase().split(/\s+/).filter(Boolean);
    const exerciseName_words = word1.toLowerCase().split(/\s+/).filter(Boolean);
    return searchWords.some((word) => exerciseName_words.includes(word));
  }


  const searchVariants = () => {
    setMatchingExercises([]);
    if (!customName) return;

    const matches = exercises.filter((exercise) =>
      isSimilar(exercise.name.toLowerCase(), customName.toLowerCase())
    );

    setMatchingExercises(matches);
  }

  const populateExerciseAdder = (exercise) => {
    setCustomName(exercise.name);
    setCustomBodyPart(exercise.bodyPart);
    setCustomTarget(exercise.target);
    setCustomEquipment(exercise.equipment);
  }

  if (loading) return <div className="loading-spinner">Loading exercise library...</div>;
  if (error) return <div className="error-message">Error fetching exercises: {error}</div>;

  return (
    <div className="workout-list-container">
      <h2>Workout Exercises</h2>

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
      <div className="add-exercise">
        <button type="button" className="add-button" onClick={handleOpenModal}>
          Add Custom Exercise
        </button>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setIsModalOpen(false)}>&times;</span>
            <form onSubmit={handleAddExerciseSubmission}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                <label htmlFor="customName">Exercise Name:</label>
                <input type="text" id="customName" value={customName} onChange={(e) => setCustomName(e.target.value)} />
                <button type="button" onClick={() => searchVariants()}>Search Variants</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
              <label htmlFor="customBodyPart">Body Part:</label>
              <input type="text" id="customBodyPart" value={customBodyPart} onChange={(e) => setCustomBodyPart(e.target.value)} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
              <label htmlFor="customTarget">Target Muscle:</label>
              <input type="text" id="customTarget" value={customTarget} onChange={(e) => setCustomTarget(e.target.value)} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
              <label htmlFor="customEquipment">Equipment:</label>
              <input type="text" id="customEquipment" value={customEquipment} onChange={(e) => setCustomEquipment(e.target.value)} />
              </div>
              <button type="submit">Add Exercise</button>

              <div className="matching-exercises" >
                <p>Variant Exercises</p>
                {matchingExercises.length === 0 ? (
                  <p className="no-results">No exercises match your selection.</p>
                ) : (
                  matchingExercises.map((exercise) => (
                    <div key={exercise.id} className="exercise-card">
                      <p> {exercise.name} </p>
                      <button type="button" onClick={() => populateExerciseAdder(exercise)}>Select</button>
                    </div>
                  ))
                )}
              </div>
            </form>
          </div>
        </div>
      )}

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
                {'Muscle: '}
                <span className="badge muscle">{exercise.bodyPart}</span>
                {'\nTarget: '}
                <span className="badge target">{exercise.target}</span>
                {'\nEquipment: '}
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