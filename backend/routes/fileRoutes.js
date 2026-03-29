const express = require('express');
const multer = require('multer');
const { bucket } = require('../config/gcp');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
});

// @desc    Upload a file to Google Cloud Storage
// @route   POST /api/files/upload
// @access  Private
router.post('/upload', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const blob = bucket.file(`teja_assets/${Date.now()}_${req.file.originalname}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
      gzip: true,
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    blobStream.on('error', (err) => {
      res.status(500).json({ message: err.message });
    });

    blobStream.on('finish', async () => {
      // The public URL can be used to directly access the file via HTTP.
      // Note: Make sure the bucket is publicly accessible or use signed URLs.
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      
      res.json({
        fileUrl: publicUrl,
        fileName: req.file.originalname,
        fileType: req.file.mimetype.split('/')[0] === 'application' ? 'document' : req.file.mimetype.split('/')[0]
      });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
