import express from 'express';
import { scanImageDirectory, getImageData } from '../services/fileService.js';

const router = express.Router();

export function initImageRoutes(imageDirectory) {
  router.get('/', async (req, res) => {
    try {
      const images = await scanImageDirectory(imageDirectory);
      res.json({ images, count: images.length });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.get('/:imageName', async (req, res) => {
    try {
      const { imageName } = req.params;
      const data = await getImageData(imageDirectory, imageName);
      res.json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}

export default router;
