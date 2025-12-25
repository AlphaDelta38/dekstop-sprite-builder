"use client";

import { ArrowBack, ArrowForward, Download } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import React, { useEffect } from "react";

interface FolderHeaderProps {
  title: string;
  fullPath: string;
  onDownload: () => void;
  onBack: () => void;
  onForward: () => void;
  changeFolderTo: (path: string) => void;
}

function FolderHeader({ title, onDownload, onBack, onForward, fullPath, changeFolderTo }: FolderHeaderProps) {

  const preventDefaultBeHavior = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>, callback: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    callback();
  }

  useEffect(() => {
    console.log(fullPath);
  }, [fullPath]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: "space-between", width: '100%' }}>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
        <Typography variant="h5">{title}</Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center'}}>

          <IconButton component="div" onClick={(e) => preventDefaultBeHavior(e, onBack)}>
            <ArrowBack sx={{ fontSize: 24 }} />
          </IconButton>

          <IconButton component="div" onClick={(e) => preventDefaultBeHavior(e, onForward)}>
            <ArrowForward sx={{ fontSize: 24 }} />
          </IconButton>

        </Box>

      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {fullPath?.split("/").map((path, index) => (
          <React.Fragment key={index}>
            
            <Button component="div" onClick={(e) => preventDefaultBeHavior(e, () => changeFolderTo(path))} >{path}</Button>

            {index !== fullPath.split("/").length - 1 && <span>/</span>}

          </React.Fragment>
        ))}
      </Box>

      <IconButton 
        onClick={(e) => {preventDefaultBeHavior(e, onDownload)}} 
        component="div"
      >
        <Download />
      </IconButton>

    </Box>
  )
}

export default FolderHeader;
