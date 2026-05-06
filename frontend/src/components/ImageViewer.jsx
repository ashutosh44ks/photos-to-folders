import React from 'react';
import './ImageViewer.css';

export default function ImageViewer({ imageName, imageIndex, totalImages }) {
  if (!imageName) {
    return (
      <div className="image-viewer">
        <div className="no-image">
          <p>No images to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="image-viewer">
      <div className="image-container">
        <img 
          src={`/api/images/${imageName}`} 
          alt={imageName}
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%23999"%3EImage not found%3C/text%3E%3C/svg%3E';
          }}
        />
      </div>
      <div className="image-info">
        <p className="image-name">{imageName}</p>
        <p className="image-counter">
          {imageIndex + 1} of {totalImages}
        </p>
      </div>
    </div>
  );
}
