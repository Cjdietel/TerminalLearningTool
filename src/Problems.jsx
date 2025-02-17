const problems = {
    "p1": {
        "problemText": "Navigate to the zipped folder",
        "isComplete": false,
        "points": 1,
        "answer": "cd zipped"
    },
    "p2": {
        "problemText": "Display current items inside current directory",
        "isComplete": false,
        "points": 2,
        "answer": "ls"
    },
    "p3": {
        "problemText": "Navigate to folder1",
        "isComplete": false,
        "points": 1,
        "answer": "cd folder1"
    },
};

function checkAnswer(fs, command, currentProblem, currentProblemIndex, setCurrentProblemIndex) {
    if (currentProblem && command && command === currentProblem.answer) {
        return true;        
    }
    else
    {
        return false;
    }
}

export { problems, checkAnswer };
