
interface IFolder {
  name: string;
  files: File[];
  folders: IFolder[];
}

interface PathState {
  fullPath: string;
  prevFolder: string;
}

interface FileComponentProps {
  file: File;
}

interface FolderComponentProps {
  folder: IFolder;
  openFolderCallback: (folder: IFolder) => void;
}

type FileComponent = React.ComponentType<FileComponentProps>;
type FolderComponent = React.ComponentType<FolderComponentProps>;

export type { 
  IFolder,
  PathState,
  FileComponent,
  FolderComponent,
  FileComponentProps,
  FolderComponentProps,
};