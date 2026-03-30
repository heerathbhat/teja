const express = require('express');
const { generativeModel, speechClient, docAIClient } = require('../config/gcp');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Metric = require('../models/Metric');
const { logToBigQuery } = require('../utils/bigqueryLogger');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Helper to estimate tokens (approximate for Gemini 1.5)
const estimateTokens = (text) => {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
};

// @desc    Get all user chats
// @route   GET /api/chat
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const chats = await Chat.find({ users: req.user._id }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new chat
// @route   POST /api/chat
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title } = req.body;
    const chat = await Chat.create({
      title: title || 'New Chat',
      users: [req.user._id]
    });
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get messages for a chat
// @route   GET /api/chat/:chatId
// @access  Private
router.get('/:chatId', protect, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Send a message & get AI response via Vertex AI
// @route   POST /api/chat/message
// @access  Private
router.post('/message', protect, async (req, res) => {
  const { chatId, content, attachments } = req.body;
  const startTime = Date.now();

  try {
    // 1. Save user message
    const userMessage = await Message.create({
      chat: chatId,
      sender: req.user._id,
      content,
      attachments,
      role: 'user'
    });

    // 2. Update chat last message
    await Chat.findByIdAndUpdate(chatId, { lastMessage: content });

    // 3. Prepare Vertex AI prompt
    let parts = [{ text: content }];
    
    if (attachments && attachments.length > 0) {
      for (const att of attachments) {
        // Vertex AI supports fileData for GCS URIs
        if (att.fileUrl.startsWith('https://storage.googleapis.com/')) {
          const gcsUri = att.fileUrl.replace('https://storage.googleapis.com/', 'gs://');
          const mimeType = att.fileType === 'image' ? 'image/png' : 'application/pdf'; // Basic mapping
          parts.push({ fileData: { fileUri: gcsUri, mimeType } });
        }
      }
    }

    const result = await generativeModel.generateContent({
      contents: [{ role: 'user', parts }],
    });
    
    const aiResponseText = result.response.candidates[0].content.parts[0].text;
    const latency = Date.now() - startTime;

    // 4. Save AI message
    const aiMessage = await Message.create({
      chat: chatId,
      sender: req.user._id, 
      content: aiResponseText,
      role: 'model'
    });

    // 5. Log Metrics (Local)
    const promptTokens = estimateTokens(content);
    const completionTokens = estimateTokens(aiResponseText);
    const totalTokens = promptTokens + completionTokens;
    const cost = (totalTokens / 1000) * 0.00125;

    const metric = await Metric.create({
      user: req.user._id,
      model: 'gemini-1.5-flash-vertex',
      endpoint: 'message',
      promptTokens,
      completionTokens,
      totalTokens,
      latency,
      status: 'success',
      cost,
      input: content.substring(0, 500),
      output: aiResponseText.substring(0, 500)
    });

    // 6. Log to BigQuery for high-performance analytics
    logToBigQuery(metric);

    res.json({ userMessage, aiMessage });
  } catch (error) {
    console.error('Chat message error:', error);
    const latency = Date.now() - startTime;
    await Metric.create({
      user: req.user._id,
      model: 'gemini-1.5-flash-vertex',
      endpoint: 'message',
      latency,
      status: 'error',
      errorMessage: error.message
    });
    res.status(500).json({ message: error.message });
  }
});

// @desc    Translate a message via Vertex AI
// @route   POST /api/chat/translate
// @access  Private
router.post('/translate', protect, async (req, res) => {
  const { text, targetLanguage } = req.body;
  const startTime = Date.now();
  try {
    const prompt = `Translate the following text to ${targetLanguage || 'English'}: \n\n${text}`;
    const result = await generativeModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    const aiResponseText = result.response.candidates[0].content.parts[0].text;
    const latency = Date.now() - startTime;

    const totalTokens = estimateTokens(prompt) + estimateTokens(aiResponseText);
    const cost = (totalTokens / 1000) * 0.00125;

    const metric = await Metric.create({
      user: req.user._id,
      endpoint: 'translate',
      totalTokens,
      latency,
      status: 'success',
      cost,
      input: text.substring(0, 500),
      output: aiResponseText.substring(0, 500)
    });

    logToBigQuery(metric);

    res.json({ translatedText: aiResponseText });
  } catch (error) {
    await Metric.create({
      user: req.user._id,
      endpoint: 'translate',
      latency: Date.now() - startTime,
      status: 'error',
      errorMessage: error.message
    });
    res.status(500).json({ message: error.message });
  }
});

// @desc    Transcribe via GCP Speech-to-Text & Vertex AI
// @route   POST /api/chat/transcribe
// @access  Private
router.post('/transcribe', protect, async (req, res) => {
  const { fileUrl, fileType } = req.body;
  const startTime = Date.now();
  try {
    let transcriptionText = '';

    if (fileType === 'audio') {
      const gcsUri = fileUrl.replace('https://storage.googleapis.com/', 'gs://');
      const [response] = await speechClient.recognize({
        audio: { uri: gcsUri },
        config: { encoding: 'LINEAR16', languageCode: 'en-US' },
      });
      transcriptionText = response.results.map(result => result.alternatives[0].transcript).join('\n');
    } else {
      // For images/docs, use Vertex AI directly
      const prompt = `Please analyze and summarize this ${fileType} file located at ${fileUrl}.`;
      const result = await generativeModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      transcriptionText = result.response.candidates[0].content.parts[0].text;
    }

    const latency = Date.now() - startTime;
    const totalTokens = estimateTokens(transcriptionText);
    const cost = (totalTokens / 1000) * 0.00125;

    const metric = await Metric.create({
      user: req.user._id,
      endpoint: 'transcribe',
      totalTokens,
      latency,
      status: 'success',
      cost,
      input: fileUrl,
      output: transcriptionText.substring(0, 500)
    });

    logToBigQuery(metric);

    res.json({ transcription: transcriptionText });
  } catch (error) {
    await Metric.create({
      user: req.user._id,
      endpoint: 'transcribe',
      latency: Date.now() - startTime,
      status: 'error',
      errorMessage: error.message
    });
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a chat
// @route   DELETE /api/chat/:chatId
// @access  Private
router.delete('/:chatId', protect, async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.chatId, users: req.user._id });
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    await Chat.deleteOne({ _id: req.params.chatId });
    await Message.deleteMany({ chat: req.params.chatId });
    
    res.json({ message: 'Chat removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Rename a chat
// @route   PATCH /api/chat/:chatId
// @access  Private
router.patch('/:chatId', protect, async (req, res) => {
  const { title } = req.body;
  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.chatId, users: req.user._id },
      { title },
      { new: true }
    );
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
