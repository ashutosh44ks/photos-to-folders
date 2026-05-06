import React, { useState, useEffect } from 'react';
import ImageViewer from './components/ImageViewer';
import FolderList from './components/FolderList';
import CreateFolderModal from './components/CreateFolderModal';
import {
  fetchImages,
  fetchFolders,
  createFolder as apiCreateFolder,
  moveImageToFolders as apiMoveImageToFolders
} from './services/api';
import './App.css';

export default function App() {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [folders, setFolders] = useState([]);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  // Load images and folders on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError('');
      const [imagesRes, foldersRes] = await Promise.all([
        fetchImages(),
        fetchFolders()
      ]);
      setImages(imagesRes.images || []);
      setFolders(foldersRes.folders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFolder = (folderName) => {
    setSelectedFolders((prev) =>
      prev.includes(folderName)
        ? prev.filter((f) => f !== folderName)
        : [...prev, folderName]
    );
    setSuccess('');
  };

  const handleCreateFolder = async (folderName) => {
    try {
      await apiCreateFolder(folderName);
      const foldersRes = await fetchFolders();
      setFolders(foldersRes.folders || []);
      setSuccess(`Folder "${folderName}" created successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      throw err;
    }
  };

  const handleSaveAndNext = async () => {
    if (selectedFolders.length === 0) {
      setError('Please select at least one folder');
      return;
    }

    if (!images[currentImageIndex]) {
      setError('No image to save');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const currentImage = images[currentImageIndex];
      await apiMoveImageToFolders(currentImage, selectedFolders);

      // Remove saved image from list
      const newImages = images.filter((_, i) => i !== currentImageIndex);
      setImages(newImages);

      // Reset selection
      setSelectedFolders([]);

      // Move to next image or show completion
      if (newImages.length > 0) {
        // Adjust index if we're at the end
        const nextIndex =
          currentImageIndex >= newImages.length ? newImages.length - 1 : currentImageIndex;
        setCurrentImageIndex(nextIndex);
        setSuccess('Image saved and moved to folders!');
      } else {
        setSuccess('All images processed! 🎉');
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : 0));
    setSelectedFolders([]);
    setError('');
    setSuccess('');
  };

  const handleNext = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
      setSelectedFolders([]);
      setError('');
      setSuccess('');
    }
  };

  const currentImage = images[currentImageIndex];

  if (loading) {
    return (
      <div className="app loading">
        <div className="spinner"></div>
        <p>Loading images...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📁 Photos to Folders</h1>
        <p className="subtitle">Organize and move your images</p>
      </header>

      <div className="app-container">
        <div className="main-content">
          <ImageViewer
            imageName={currentImage}
            imageIndex={currentImageIndex}
            totalImages={images.length}
          />

          <div className="controls">
            <button
              onClick={handlePrevious}
              disabled={currentImageIndex === 0 || images.length === 0}
              className="btn btn-secondary"
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentImageIndex >= images.length - 1 || images.length === 0}
              className="btn btn-secondary"
            >
              Next →
            </button>
          </div>
        </div>

        <aside className="sidebar">
          <FolderList
            folders={folders}
            selectedFolders={selectedFolders}
            onToggleFolder={handleToggleFolder}
            onCreateFolder={() => setShowModal(true)}
          />

          <button
            onClick={handleSaveAndNext}
            disabled={selectedFolders.length === 0 || images.length === 0 || saving}
            className="btn btn-primary btn-save"
          >
            {saving ? 'Saving...' : '✓ Save & Next'}
          </button>

          {images.length === 0 && !loading && (
            <div className="empty-state">
              <p>No images found in the directory.</p>
              <p className="text-small">Check your IMAGE_DIRECTORY environment variable.</p>
            </div>
          )}
        </aside>
      </div>

      {error && <div className="notification error">{error}</div>}
      {success && <div className="notification success">{success}</div>}

      {showModal && (
        <CreateFolderModal
          onClose={() => setShowModal(false)}
          onFolderCreated={handleCreateFolder}
        />
      )}
    </div>
  );
}
