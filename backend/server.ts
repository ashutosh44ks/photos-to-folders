import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { initImageRoutes } from './routes/images.js';
import { initFolderRoutes } from './routes/folders.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? '5000');
const IMAGE_DIRECTORY = process.env.IMAGE_DIRECTORY;

if (!IMAGE_DIRECTORY) {
  console.error('ERROR: IMAGE_DIRECTORY environment variable is not set');
  console.error('Please create a .env file with IMAGE_DIRECTORY=/path/to/images');
  process.exit(1);
}

const RESOLVED_IMAGE_DIRECTORY = path.resolve(IMAGE_DIRECTORY);

console.log(`Using image directory: ${RESOLVED_IMAGE_DIRECTORY}`);

app.use(cors());
app.use(express.json());

app.get('/api/images/:imageName', (req: Request<{ imageName: string }>, res: Response) => {
  const { imageName } = req.params;
  const imagePath = path.resolve(RESOLVED_IMAGE_DIRECTORY, imageName);

  if (!imagePath.startsWith(`${RESOLVED_IMAGE_DIRECTORY}${path.sep}`)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  return res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).json({ error: 'Image not found' });
    }
  });
});

app.use('/api/images', initImageRoutes(RESOLVED_IMAGE_DIRECTORY));
app.use('/api/folders', initFolderRoutes(RESOLVED_IMAGE_DIRECTORY));

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', imageDirectory: RESOLVED_IMAGE_DIRECTORY });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});