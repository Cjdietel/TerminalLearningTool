import { useState } from 'react';
import { problems, checkAnswer } from "../Problems";
import Terminal from './Terminal';
import classNames from 'classnames';
import "./ProblemPanel.css";

const ProblemPanel = ({ 
  currentProblemIndex, 
  setCurrentProblemIndex,  
}) => {

  const problemKeys = Object.keys(problems);
  const currentProblemKey = problemKeys[currentProblemIndex];
  console.log(currentProblemIndex)
  const currentProblem = problems[currentProblemKey];


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

  // Calculate total points
  const accumulatedPoints = problemKeys.reduce((total, key) => 
    total + (problems[key].isComplete ? problems[key].points : 0), 0
  );

  const handleCommandSubmit = (command) => {
    if (command === currentProblem.answer) {
      currentProblem.isComplete = true;
    } else {
      currentProblem.isComplete = false;
    }
  };

  const glowClass = currentProblem.isComplete ? 'green-glow' : 'red-glow';

  return (
    <div
    style={{
      flexGrow: 1
    }}
    className={classNames('ProblemPanel', glowClass)}
       >
      <div style={{
        height: "100%",
        width: "100%",
        flexGrow: "1",
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

/*

  NOTE: This validateCommand does not cover every possible solution and only compares user input
  to the answer key in Problems.json.
  Ony a temp solution (as of 12/15/2024 12:05am)

  Should be retrofitted for every type of problem, 
  probably modeled after original shelladventure system with keys and cwd checking


*/

export const validateCommand = async (
  command, 
  currentProblemIndex, 
  setCurrentProblemIndex, 
  problems,
  fs
) => {
  const problemKeys = problems ? Object.keys(problems) : [];
  const currentProblemKey = problemKeys[currentProblemIndex];
  
  // Ensure currentProblemKey is valid and exists in the problems object
  const currentProblem = currentProblemKey && problems[currentProblemKey] ? problems[currentProblemKey] : null;

  if (!currentProblem) {
    console.log("Invalid problem data");
    return;
  }

  if (checkAnswer(fs, command, currentProblem, currentProblemIndex, setCurrentProblemIndex)) {
    const updatedProblems = {...problems};
    updatedProblems[currentProblemKey].isComplete = true;
    // setProblems(updatedProblems);
    console.log("completed");

    await new Promise(resolve => setTimeout(resolve, 2000));
    if (currentProblemIndex < problemKeys.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
    } else {
      console.log("all problems completed")
    }
  } else {
    console.log("try again");
  }
};
