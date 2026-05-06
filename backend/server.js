import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { initImageRoutes } from './routes/images.js';
import { initFolderRoutes } from './routes/folders.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const IMAGE_DIRECTORY = process.env.IMAGE_DIRECTORY;

if (!IMAGE_DIRECTORY) {
  console.error('ERROR: IMAGE_DIRECTORY environment variable is not set');
  console.error('Please create a .env file with IMAGE_DIRECTORY=/path/to/images');
  process.exit(1);
}

console.log(`Using image directory: ${IMAGE_DIRECTORY}`);

// Middleware
app.use(cors());
app.use(express.json());

// Serve image files
app.use('/api/images/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(IMAGE_DIRECTORY, imageName);
  
  // Security: prevent path traversal attacks
  if (!imagePath.startsWith(IMAGE_DIRECTORY)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).json({ error: 'Image not found' });
    }
  });
});

// Routes
app.use('/api/images', initImageRoutes(IMAGE_DIRECTORY));
app.use('/api/folders', initFolderRoutes(IMAGE_DIRECTORY));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', imageDirectory: IMAGE_DIRECTORY });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
