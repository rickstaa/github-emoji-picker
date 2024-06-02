/**
 * @file Utility functions.
 */

/**
 * Convert unified to unicode emoji.
 * @param unified - the unified string.
 * @returns the unicode emoji. Empty if the unified string could not be parsed.
 */
const unifiedToUnicodeEmoji = (unified: string) => {
  if (!unified) return "";

  return String.fromCodePoint(
    ...unified.split("-").map((str: string) => parseInt(str, 16)),
  );
};

/**
 * Parse short codes from a string.
 * @param str - the string to parse.
 * @returns Array of parsed short codes.
 */
const parseShortCodes = (str: string) => {
  const shortCodes = str.match(/:[^:\s]+:/g);
  return shortCodes ? shortCodes : [str];
};

export { unifiedToUnicodeEmoji, parseShortCodes };
