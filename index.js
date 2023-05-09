import express from 'express';
import bodyParser from 'body-parser';
import { GoogleAuth } from 'google-auth-library';
import multer from 'multer';
import dotenv from 'dotenv';

import transcribeAudioFromGC from './src/audio/transcribe-audio/index.js';


const upload = multer();
const app = express();

dotenv.config();
const {
  PROJECT_ID: projectId,
  PRIVATE_KEY: private_key,
  CLIENT_EMAIL: client_email
} = process.env;

console.log('project_id, private_key, client_email, api_key', {
  projectId,
  private_key,
  client_email
});

const auth = new GoogleAuth({
  projectId: projectId,
  key: private_key.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});


const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Server is up!!!');
});

app.post(
  '/api/v1/detect-explicit-content',
  upload.single('audio'),
  async (req, res) => {
    try {
      const audioBuffer = req.file.buffer;
      const encoding = 'LINEAR16'; // Adjust this based on the audio file format.
      const sampleRateHertz = 44100; // Adjust this based on the audio file sample rate.
      const languageCode = 'en-US'; // Adjust this based on the language of the song.

      const transcription = await transcribeAudioFromGC(
        audioBuffer,
        encoding,
        sampleRateHertz,
        languageCode,
        auth
      );

      console.log('___ transcription ___', transcription);

      // Implement your profanity filtering algorithm here and generate a list of detected explicit words
      // For example:
      // const detectedExplicitWords = profanityFilter(transcription);

      res.json({
        transcription: transcription,
        //explicitWords: detectedExplicitWords
      });
    } catch (error) {
      console.error(`Error processing audio: ${error.message}`);
      res.status(500).send('An error occurred while processing the audio.');
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
