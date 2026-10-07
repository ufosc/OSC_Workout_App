import Timer from "./Timer";

function Session() {
  return (
    <main style={{ minHeight: "100vh", padding: "2rem 1rem", boxSizing: "border-box" }}>
      <h1 style={{ textAlign: "center" }}>Workout Session</h1>
      <Timer />
    </main>
  );
}

export default Session;
