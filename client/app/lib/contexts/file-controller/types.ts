import { Dispatch, SetStateAction } from "react";

interface FilesState {
  images: File[];
  jsons: File[];
  atlases: File[];
  indexAtlas: File | null;
}

interface FileControllerModel  {
  files: FilesState;
  filesIsReady: boolean;
  setFiles: Dispatch<SetStateAction<FilesState>>;
}

export type { FilesState, FileControllerModel };