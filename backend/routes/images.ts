import express, { type Request, type Response } from 'express';
import { getImageData, scanImageDirectory } from '../services/fileService.js';

export function initImageRoutes(imageDirectory: string) {
  const router = express.Router();

  router.get('/', async (_req: Request, res: Response) => {
    try {
      const images = await scanImageDirectory(imageDirectory);
      res.json({ images, count: images.length });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  });

  router.get('/:imageName', async (req: Request<{ imageName: string }>, res: Response) => {
    try {
      const { imageName } = req.params;
      const data = await getImageData(imageDirectory, imageName);
      res.json(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  });

  return router;
}