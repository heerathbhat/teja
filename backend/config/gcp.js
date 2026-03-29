const { VertexAI } = require('@google-cloud/vertexai');
const { Storage } = require('@google-cloud/storage');
const speech = require('@google-cloud/speech');
const { DocumentProcessorServiceClient } = require('@google-cloud/documentai');
const { BigQuery } = require('@google-cloud/bigquery');

const project = process.env.GCP_PROJECT_ID || 'teja-491714';
const location = process.env.GCP_LOCATION || 'us-central1';
const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;

// Load credentials from environment variable JSON string
let credentials;
if (process.env.GCP_SERVICE_ACCOUNT_KEY) {
  try {
    // Basic cleanup in case of extra quotes or whitespace
    const cleanKey = process.env.GCP_SERVICE_ACCOUNT_KEY.trim();
    credentials = JSON.parse(cleanKey);
  } catch (err) {
    console.error('Error parsing GCP_SERVICE_ACCOUNT_KEY from environment:', err);
  }
}

// Config object for standard Cloud SDKs
const gcpConfig = credentials 
  ? { projectId: project, credentials } 
  : { projectId: project, keyFilename };

// 1. Vertex AI (Gemini)
// Note: Vertex AI uses a different configuration structure for credentials
const vertexAI = new VertexAI({ 
  project, 
  location,
  ...(credentials ? { googleAuthOptions: { credentials } } : {})
});

const generativeModel = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

// 2. Google Cloud Storage
const storage = new Storage(gcpConfig);
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || 'teja-ai-assets');

// 3. Speech-to-Text
const speechClient = new speech.SpeechClient(gcpConfig);

// 4. Document AI
const docAIClient = new DocumentProcessorServiceClient({
  project,
  location,
  ...(credentials ? { credentials } : { keyFilename })
});

// 5. BigQuery
const bigquery = new BigQuery(gcpConfig);

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
