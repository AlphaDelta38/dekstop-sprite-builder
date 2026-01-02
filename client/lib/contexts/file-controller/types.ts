import { Dispatch, SetStateAction } from "react";

interface FilesState {
  texturePaths: string[];
  skeletonPaths: string[];
  atlasPath: string;
}

interface FileControllerModel  {
  files: FilesState;
  setFiles: Dispatch<SetStateAction<FilesState>>;
}

export type { FilesState, FileControllerModel };