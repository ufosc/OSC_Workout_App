
class ExcerciseList{
    constructor(numberOfSets,ExcerciseID,RestTime,weight=0,reps=0,setTime=0,activeTime=False){
        this.setList=[]
        this.RestTime=RestTime
        this.ExcerciseID=ExcerciseID
        this.reps=reps
        this.activeTime=activeTime
        if (time == 0){
            this.weight = weight;
            this.type="WeightBased";
    } 
        else if (weight == 0){
            this.setTime = setTime;
            this.type="TimeBased";
        }
        else {
            this.type="Hybrid";
        }
}
    addSet(){
        this.setList.push(new SetObject(weight,reps,time,type,activeTime));
    }    
    removeSet(index){
        this.setList.pop(index);
    }
    setWeight(index,newWeight){
        this.setList[index].setWeight(newWeight);
    }
    setReps(index,newReps){
        this.setList[index].setReps(newReps);
    }
    setTime(index,newTime){
        this.setList[index].setTime(newTime);
    }
    getWeight(index) {
        return this.setList[index].getWeight();
    }
    getReps(index) {
        return this.setList[index].getReps();
    }
    getTime(index) {
        return this.setList[index].getTime();
    }
    getMax(){
        max=setList(0).weight
        for (let i=1; i<this.setList.length;i++){
            if (this.setList[i].weight>max){
                max=this.setList[i].weight;
            }
        }
        return max;
    }
}
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


