

class Exercise {
    constructor(exerciseID = "", exerciseName = "") {
        this.exerciseID = exerciseID;
        this.exerciseName = exerciseName;
        this.setList = [];
        this.isCompleted = false;
        this.currentSetIndex = 0;
        this.notes = "";
    }

    
    getExerciseID() {
        return this.exerciseID;
    }

    setExerciseID(id) {
        this.exerciseID = id;
    }

    removeExerciseID() {
        this.exerciseID = "";
    }

    getExerciseName() {
        return this.exerciseName;
    }

    setExerciseName(name) {
        this.exerciseName = name;
    }

    
    addSet(setObject) {
        if (setObject) {
            this.setList.push(setObject);
        }
    }

    
    addNewSet(weight = 0, reps = 0, time = 0, type = "WeightBased") {
        
        const newSet = {
            weight: weight,
            reps: reps,
            time: time,
            type: type,
            completed: false
        };
        this.setList.push(newSet);
        return newSet;
    }

    removeSet(index) {
        if (index >= 0 && index < this.setList.length) {
            this.setList.splice(index, 1);
           
            if (this.currentSetIndex >= this.setList.length) {
                this.currentSetIndex = Math.max(0, this.setList.length - 1);
            }
        }
    }

    getTotalSets() {
        return this.setList.length;
    }

  
    getCurrentSet() {
        if (this.currentSetIndex < this.setList.length) {
            return this.setList[this.currentSetIndex];
        }
        return null;
    }

    nextSet() {
        if (this.currentSetIndex < this.setList.length - 1) {
            this.currentSetIndex++;
            return true;
        }
        return false;
    }

    previousSet() {
        if (this.currentSetIndex > 0) {
            this.currentSetIndex--;
            return true;
        }
        return false;
    }

    
    
    markExerciseCompleted() {
        this.isCompleted = true;
    }

    isExerciseCompleted() {
        return this.isCompleted;
    }

}

export default Exercise;