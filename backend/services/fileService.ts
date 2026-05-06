import fs from 'fs/promises';
import path from 'path';

const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

export type MoveResult = {
  success: string[];
  failed: Array<{ folder: string; reason: string }>;
};

export type ImageData = {
  name: string;
  size: number;
  modified: string;
};

export async function scanImageDirectory(dirPath: string): Promise<string[]> {
  try {
    const stats = await fs.stat(dirPath);
    if (!stats.isDirectory()) {
      throw new Error('Path is not a directory');
    }

    const files = await fs.readdir(dirPath);
    const images = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return SUPPORTED_FORMATS.includes(ext);
    });

    return images.sort();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to scan directory: ${message}`);
  }
}

export async function listFolders(dirPath: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dirPath);
    const folders: string[] = [];

    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const stats = await fs.stat(fullPath);
      if (stats.isDirectory()) {
        folders.push(file);
      }
    }

    return folders.sort();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to list folders: ${message}`);
  }
}

export async function createFolder(dirPath: string, folderName: string): Promise<string> {
  try {
    if (!folderName || folderName.includes('/') || folderName.includes('\\')) {
      throw new Error('Invalid folder name');
    }

    const fullPath = path.join(dirPath, folderName);
    await fs.mkdir(fullPath, { recursive: false });
    return folderName;
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'EEXIST') {
      throw new Error('Folder already exists');
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to create folder: ${message}`);
  }
}

export async function moveImageToFolders(
  dirPath: string,
  imageName: string,
  folderNames: string[]
): Promise<MoveResult> {
  try {
    if (folderNames.length === 0) {
      throw new Error('No destination folders specified');
    }

    const sourceImagePath = path.join(dirPath, imageName);
    const sourceStats = await fs.stat(sourceImagePath);
    if (!sourceStats.isFile()) {
      throw new Error('Source image is not a file');
    }

    const results: MoveResult = { success: [], failed: [] };

    for (const folderName of folderNames) {
      try {
        const destPath = path.join(dirPath, folderName, imageName);

        try {
          await fs.stat(destPath);
          results.failed.push({
            folder: folderName,
            reason: 'File already exists in destination'
          });
          continue;
        } catch {
          // Destination file does not exist, proceed.
        }

        await fs.copyFile(sourceImagePath, destPath);
        results.success.push(folderName);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        results.failed.push({
          folder: folderName,
          reason: message
        });
      }
    }

    if (results.success.length > 0) {
      try {
        await fs.unlink(sourceImagePath);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Failed to delete source image:', message);
      }
    }

    return results;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to move image: ${message}`);
  }
}

export async function getImageData(dirPath: string, imageName: string): Promise<ImageData> {
  try {
    const fullPath = path.join(dirPath, imageName);
    const stats = await fs.stat(fullPath);

    if (!stats.isFile()) {
      throw new Error('Not a file');
    }

    return {
      name: imageName,
      size: stats.size,
      modified: stats.mtime.toISOString()
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to get image data: ${message}`);
  }
}

export async function renameFolder(dirPath: string, oldName: string, newName: string): Promise<string> {
  try {
    if (!oldName || oldName.includes('/') || oldName.includes('\\')) {
      throw new Error('Invalid old folder name');
    }
    if (!newName || newName.includes('/') || newName.includes('\\')) {
      throw new Error('Invalid new folder name');
    }

    const oldPath = path.join(dirPath, oldName);
    const newPath = path.join(dirPath, newName);

    // Check if old folder exists
    const oldStats = await fs.stat(oldPath);
    if (!oldStats.isDirectory()) {
      throw new Error('Source folder does not exist');
    }

    // Check if new folder name already exists
    try {
      await fs.stat(newPath);
      throw new Error('Folder with new name already exists');
    } catch (error) {
      if (error instanceof Error && error.message === 'Folder with new name already exists') {
        throw error;
      }
      // File does not exist, proceed with rename
    }

    await fs.rename(oldPath, newPath);
    return newName;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to rename folder: ${message}`);
  }
}

export async function deleteFolder(dirPath: string, folderName: string): Promise<void> {
  try {
    if (!folderName || folderName.includes('/') || folderName.includes('\\')) {
      throw new Error('Invalid folder name');
    }

    const fullPath = path.join(dirPath, folderName);

    // Check if folder exists
    const stats = await fs.stat(fullPath);
    if (!stats.isDirectory()) {
      throw new Error('Folder does not exist');
    }

    // Check if folder is empty
    const files = await fs.readdir(fullPath);
    if (files.length > 0) {
      throw new Error('Folder is not empty');
    }

    await fs.rmdir(fullPath);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to delete folder: ${message}`);
  }
}