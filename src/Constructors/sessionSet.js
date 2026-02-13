//weights
//reps
//time of set

//https://drive.google.com/file/d/1gwcgkMZDAUTUM7klxQcF9IJGR9pfc_kk/view

class Set {
    constructor(weight = 0, reps = 0, time = 0, active = False) {
        this.weight = weight;
        this.reps = reps;
        this.time = time;
        this.active = active;
    }

    getWeight() {
        return this.weight;
    }
    getReps() {
        return this.reps;
    }
    getTime() {
        return this.time;
    }
    getActive() {
        return this.active;
    }
    toggleActive() {
        active = !active;
    }
    setTime(inputTime) {
        this.time = inputTime;
    }
    setWeight(inputWeight) {
        this.reps = inputWeight;
    }
    setReps(inputReps) {
        this.reps = inputReps;
    }
}