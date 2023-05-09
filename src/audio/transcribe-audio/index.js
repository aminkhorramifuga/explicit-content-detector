import speech from '@google-cloud/speech';
import streamToArray from 'stream-to-array';
import splitBuffer from '../../utils/split-buffer/index.js';

/**
 * Transcribes the given audio using Google Speech-to-Text API.
 *
 * @async
 * @function
 * @param {Buffer} audioBuffer - The audio data buffer.
 * @param {string} encoding - The encoding of the audio data (e.g., 'LINEAR16', 'FLAC', 'MP3', etc.).
 * @param {number} sampleRateHertz - The sample rate of the audio data in Hertz (e.g., 44100, 48000, etc.).
 * @param {string} languageCode - The BCP-47 language code of the spoken language in the audio (e.g., 'en-US', 'fr-FR', etc.).
 * @param {Object} GGCredentials - The google cloud required creds.
 * @returns {Promise<string>} A promise that resolves to the transcribed text.
 * @throws {Error} If there is an error during the transcription process.
 */
async function transcribeAudioFromGC(
  audioBuffer,
  encoding,
  sampleRateHertz,
  languageCode,
  auth
) {
  
  const client = new speech.SpeechClient({
    auth
  });

  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  };

  const chunks = splitBuffer(audioBuffer, 2048 * 2048); // split into 1MB chunks

  let response = null;

  for (const [index, chunk] of chunks.entries()) {
    const audio = {
      content: chunk.toString('base64'),
    };

    const request = {
      config: config,
      audio: audio,
    };

    const res = await client.recognize(request);
    console.log('response', res, chunks, audioBuffer);
    if (response === null) {
      response = partialResponse;
    } else {
      response.results.push(...partialResponse.results);
    }
  }

  const transcription = response?.results
    ?.map((result) => result.alternatives[0].transcript)
    .join(' ');

  return transcription;
}

export default transcribeAudioFromGC;
