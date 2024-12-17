import { useState } from 'react';
import problems from "../Problems.json";

const ProblemPanel = ({ currentPath }) => {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const problemKeys = Object.keys(problems);

  // Update completion status if currentPath ends with "zipped"
  if (currentPath.endsWith("/zipped")) {
    problems.p1.isComplete = true;
  }

  const handlePrevious = () => {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(currentProblemIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentProblemIndex < problemKeys.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
    }
  };

  const currentProblemKey = problemKeys[currentProblemIndex];
  const currentProblem = problems[currentProblemKey];

  // Calculate total points
  const accumulatedPoints = problemKeys.reduce((total, key) => 
    total + (problems[key].isComplete ? problems[key].points : 0), 0
  );

  const handleCommandExecution = (command) => {
    if (command === currentProblem.answer) {
      currentProblem.isComplete = true;
    } else {
      currentProblem.isComplete = false;
    }
  };

  return (
    <div style={{ height: "50%", width: "100%", padding: "0 0.2em 0.2em 0.2em" }}>
      <div style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#1E2D2F",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}>
        <div>
          {/* Total points and problem */}
          <div style={{
            width: "100%",
            height: "3em",
            color: "#F1AB86",
            display: "flex",
            justifyContent: "space-between",
            padding: "1em"
          }}>
            <b>Points: {accumulatedPoints}</b>
            <b>Problem: {currentProblemIndex + 1}</b>
          </div>

          {/* Problem number and points */}
          <div style={{
            width: "100%",
            height: "3em",
            color: "#F1AB86",
            padding: "1em",
            display: "flex",
            justifyContent: "center"
          }}>
            <h1>
              Problem #{currentProblemIndex + 1} - {currentProblem.points} {currentProblem.points === 1 ? "point" : "points"}
            </h1>
          </div>

          {/* Problem statement */}
          <div style={{ color: "#F1AB86", display: "flex", padding: "2em" }}>
            <b>{currentProblem.problemText}</b>
          </div>
        </div>

        {/* Display if completed */}
        <div style={{ color: "#F1AB86", display: "flex", padding: "1em" }}>
          <b>{currentProblem.isComplete ? "Completed ✅" : "Not completed ❌"}</b>
        </div>

        {/* Navigation buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "1em" }}>
          <button
            onClick={handlePrevious}
            disabled={currentProblemIndex === 0}
            style={{
              backgroundColor: "#1E2D2F",
              color: "#F1AB86",
              border: "1px solid #F1AB86",
              padding: "0.5em 1em",
              cursor: "pointer",
              transition: "background-color 0.3s"
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2A3A3C"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#1E2D2F"}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentProblemIndex === problemKeys.length - 1}
            style={{
              backgroundColor: "#1E2D2F",
              color: "#F1AB86",
              border: "1px solid #F1AB86",
              padding: "0.5em 1em",
              cursor: "pointer",
              transition: "background-color 0.3s"
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2A3A4C"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#1E2D2F"}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProblemPanel;
