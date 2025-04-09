import { getRandomWord } from './utils';
import { loadWordList } from './getWordList';
import config from './config.json';

let wordList = [];

export async function init() {
  // Load the word list asynchronously.
  wordList = await loadWordList();
}

/**
 * Recursively traverses the file system to collect file and directory paths.
 * @param {Object} fs - The file system object.
 * @param {string} path - The current path during traversal.
 * @param {Array} files - Accumulator for file paths.
 * @param {Array} directories - Accumulator for directory paths.
 * @returns {Object} - An object with `files` and `directories` arrays.
 */
function traverseFileSystem(fs, path = '', files = [], directories = []) {
  for (const [name, item] of Object.entries(fs)) {
    const fullPath = path ? `${path}/${name}` : name;
    if (item.is_file) {
      files.push(fullPath);
    } else {
      directories.push(fullPath);
      traverseFileSystem(item.content, fullPath, files, directories);
    }
  }
  return { files, directories };
}

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} - The shuffled array.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Generates a set of problems based on the entire file system.
 * @param {Object} fs - The file system object.
 * @returns {Array} - A shuffled array of problem objects.
 */
function generateProblems(fs) {
  const { files, directories } = traverseFileSystem(fs);
  const problems = [];

  // Problem type 2: Navigate to a directory (using the last segment as the answer)
  directories.forEach((dir) => {
    problems.push({
      problemText: `Navigate to the ${dir} folder`,
      isComplete: false,
      points: 1,
      answer: dir.split('/').pop(),
      problemType: 2
    });
  });

  // Problem type 1: Display current items (exact command match)
  problems.push({
    problemText: "Display current items inside the current directory",
    isComplete: false,
    points: 2,
    answer: "ls",
    problemType: 1
  });

  // Problem type 3: Creation problems
  // File creation: Pick a random target directory from the directories list.
  for (let i = 0; i < config.numType3; i++) {
    let name = getRandomWord(wordList);
    const targetDir = directories[Math.floor(Math.random() * directories.length)];
    problems.push({
      problemText: `Create a new file named '${name}' in directory '${targetDir}'`,
      isComplete: false,
      points: 3,
      answer: name,
      problemType: 3,
      targetPath: targetDir  // Specify the target directory where the file must be created.
    });
  }

  // Directory creation: Also use a target directory.
  for (let i = 0; i < config.numType3; i++) {
    let name = getRandomWord(wordList);
    const targetDir = directories[Math.floor(Math.random() * directories.length)];
    problems.push({
      problemText: `Create a new directory named '${name}' in directory '${targetDir}'`,
      isComplete: false,
      points: 3,
      answer: name,
      problemType: 3,
      targetPath: targetDir
    });
  }

  // Problem type 4: Deletion problems
  // For file deletion: The answer stores the full path.
  files.forEach((file) => {
    problems.push({
      problemText: `Delete the file '${file}'`,
      isComplete: false,
      points: 4,
      answer: file,
      problemType: 4
    });
  });
  // For directory deletion:
  directories.forEach((dir) => {
    problems.push({
      problemText: `Remove the directory '${dir}'`,
      isComplete: false,
      points: 4,
      answer: dir,
      problemType: 4
    });
  });

  return shuffleArray(problems);
}

/**
 * Recursively checks if a path exists in the file system.
 * @param {Object} fs - The file system object.
 * @param {Array} pathSegments - An array of path segments to traverse.
 * @returns {boolean} - True if the path exists, else false.
 */
function pathExists(fs, pathSegments) {
  let current = fs;
  for (const segment of pathSegments) {
    if (current[segment]) {
      current = current[segment].content;
    } else {
      return false;
    }
  }
  return true;
}

/**
 * Checks if the user's command solves the current problem.
 * Problem types:
 *  - 1: Exact command match.
 *  - 2: Navigation - check if the last segment of currentPath matches the answer.
 *  - 3: Create a file or directory - check if the specified item exists in the target directory.
 *  - 4: Delete a file or directory - check if the specified item does NOT exist in its parent directory.
 *
 * @param {Object} fs - The file system object.
 * @param {string} command - The user's command.
 * @param {Object} currentProblem - The current problem object.
 * @param {number} currentProblemIndex - The index of the current problem.
 * @param {Function} setCurrentProblemIndex - Function to update the current problem index.
 * @param {string} currentPath - The current path in the file system.
 * @returns {boolean} - True if the command is correct, else false.
 */
function checkAnswer(fs, command, currentProblem, currentProblemIndex, setCurrentProblemIndex, currentPath) {
  // For problem types 1 and 2, use the current directory.
  const pathSegments = currentPath.split('/').filter(Boolean);
  let currentDir = fs;
  for (const segment of pathSegments) {
    if (currentDir[segment] && !currentDir[segment].is_file) {
      currentDir = currentDir[segment].content;
    } else {
      return false;
    }
  }

  switch (currentProblem.problemType) {
    case 1:
      return command === currentProblem.answer;

    case 2:
      return pathSegments[pathSegments.length - 1] === currentProblem.answer;

    case 3: {
      // For creation problems, check in the target directory if provided.
      let targetDir;
      if (currentProblem.targetPath) {
        const targetSegments = currentProblem.targetPath.split('/').filter(Boolean);
        targetDir = fs;
        for (const seg of targetSegments) {
          if (targetDir[seg] && !targetDir[seg].is_file) {
            targetDir = targetDir[seg].content;
          } else {
            return false;
          }
        }
      } else {
        targetDir = currentDir;
      }
      return targetDir.hasOwnProperty(currentProblem.answer);
    }

    case 4: {
      // For deletion problems, the answer is the full path.
      // Determine the parent directory by splitting the full path.
      const answerSegments = currentProblem.answer.split('/').filter(Boolean);
      const targetName = answerSegments.pop(); // The file or directory name.
      let parentDir = fs;
      for (const seg of answerSegments) {
        if (parentDir[seg] && !parentDir[seg].is_file) {
          parentDir = parentDir[seg].content;
        } else {
          return false;
        }
      }
      return !parentDir.hasOwnProperty(targetName);
    }

    default:
      return false;
  }
}

export { generateProblems, checkAnswer };
