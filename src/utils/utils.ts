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
    ...unified.split("-").map((str: string) => parseInt(str, 16))
  );
};

export { unifiedToUnicodeEmoji };
