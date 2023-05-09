import speech from "@google-cloud/speech";
import fs from "fs";
import streamToArray from "stream-to-array";

const { project_id, private_key, client_email, api_key } = process.env;

const client = new speech.SpeechClient({
  projectId: project_id,
  credentials: {
    private_key,
    client_email,
    api_key
  },
});

/**
 * Transcribes the given audio using Google Speech-to-Text API.
 *
 * @async
 * @function
 * @param {Buffer} audioBuffer - The audio data buffer.
 * @param {string} encoding - The encoding of the audio data (e.g., 'LINEAR16', 'FLAC', 'MP3', etc.).
 * @param {number} sampleRateHertz - The sample rate of the audio data in Hertz (e.g., 44100, 48000, etc.).
 * @param {string} languageCode - The BCP-47 language code of the spoken language in the audio (e.g., 'en-US', 'fr-FR', etc.).
 * @returns {Promise<string>} A promise that resolves to the transcribed text.
 * @throws {Error} If there is an error during the transcription process.
 */
async function transcribeAudio(
  audioBuffer,
  encoding,
  sampleRateHertz,
  languageCode
) {
  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  };

  const chunks = await streamToArray(audioBuffer, { chunkSize: 1024 * 1024 }); // split into 1MB chunks
  console.log("response", chunks, audioBuffer);

  let response = null;

  for (const [index, chunk] of chunks.entries()) {
    const audio = {
      content: chunk.toString("base64"),
    };

    const request = {
      config: config,
      audio: audio,
    };

    const res = await client.recognize(request);

    if (response === null) {
      response = partialResponse;
    } else {
      response.results.push(...partialResponse.results);
    }
  }

  const transcription = response?.results
    ?.map((result) => result.alternatives[0].transcript)
    .join(" ");

  return transcription;
}

export default transcribeAudio;
