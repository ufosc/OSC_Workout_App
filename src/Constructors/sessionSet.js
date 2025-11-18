
class SetObject {
    constructor(weight=0,reps,time=0,type,activeTime=False){
        this.weight = weight;
        this.reps = reps;
        this.time = time;
        this.timeType=activeTime 
    }
    setWeight(newWeight){
        this.weight=newWeight;
    }
    setReps(newReps){
        this.reps=newReps;
    }
    setTime(newTime){
        this.setTime=newTime;
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


