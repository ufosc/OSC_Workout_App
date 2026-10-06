// current session the user will be working on during their workout, where they will log what exersises and weight they are perorming
import Timer from "./Timer";

function Session() {
    return(
        // home-root and neon-title come from Home.css / App.css, so this page matches the landing page
        <div className="home-root">
            <h1 className="neon-title text">Workout Session</h1>
            <Timer/>
        </div>
    );
}

export default Session;
