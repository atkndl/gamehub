// Turkish uppercase/lowercase utilities
export function toTurkishUpper(str) {
  if (!str) return '';
  return str.toLocaleUpperCase('tr-TR');
}

export function toTurkishLower(str) {
  if (!str) return '';
  return str.toLocaleLowerCase('tr-TR');
}

// Turkish Q Keyboard rows
export const TURKISH_KEYBOARD_ROWS = [
  ['E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'İ'],
  ['ENTER', 'Z', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç', 'BACKSPACE']
];

// Fun avatar list
export const AVATARS = [
  '🦁', '🦊', '🐼', '🐯', '🐰', '🐸', '🐨', '🦄',
  '🚀', '⚡', '🎮', '🎯', '🔮', '⭐', '🔥', '👑'
];
