const express = require('express');
const bodyParser = require('body-parser');
const transcribeAudio = require('./src/audio/transcribe-audio');
const multer = require('multer');
const upload = multer();
const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post('/api/v1/detect-explicit-content', upload.single('audio'), async (req, res) => {
  try {
    const audioBuffer = req.file.buffer;
    const encoding = 'LINEAR16'; // Adjust this based on the audio file format.
    const sampleRateHertz = 44100; // Adjust this based on the audio file sample rate.
    const languageCode = 'en-US'; // Adjust this based on the language of the song.

    const transcription = await transcribeAudio(audioBuffer, encoding, sampleRateHertz, languageCode);

    console.log('___ transcription ___', transcription);
    
    // Implement your profanity filtering algorithm here and generate a list of detected explicit words
    // For example:
    // const detectedExplicitWords = profanityFilter(transcription);

    res.json({
      transcription: transcription,
      explicitWords: detectedExplicitWords
    });
  } catch (error) {
    console.error(`Error processing audio: ${error.message}`);
    res.status(500).send('An error occurred while processing the audio.');
  }
});
