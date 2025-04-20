const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'user_profiles',           // Upload into this folder :contentReference[oaicite:5]{index=5}
    format: async (req, file) => 'png',// Or derive from file.mimetype :contentReference[oaicite:6]{index=6}
    public_id: (req, file) =>
      `profile_${req.user.userId}_${Date.now()}`, // Unique name :contentReference[oaicite:7]{index=7}
  },
});

const parser = multer({ storage });

module.exports = parser;

