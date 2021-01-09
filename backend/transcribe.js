const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const speech = require('@google-cloud/speech');
const fs = require('fs');

const app = express(); // create express app


async function transcribe (req, res) {
    const client = new speech.SpeechClient();
  
    const gcsUri = 'gs://podcast-bucket-react-node/audioshort.mp3';
    const encoding = 'MP3';
    const sampleRateHertz = 16000;
    const languageCode = 'en-US';

    const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
    };

    const audio = {
    uri: gcsUri,
    };

    const request = {
    config: config,
    audio: audio,
    };
    // Detects speech in the audio file. This creates a recognition job that you
    // can wait for now, or get its result later.
    const [operation] = await client.longRunningRecognize(request);
    // Get a Promise representation of the final result of the job
    const [response] = await operation.promise();
    const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
    console.log(`Transcription: ${transcription}`);
        //Write transcription results to a text file
//        fs.writeFile('../resources/transcription.txt', transcription, err => {
//            if (err) {
//                console.error(err)
//                return
//            }
//        })
    res.send(`Transcription: ${transcription}`);
    console.log('Transcription');
}

app.use(transcribe);

app.get("/", (req, res) => {
  res.send("This is from express.js");
});


// start express server on port 5000
app.listen(5000, () => {
  console.log("server started on port 5000");
});