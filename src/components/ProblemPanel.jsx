import React, { useEffect } from 'react';
import { checkAnswer } from '../Problems';
import classNames from 'classnames';
import './ProblemPanel.css';
import confetti from 'canvas-confetti';

const ProblemPanel = (props) => {
  const {
    currentProblemIndex,
    setCurrentProblemIndex,
    currentDirectory,
    currentPath,
    problems,
    setProblems,
    fs,
  } = props;

  // If problems are not loaded yet, show a loading message.
  if (!problems || Object.keys(problems).length === 0) {
    return <div>Loading problems...</div>;
  }

  const problemKeys = Object.keys(problems);
  const currentProblemKey = problemKeys[currentProblemIndex];
  const currentProblem = problems[currentProblemKey];

  // If the current problem is not defined, return a loading indicator.
  if (!currentProblem) {
    return <div>Loading current problem...</div>;
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

  // Calculate total points accumulated from solved problems.
  const accumulatedPoints = problemKeys.reduce(
    (total, key) => total + (problems[key].isComplete ? problems[key].points : 0),
    0
  );

  // Trigger confetti when the problem is solved.
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      duration: 2000, // Confetti will stop after 2 seconds.
    });
  };

  // Use an effect to trigger confetti only once when the current problem becomes complete.
  useEffect(() => {
    if (currentProblem.isComplete) {
      triggerConfetti();
    }
    // We depend on currentProblem.isComplete so it only runs when that property changes.
  }, [currentProblem.isComplete]);

  const glowClass = currentProblem.isComplete ? 'green-glow' : 'red-glow';

  return (
    <div style={{ flexGrow: 1 }} className={classNames('ProblemPanel', glowClass)}>
      <div
        style={{
          height: '100%',
          width: '100%',
          flexGrow: '1',
          backgroundColor: '#1E2D2F',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Top Bar: Points and Problem Number */}
          <div
            style={{
              width: '100%',
              height: '3em',
              color: '#F1AB86',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '1em',
            }}
          >
            <b>Points: {accumulatedPoints}</b>
            <b>Problem: {currentProblemIndex + 1}</b>
          </div>

          {/* Problem Title */}
          <div
            style={{
              width: '100%',
              height: '3em',
              color: '#F1AB86',
              padding: '1em',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <h1>
              Problem #{currentProblemIndex + 1} - {currentProblem.points}{' '}
              {currentProblem.points === 1 ? 'point' : 'points'}
            </h1>
          </div>

          {/* Problem Statement */}
          <div style={{ color: '#F1AB86', display: 'flex', padding: '2em' }}>
            <b>{currentProblem.problemText}</b>
          </div>
        </div>

        {/* Problem Completion Status */}
        <div style={{ color: '#F1AB86', display: 'flex', padding: '1em' }}>
          <b>{currentProblem.isComplete ? 'Completed ✅' : 'Not completed ❌'}</b>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1em' }}>
          <button
            onClick={handlePrevious}
            disabled={currentProblemIndex === 0}
            style={{
              backgroundColor: '#1E2D2F',
              color: '#F1AB86',
              border: '1px solid #F1AB86',
              padding: '0.5em 1em',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2A3A3C')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1E2D2F')}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentProblemIndex === problemKeys.length - 1}
            style={{
              backgroundColor: '#1E2D2F',
              color: '#F1AB86',
              border: '1px solid #F1AB86',
              padding: '0.5em 1em',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2A3A4C')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1E2D2F')}
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
  setProblems, // Add setProblems to update the state
  fs,
  currentPath
) => {
  const problemKeys = problems ? Object.keys(problems) : [];
  const currentProblemKey = problemKeys[currentProblemIndex];
  
  // Ensure currentProblemKey is valid and exists in the problems object
  const currentProblem = currentProblemKey && problems[currentProblemKey] ? problems[currentProblemKey] : null;

  if (!currentProblem) {
    console.log("Invalid problem data");
    return;
  }

  if (checkAnswer(fs, command, currentProblem, currentProblemIndex, setCurrentProblemIndex, currentPath)) {
    console.log("shooting");
    confetti({
      particleCount: 1000,
      spread: 500,
      origin: { y: 0.9, x: 0.5 },
    });

    // Create a new problems object with the updated problem
    const updatedProblems = {
      ...problems,
      [currentProblemKey]: {
        ...problems[currentProblemKey],
        isComplete: true,
      },
    };
    setProblems(updatedProblems); // Update the state with the new object
    console.log("completed");

    await new Promise(resolve => setTimeout(resolve, 2000));
    if (currentProblemIndex < problemKeys.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
    } else {
      console.log("all problems completed");
    }
  } else {
    console.log("try again");
  }
};
