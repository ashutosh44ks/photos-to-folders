# Photos to Folders

A web app to organize and bulk-move images into multiple folders. View images one at a time, create destination folders on the fly, toggle-select multiple folders per image, then save to move the image to all selected folders.

## Features

- 🖼️ View images one at a time with a clean UI
- 📁 Create new folders directly from the app
- ✓ Toggle-select multiple destination folders per image
- 🚀 Move images to selected folders with a single click
- ⚡ Auto-advance to the next image after saving
- 🎯 Navigate previous/next with keyboard shortcuts
- 📦 Supports JPG, PNG, GIF, WebP formats

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React + Vite
- **Config**: Environment variables (.env)

## Setup

### Prerequisites

- Node.js (v14+)
- npm or yarn

**macOS / Linux**
```bash
./setup.sh
```

**Windows** (Git Bash or WSL)
```bash
bash setup.sh
```

This installs backend and frontend dependencies and creates `backend/.env` from `.env.example` if missing.

Edit `backend/.env` and set your image directory:

```
PORT=5000
IMAGE_DIRECTORY=/path/to/your/images
```

## Start servers

**macOS / Linux**
```bash
./start-server.sh
```

**Windows** (Git Bash or WSL)
```bash
bash start-server.sh
```

Starts backend (`http://localhost:5000`) and frontend (`http://localhost:3000`). Ctrl+C stops both.

## Usage

1. **View Images**: The app displays images from your configured directory one at a time
2. **Create Folders**: Click "+ New Folder" to create destination folders (created inside your image directory)
3. **Select Folders**: Toggle checkboxes to select multiple folders for the current image
4. **Save & Move**: Click "✓ Save & Next" to move the image to all selected folders and auto-advance to the next image
5. **Navigate**: Use "Previous/Next" buttons to browse images without saving

## Workflow

1. Image appears in the viewer
2. Select one or more destination folders
3. Click "Save & Next"
4. Image is **moved** (not copied) to all selected folders
5. Automatically advance to the next image
6. Repeat until all images are organized

## API Endpoints

### Images
- `GET /api/images` - Get list of all images in the directory
- `GET /api/images/:imageName` - Get metadata for a specific image

### Folders
- `GET /api/folders` - Get list of all folders in the directory
- `POST /api/folders/create` - Create a new folder
  ```json
  { "folderName": "Archive" }
  ```
- `POST /api/folders/move-image` - Move image to folders
  ```json
  { "imageName": "photo.jpg", "folderNames": ["Archive", "Backup"] }
  ```

### Health Check
- `GET /api/health` - Check server status

## Development

### Build Frontend for Production
```bash
cd frontend
npm run build
```

Output will be in `frontend/dist/`

### Project Structure

```
photos-to-folders/
├── setup.sh
├── start-server.sh
├── backend/
│   ├── server.js              # Express server entry point
│   ├── routes/
│   │   ├── images.js          # Image endpoints
│   │   └── folders.js         # Folder management endpoints
│   ├── services/
│   │   └── fileService.js     # File system operations
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main app component
│   │   ├── App.css            # Main styles
│   │   ├── main.jsx           # React entry point
│   │   ├── components/
│   │   │   ├── ImageViewer.jsx
│   │   │   ├── FolderList.jsx
│   │   │   └── CreateFolderModal.jsx
│   │   └── services/
│   │       └── api.js         # API client
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .gitignore
└── README.md
```

## Troubleshooting

### Images Not Loading
- Ensure `IMAGE_DIRECTORY` in `.env` points to a valid directory with images
- Check that the backend is running on port 5000
- Verify the backend and frontend are both running

### "No images to display"
- Check the `IMAGE_DIRECTORY` path exists and contains supported image formats (JPG, PNG, GIF, WebP)
- Ensure your user has read permissions on the directory

### Port Already in Use
- Backend (port 5000): Change `PORT` in `.env`
- Frontend (port 3000): Vite will automatically use the next available port

## License

ISC
