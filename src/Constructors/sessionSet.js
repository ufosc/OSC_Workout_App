
class SetObject {
    constructor(weight = 0, reps = 0, time = 0, type = "WeightBased", activeTime = false) {
        this.weight = weight;
        this.reps = reps;
        this.time = time;
        this.type = type;
        this.timeType = activeTime;
    }
    setWeight(newWeight){
        this.weight=newWeight;
    }
    setReps(newReps){
        this.reps=newReps;
    }
    setTime(newTime){
        this.time=newTime;
    }
    getTime() {
        return this.time;
    }
    getWeight() {
        return this.weight;
    }
    getReps() {
        return this.reps;
    }
}

export default SetObject;


