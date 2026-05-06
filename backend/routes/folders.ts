import express, { type Request, type Response } from 'express';
import { createFolder, listFolders, moveImageToFolders } from '../services/fileService.js';

type CreateFolderBody = {
  folderName?: string;
};

type MoveImageBody = {
  imageName?: string;
  folderNames?: string[];
};

export function initFolderRoutes(imageDirectory: string) {
  const router = express.Router();

  router.get('/', async (_req: Request, res: Response) => {
    try {
      const folders = await listFolders(imageDirectory);
      res.json({ folders, count: folders.length });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  });

  router.post('/create', async (req: Request<unknown, unknown, CreateFolderBody>, res: Response) => {
    try {
      const { folderName } = req.body;

      if (!folderName) {
        return res.status(400).json({ error: 'folderName is required' });
      }

      const newFolder = await createFolder(imageDirectory, folderName);
      return res.status(201).json({ folder: newFolder, message: 'Folder created successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(400).json({ error: message });
    }
  });

  router.post('/move-image', async (req: Request<unknown, unknown, MoveImageBody>, res: Response) => {
    try {
      const { imageName, folderNames } = req.body;

      if (!imageName) {
        return res.status(400).json({ error: 'imageName is required' });
      }

      if (!Array.isArray(folderNames) || folderNames.length === 0) {
        return res.status(400).json({ error: 'folderNames must be a non-empty array' });
      }

      const result = await moveImageToFolders(imageDirectory, imageName, folderNames);

      if (result.success.length === 0) {
        return res.status(400).json({
          error: 'Failed to move image to any folders',
          details: result.failed
        });
      }

      return res.json({
        message: 'Image moved successfully',
        success: result.success,
        failed: result.failed
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(400).json({ error: message });
    }
  });

  return router;
}