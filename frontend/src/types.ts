export type ImageResponse = {
  images: string[];
  count: number;
};

export type FolderResponse = {
  folders: string[];
  count: number;
};

export type CreateFolderResponse = {
  folder: string;
  message: string;
};

export type MoveFailure = {
  folder: string;
  reason: string;
};

export type MoveImageResponse = {
  message: string;
  success: string[];
  failed: MoveFailure[];
};

export type ImageData = {
  name: string;
  size: number;
  modified: string;
};
