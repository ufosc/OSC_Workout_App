class Session {
    constructor(exerciseList = [], sessionName = null) {
        this.exerciseList = exerciseList;  
        this.sessionName = sessionName;  
        this.date = new Date();  
        this.startTime = null;
        this.endTime = null;
        this.isActive = false;
        this.currentExerciseIndex = 0;
    }

  
    setSessionName(name) {
        this.sessionName = name;
    }

  
    getSessionName() {
        if (this.sessionName) {
            return this.sessionName;
        }
      
        const dateStr = this.date.toLocaleDateString();
        return `Workout Session - ${dateStr}`;
    }


    removeSessionName(index) {
        this.exerciseList.splice(index, 1);
    }

    
    addExercise(exerciseList) {
        this.exerciseList.push(exerciseList);
    }

    
    removeExercise(index) {
        if (index >= 0 && index < this.exerciseList.length) {
            this.exerciseList.splice(index, 1);
        }
    }

    
    

  
    startSession() {
        this.startTime = new Date();
        this.isActive = true;
        this.currentExerciseIndex = 0;
    }


    endSession() {
        this.endTime = new Date();
        this.isActive = false;
    }

    
    getSessionDuration() {
        if (this.startTime && this.endTime) {
            const durationMs = this.endTime - this.startTime;
            return Math.round(durationMs / (1000 * 60)); 
        }
        return 0;
    }

   
    nextExercise() {
        if (this.currentExerciseIndex < this.exerciseList.length - 1) {
            this.currentExerciseIndex++;
            return true;
        }
        return false; 
    }

    
    previousExercise() {
        if (this.currentExerciseIndex > 0) {
            this.currentExerciseIndex--;
            return true;
        }
        return false; 
    }

   
    getCurrentExercise() {
        if (this.currentExerciseIndex < this.exerciseList.length) {
            return this.exerciseList[this.currentExerciseIndex];
        }
        return null;
    }

  
    getTotalExercises() {
        return this.exerciseList.length;
    }

    
    getProgress() {
        if (this.exerciseList.length === 0)
             return 0;

        return Math.round((this.currentExerciseIndex / this.exerciseList.length) * 100);
    }

  
    getSessionSummary() {
        return {
            name: this.getSessionName(),
            date: this.date.toLocaleDateString(),
            startTime: this.startTime ? this.startTime.toLocaleTimeString() : null,
            endTime: this.endTime ? this.endTime.toLocaleTimeString() : null,
            duration: this.getSessionDuration(),
            totalExercises: this.getTotalExercises(),
            isCompleted: !this.isActive && this.endTime !== null
        };
    }


    setDate(date) {
        this.date = new Date(date);
    }

   
    getFormattedDate() {
        return this.date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

   
    toJSON() {
        return {
            sessionName: this.sessionName,
            date: this.date.toISOString(),
            startTime: this.startTime ? this.startTime.toISOString() : null,
            endTime: this.endTime ? this.endTime.toISOString() : null,
            exerciseList: this.exerciseList,
            currentExerciseIndex: this.currentExerciseIndex,
            isActive: this.isActive
        };
    }

  
    static fromJSON(jsonData) {
        const session = new Session(
            jsonData.exerciseList,
      
            jsonData.sessionName
        );
        
        session.date = new Date(jsonData.date);
        session.startTime = jsonData.startTime ? new Date(jsonData.startTime) : null;
        session.endTime = jsonData.endTime ? new Date(jsonData.endTime) : null;
        session.currentExerciseIndex = jsonData.currentExerciseIndex || 0;
        session.isActive = jsonData.isActive || false;
        
        return session;
    }
}

export default Session;