'use client';
import { Box } from "@mui/material";
import FileDropzone from "@/lib/components/files-dropzone";
import FolderViewer from "@/lib/widgets/folder-viewer";

import styles from './index.module.scss';

function Page() {

  return (
    <Box className="flex w-full h-full">

      <Box className={styles.fileUploadContainer}>
        <FileDropzone allowsFileExtensions={{}} onDelete={() => {}} onDrop={() => {}} />
      </Box>

      <Box className={styles.fileListContainer}>
        <FolderViewer folderPath={"C:/Users/kiril/OneDrive/Рабочий стол/Новая папка"} />
      </Box>

    </Box>
  );
}

export default Page;