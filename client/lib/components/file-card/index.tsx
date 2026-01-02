"use client";

import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import clsx from "clsx";

interface FileCardProps {
  name: string;
  preview: string;
  fileType: string;
  actions?: React.ReactNode;
  width?: number;
  height?: number;
  className?: string;
  actionContainerDirection?: "row" | "column";
  icon?: React.ReactNode;
  onClick?: () => void;
}

function FileCard({
  name,
  preview,
  fileType,
  actionContainerDirection = "row",
  actions,
  width = 350,
  height = 250,
  className,
  icon,
  onClick,
}: FileCardProps) {
  return (
    <Card className={clsx("flex items-center justify-between flex-col gap-2 p-2 h-[10%] w-[15%] min-h-[10%] min-w-[15%]", className)} onClick={onClick}>

      <Box className="w-full h-full flex justify-center items-center overflow-hidden">

        {fileType === "image" && (
          <CardMedia
            component="img"
            src={preview}
            alt={name}
            className="flex-1 rounded-1 object-contain!"

          />
        )}


        {fileType === "video" && (
          <video
            src={preview}
            autoPlay
            loop
            muted
            className="flex-1 rounded-lg object-cover"
          />
        )}

        {fileType === "icon" && (
          <Box className="flex-1 flex justify-center items-center">
            {icon || <InsertDriveFileIcon sx={{ fontSize: 50 }} />}
          </Box>
        )}

      </Box>

      <Box className="flex items-center gap-2 justify-between w-full" style={{ flexDirection: actionContainerDirection }}>
        <CardContent className="flex-1 p-2!">
          <Typography className="font-weight-500">
            {name}
          </Typography>
        </CardContent>
        
        {actions}

      </Box>

    </Card>
  );
}

export default FileCard;