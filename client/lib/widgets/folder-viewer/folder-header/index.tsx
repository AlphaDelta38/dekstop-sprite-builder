"use client";

import { ArrowBack, ArrowForward, Download } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import React, { useEffect } from "react";

interface FolderHeaderProps {
  title: string;
  fullPath: string;
  onBack: () => void;
  onForward: () => void;
  changeFolderTo: (path: string) => void;
}

function FolderHeader({ title, onBack, onForward, fullPath, changeFolderTo }: FolderHeaderProps) {

  const preventDefaultBeHavior = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>, callback: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    callback();
  }

  return (
    <Box className="flex items-center gap-1 justify-between w-full">
      
      <Box className="flex items-center gap-2">
        <Typography className="text-[#9CA3AF]" variant="h5">{title}</Typography>
        
        <Box className="flex items-center">

          <IconButton component="div" onClick={(e) => preventDefaultBeHavior(e, onBack)}>
            <ArrowBack className="text-[#9CA3AF]! font-size-24 hover:text-white!"/>
          </IconButton>

          <IconButton component="div" onClick={(e) => preventDefaultBeHavior(e, onForward)}>
            <ArrowForward className="text-[#9CA3AF]! font-size-24 hover:text-white!" />
          </IconButton>

        </Box>

      </Box>

      <Box className="flex items-center gap-1">
        {fullPath?.split("/").map((path, index) => (
          <React.Fragment key={index}>
            
            <Button component="div" onClick={(e) => preventDefaultBeHavior(e, () => changeFolderTo(path))} >{path}</Button>

            {index !== fullPath.split("/").length - 1 && <span>/</span>}

          </React.Fragment>
        ))}
      </Box>

    </Box>
  )
}

export default FolderHeader;
