import { useState } from 'react';
import problems from "../Problems.json";

const problemKeys = Object.keys(problems);

const ProblemPanel = (props) => {
  const { currentPath, input, setInput } = props;
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);

  // Ensure the index is within bounds
  const currentProblemKey = problemKeys[currentProblemIndex];
  const currentProblem = problems[currentProblemKey];

  // Mark as complete if the path ends with "zipped"
  if (currentPath.split("/")[currentPath.split("/").length - 1] === "zipped") {
    problems.p1.isComplete = true;
  }

  if (currentProblemIndex == 1 && input == "ls")
  {
    problems.p2.isComplete = true;
  }

  const handleNext = () => {
    if (currentProblemIndex < problemKeys.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
    }
  };


  return (
    <div style={{ height: "50%", width: "100%", padding: "0 0.2em 0.2em 0.2em" }}>
      <div
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "#1E2D2F",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
        }}
      >
        <div>
          {/* Total points and problem */}
          <div
            style={{
              width: "100%",
              height: "3em",
              color: "#F1AB86",
              display: "flex",
              justifyContent: "space-between",
              padding: "1em",
            }}
          >
            <b>Points: {currentProblem.points}</b>
            <b>Problem: {currentProblemIndex + 1}</b>
          </div>

          {/* Problem number and points */}
          <div
            style={{
              width: "100%",
              height: "3em",
              color: "#F1AB86",
              padding: "1em",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <h1>
              Problem #{currentProblemIndex + 1} - {currentProblem.points}{' '}
              {currentProblem.points === 1 ? 'point' : 'points'}
            </h1>
          </div>

          {/* Problem statement */}
          <div
            style={{
              color: "#F1AB86",
              display: "flex",
              padding: "2em",
              height: "100%",
            }}
          >
            <b>{currentProblem.problemText}</b>
          </div>
        </div>

        {/* Display if completed */}
        <div style={{ color: "#F1AB86", display: "flex", padding: "1em" }}>
          <b>
            {currentProblem.isComplete
              ? 'Completed ✅'
              : 'Not completed ❌'}
          </b>
        </div>

        {/* Next Button */}
        <div style={{ display: "flex", justifyContent: "center", padding: "1em" }}>
          <button
            onClick={handleNext}
            style={{
              padding: "0.5em 1em",
              backgroundColor: "#F1AB86",
              color: "#1E2D2F",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            disabled={currentProblemIndex >= problemKeys.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProblemPanel;
