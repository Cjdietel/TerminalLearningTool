// initWordList.js
import config from './config.json';

export async function loadWordList() {
  const response = await fetch(config.wordList);
  const text = await response.text();
  return text.split("\n").map(word => word.trim()).filter(Boolean);
}
