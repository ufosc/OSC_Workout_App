// current session the user will be working on during their workout, where they will log what exersises and weight they are perorming
import Timer from "./Timer";
import WorkoutList from "./WorkoutList";

function Session() {
    return(
        <div style={{textAlign: "center", padding:"2rem" }}>
            <h1>Workout Session</h1>
            <Timer/>
            <hr style={{ margin: "2rem 0", borderColor: "#333" }} />
            <WorkoutList />
        </div>
    );
}

export default Session;