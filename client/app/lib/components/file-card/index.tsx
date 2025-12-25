"use client";

import { Card, CardContent, CardMedia, Button, Typography, Box } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";


interface FileCardProps {
  name: string;
  preview: string;
  fileType: string;
  actions: React.ReactNode;
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
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "column",
        gap: 2,
        padding: 2,
        width: width,
        height: height
      }}
      className={className}
      onClick={onClick}
    >

      <Box sx={{ width: "100%", height: "80%", display: "flex", justifyContent: "center", alignItems: "center" }}>

        {fileType === "image" && (
          <CardMedia
            component="img"
            src={preview}
            alt={name}
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: 1,
              objectFit: "contain"
            }}
          />
        )}


        {fileType === "video" && (
          <video
            src={preview}
            autoPlay
            loop
            muted
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 8,
              objectFit: "cover"
            }}
          />
        )}

        {fileType === "icon" && (
          icon || <InsertDriveFileIcon sx={{ fontSize: 50 }} />
        )}

      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 , justifyContent: "space-between", width: "100%", flexDirection: actionContainerDirection }}>
        <CardContent sx={{ flex: 1, padding: "0 !important" }}>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {name}
          </Typography>
        </CardContent>
        
        {actions}

      </Box>

    </Card>
  );
}

export default FileCard;