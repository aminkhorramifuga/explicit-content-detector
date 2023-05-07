const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient(); // Use your credentials here if needed.

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
async function transcribeAudio(audioBuffer, encoding, sampleRateHertz, languageCode) {
    const config = {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
    };
    const audio = {
      content: audioBuffer.toString('base64'),
    };
  
    const request = {
      config: config,
      audio: audio,
    };
  
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join(' ');
  
    return transcription;
  };

  export default transcribeAudio;
  