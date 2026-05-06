import express from 'express';
import { listFolders, createFolder, moveImageToFolders } from '../services/fileService.js';

const router = express.Router();

export function initFolderRoutes(imageDirectory) {
  router.get('/', async (req, res) => {
    try {
      const folders = await listFolders(imageDirectory);
      res.json({ folders, count: folders.length });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.post('/create', async (req, res) => {
    try {
      const { folderName } = req.body;
      
      if (!folderName) {
        return res.status(400).json({ error: 'folderName is required' });
      }

      const newFolder = await createFolder(imageDirectory, folderName);
      res.status(201).json({ folder: newFolder, message: 'Folder created successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.post('/move-image', async (req, res) => {
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

      res.json({
        message: 'Image moved successfully',
        success: result.success,
        failed: result.failed
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}

export default router;
