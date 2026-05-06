import React from 'react';
import './FolderList.css';

export default function FolderList({ folders, selectedFolders, onToggleFolder }) {
  return (
    <div className="folder-list-container">
      <div className="folder-list-header">
        <h3>Folders</h3>
      </div>

      {folders.length === 0 ? (
        <div className="no-folders">
          <p>No folders yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="folder-list">
          {folders.map((folder) => (
            <label key={folder} className="folder-item">
              <input
                type="checkbox"
                checked={selectedFolders.includes(folder)}
                onChange={() => onToggleFolder(folder)}
              />
              <span className="folder-name">{folder}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
