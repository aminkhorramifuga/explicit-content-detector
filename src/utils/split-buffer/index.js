/**
 * Splits a buffer into smaller chunks of the specified size.
 *
 * @function
 * @param {Buffer} buffer - The buffer to be split.
 * @param {number} chunkSize - The desired size of the chunks in bytes.
 * @returns {Buffer[]} An array of buffer chunks.
 */

export default function splitBuffer(buffer, chunkSize) {
  const chunks = [];

  for (let i = 0; i < buffer.length; i += chunkSize) {
    chunks.push(buffer.slice(i, i + chunkSize));
  }

  return chunks;
};