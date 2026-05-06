const API_BASE = '/api';

export const fetchImages = async () => {
  const res = await fetch(`${API_BASE}/images`);
  if (!res.ok) throw new Error('Failed to fetch images');
  return res.json();
};

export const fetchFolders = async () => {
  const res = await fetch(`${API_BASE}/folders`);
  if (!res.ok) throw new Error('Failed to fetch folders');
  return res.json();
};

export const createFolder = async (folderName) => {
  const res = await fetch(`${API_BASE}/folders/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folderName })
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to create folder');
  }
  return res.json();
};

export const moveImageToFolders = async (imageName, folderNames) => {
  const res = await fetch(`${API_BASE}/folders/move-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageName, folderNames })
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to move image');
  }
  return res.json();
};

export const getImageUrl = (imageName) => {
  return `${API_BASE}/images/${imageName}`;
};
