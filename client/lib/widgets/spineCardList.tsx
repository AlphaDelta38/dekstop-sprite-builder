"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import SpineCard from "../components/spine-card/iundex";
import { useFileController } from "@/lib/contexts/file-controller/index.";
import { useEffect, useMemo, useState } from "react";
import getFileFromDisk from "../utils/get-file-from-disk";

interface ISpineCardList {
  name: string;
  path: string;
}

function SpineCardList() {
  const { files } = useFileController();
  const [list, setList] = useState<ISpineCardList[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getList = async () => {
    const newList: ISpineCardList[] = [];

    for (const path of files.skeletonPaths) {
      const file = await getFileFromDisk(path);
      newList.push({ name: file.name, path, });
    }

    setList(newList);
    setIsLoading(false);
  }

  useEffect(() => {
    setIsLoading(true);
    getList();
  }, [files.skeletonPaths])

  const renderList = useMemo(() => {
    return list.map((item) => {
      return <SpineCard key={item.path} name={item.name} />
    })
  }, [list])


  return (
    <Box className="flex flex-col! gap-3 w-full h-full overflow-y-auto">
      {renderList}

      {renderList.length === 0 &&
        <Box className="flex items-center justify-center w-full h-full"> 
          {!isLoading && <Typography variant="h5" color="#9CA3AF">No spine skeletons found</Typography>}
          {isLoading && <CircularProgress color="primary" />}
        </Box>
      }
      
    </Box>
  )
}

export default SpineCardList;