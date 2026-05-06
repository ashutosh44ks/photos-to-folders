import fs from 'fs/promises';
import path from 'path';

const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

export async function scanImageDirectory(dirPath) {
  try {
    const stats = await fs.stat(dirPath);
    if (!stats.isDirectory()) {
      throw new Error('Path is not a directory');
    }

    const files = await fs.readdir(dirPath);
    const images = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return SUPPORTED_FORMATS.includes(ext);
    });

    return images.sort();
  } catch (error) {
    throw new Error(`Failed to scan directory: ${error.message}`);
  }
}

export async function listFolders(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    const folders = [];

    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const stats = await fs.stat(fullPath);
      if (stats.isDirectory()) {
        folders.push(file);
      }
    }

    return folders.sort();
  } catch (error) {
    throw new Error(`Failed to list folders: ${error.message}`);
  }
}

export async function createFolder(dirPath, folderName) {
  try {
    // Validate folder name (no path separators, no empty)
    if (!folderName || folderName.includes('/') || folderName.includes('\\')) {
      throw new Error('Invalid folder name');
    }

    const fullPath = path.join(dirPath, folderName);
    await fs.mkdir(fullPath, { recursive: false });
    return folderName;
  } catch (error) {
    if (error.code === 'EEXIST') {
      throw new Error('Folder already exists');
    }
    throw new Error(`Failed to create folder: ${error.message}`);
  }
}

export async function moveImageToFolders(dirPath, imageName, folderNames) {
  try {
    if (!folderNames || folderNames.length === 0) {
      throw new Error('No destination folders specified');
    }

    const sourceImagePath = path.join(dirPath, imageName);

    // Verify source image exists
    const sourceStats = await fs.stat(sourceImagePath);
    if (!sourceStats.isFile()) {
      throw new Error('Source image is not a file');
    }

    const results = { success: [], failed: [] };

    for (const folderName of folderNames) {
      try {
        const destPath = path.join(dirPath, folderName, imageName);

        // Check if destination already exists
        try {
          await fs.stat(destPath);
          results.failed.push({
            folder: folderName,
            reason: 'File already exists in destination'
          });
          continue;
        } catch (e) {
          // File doesn't exist, good to proceed
        }

        // Copy file to destination
        const destDir = path.join(dirPath, folderName);
        await fs.copyFile(sourceImagePath, destPath);
        results.success.push(folderName);
      } catch (error) {
        results.failed.push({
          folder: folderName,
          reason: error.message
        });
      }
    }

    // If at least one copy succeeded, delete the source
    if (results.success.length > 0) {
      try {
        await fs.unlink(sourceImagePath);
      } catch (error) {
        // Log but don't fail if deletion fails
        console.error('Failed to delete source image:', error.message);
      }
    }

    return results;
  } catch (error) {
    throw new Error(`Failed to move image: ${error.message}`);
  }
}

export async function getImageData(dirPath, imageName) {
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
    throw new Error(`Failed to get image data: ${error.message}`);
  }
}
