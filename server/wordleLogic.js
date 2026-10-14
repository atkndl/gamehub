// Turkish string helpers
export function toTurkishUpper(str) {
  if (!str) return '';
  return str.toLocaleUpperCase('tr-TR');
}

export function toTurkishLower(str) {
  if (!str) return '';
  return str.toLocaleLowerCase('tr-TR');
}

/**
 * Standard Wordle 2-pass evaluation algorithm
 * @param {string} target - The secret word (lowercase, 5 chars)
 * @param {string} guess - The guessed word (lowercase, 5 chars)
 * @returns {Array<'correct' | 'present' | 'absent'>}
 */
export function evaluateWordleGuess(target, guess) {
  const tLower = toTurkishLower(target);
  const gLower = toTurkishLower(guess);

  const result = new Array(5).fill('absent');
  const letterCounts = {};

  // Count target letters
  for (let i = 0; i < 5; i++) {
    const char = tLower[i];
    letterCounts[char] = (letterCounts[char] || 0) + 1;
  }

  // Pass 1: find correct positions (Green)
  for (let i = 0; i < 5; i++) {
    if (gLower[i] === tLower[i]) {
      result[i] = 'correct';
      letterCounts[gLower[i]]--;
    }
  }

  // Pass 2: find present letters in wrong positions (Yellow)
  for (let i = 0; i < 5; i++) {
    if (result[i] !== 'correct') {
      const char = gLower[i];
      if (letterCounts[char] && letterCounts[char] > 0) {
        result[i] = 'present';
        letterCounts[char]--;
      }
    }
  }

  return result;
}

/**
 * Check if the guess is 100% correct
 */
export function isWordleCorrect(result) {
  return result.length === 5 && result.every(status => status === 'correct');
}
