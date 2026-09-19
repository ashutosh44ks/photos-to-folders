# Photos to Folders

A local web app to sort images from a single inbox folder into destination folders. View one image at a time, pick one or more folders, then save to move the file (copied into each selected folder, then removed from the inbox).

## Demo

Sound on — the clicks are the whole point.

https://github.com/user-attachments/assets/70188fc4-a666-42fe-bea7-f9442b343fc6

## Features

- One-at-a-time viewer for JPG, PNG, GIF, and WebP
- Create, rename, and delete destination folders (delete only if empty)
- Hide folders you do not want in the picker
- Multi-select destinations per image, then Save & Next
- Keyboard: `←` / `→` navigate, `1`–`9` toggle folders, `Enter` save
- Light / dark / system theme
- Optional upcoming-image previews and remaining-count
- Folder list layout (vertical or horizontal)

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React 19, Vite, TypeScript, Tailwind, React Query
- **Config**: `backend/.env` (`PORT`, `IMAGE_DIRECTORY`)

## Setup

Needs Node.js 20+ and npm.

```bash
./setup.sh          # macOS / Linux
bash setup.sh       # Windows (Git Bash or WSL)
```

Installs backend and frontend deps and copies `backend/.env.example` to `backend/.env` if missing.

Default inbox is repo-root `test-images` (`IMAGE_DIRECTORY=../test-images` from the backend folder). Drop sample files there, or point `IMAGE_DIRECTORY` at your library (relative to `backend/` or absolute). Destination folders are created as subdirectories of that path. Only files sitting in the inbox root are listed — files already inside subfolders are not.

```
PORT=5000
IMAGE_DIRECTORY=../test-images
```

## Start

```bash
./start-server.sh          # macOS / Linux
bash start-server.sh       # Windows (Git Bash or WSL)
```

Backend: `http://localhost:5000`. Frontend: `http://localhost:3000` (proxies `/api` to the backend). Ctrl+C stops both.

## Usage

1. Open the app; the current inbox image fills the screen.
2. Open settings (gear) to create/rename/delete folders, hide folders, or change theme and layout.
3. Toggle destination folders for the current image (`1`–`9` or click).
4. **Save & Next** (`Enter`) copies the file into each selected folder, deletes it from the inbox, and advances.
5. Skip without saving using Previous / Next (`←` / `→`).

## API

Local-only. There is no auth.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/images` | List inbox image filenames |
| `GET` | `/api/images/:imageName` | Serve the image file |
| `GET` | `/api/folders` | List subfolders of `IMAGE_DIRECTORY` |
| `POST` | `/api/folders/create` | `{ "folderName": "Archive" }` |
| `POST` | `/api/folders/rename` | `{ "oldName": "Archive", "newName": "Keep" }` |
| `POST` | `/api/folders/delete` | `{ "folderName": "Archive" }` (empty folders only) |
| `POST` | `/api/folders/move-image` | `{ "imageName": "photo.jpg", "folderNames": ["Archive", "Backup"] }` |
| `GET` | `/api/health` | `{ status, imageDirectory }` |

## Development

```bash
cd backend && npm run dev    # tsx watch
cd frontend && npm run dev   # Vite on :3000
cd backend && npm run build  # dist/
cd frontend && npm run build # frontend/dist/
```

```
photos-to-folders/
├── setup.sh
├── start-server.sh
├── test-images/               # default inbox
├── backend/
│   ├── server.ts
│   ├── routes/
│   │   ├── images.ts
│   │   └── folders.ts
│   ├── services/fileService.ts
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── main.tsx
    │   ├── components/
    │   ├── hooks/
    │   └── services/
    ├── vite.config.js
    └── package.json
```

## Troubleshooting

**Images not loading** — `IMAGE_DIRECTORY` in `backend/.env` must exist (default `../test-images` at the repo root) and contain supported files at the root. Both servers must be running.

**Nothing here yet** — only root-level JPG/PNG/GIF/WebP are shown. Files already in subfolders are ignored.

**Port in use** — change `PORT` in `.env` for the backend. Vite picks the next free port if 3000 is taken. `start-server.sh` kills whatever is already on 5000.

## License

ISC
