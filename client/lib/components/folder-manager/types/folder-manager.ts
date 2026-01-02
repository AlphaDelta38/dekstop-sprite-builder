
interface IFolder {
  name: string;
  filePaths: { name: string, parentFolderPath: string, fileFullPath: string }[];
  folders: IFolder[];
}

interface PathState {
  fullPath: string;
  prevFolder: string;
}

interface FileComponentProps {
  file: { name: string, parentFolderPath: string, fileFullPath: string };
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