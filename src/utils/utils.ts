/**
 * @file Utility functions.
 */

/**
 * Convert unified to unicode emoji.
 * @param unified - the unified string.
 * @returns the unicode emoji.
 */
const unifiedToUnicodeEmoji = (unified: string) => {
  return String.fromCodePoint(
    ...unified.split("-").map((str: string) => parseInt(str, 16))
  );
};

export { unifiedToUnicodeEmoji };
