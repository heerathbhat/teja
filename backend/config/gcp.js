const { VertexAI } = require('@google-cloud/vertexai');
const { Storage } = require('@google-cloud/storage');
const speech = require('@google-cloud/speech');
const { DocumentProcessorServiceClient } = require('@google-cloud/documentai');
const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');

const project = process.env.GCP_PROJECT_ID || 'teja-491714';
const location = process.env.GCP_LOCATION || 'us-central1';
const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;

// 1. Vertex AI (Gemini)
const vertexAI = new VertexAI({ project, location });
const generativeModel = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

// 2. Google Cloud Storage
const storage = new Storage({ project, keyFilename });
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || 'teja-ai-assets');

// 3. Speech-to-Text
const speechClient = new speech.SpeechClient({ project, keyFilename });

// 4. Document AI
const docAIClient = new DocumentProcessorServiceClient({ project, location, keyFilename });

// 5. BigQuery
const bigquery = new BigQuery({ project, keyFilename });

module.exports = {
  generativeModel,
  storage,
  bucket,
  speechClient,
  docAIClient,
  bigquery,
  project,
  location
};
