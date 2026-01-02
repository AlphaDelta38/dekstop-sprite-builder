"use client";

import { Box, IconButton, Typography } from "@mui/material";
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FloatingWindow from "../floating-window";


import styles from "./index.module.scss";
import { useState } from "react";


interface SpineCardProps {
  name: string;
}
  
function SpineCard({ name }: SpineCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(prev => !prev);
  }

  return (
    <Box className={styles.spineCard}>

      <Box className={styles.spineCardContentContainer}>
        <Box className={styles.spineCardInfoContainer}>

          <Box className={styles.spineIconContainer}>
            <AccessibilityNewIcon className={styles.spineIcon} />
          </Box>

          <Typography className={styles.spineCardName} variant="h6">{name}</Typography>

          <IconButton onClick={handleOpen}>
            <InfoOutlinedIcon className={styles.spineCardInfoButtonIcon} />
          </IconButton>

        </Box>
      </Box>

      {isOpen &&
        (
          <FloatingWindow linkType="window" draggHandleClassName={styles.dragIcon} onClose={() => setIsOpen(false)}>
            <Box className={styles.spineInfoContentContainer}>

            </Box>
          </FloatingWindow>
        )
      }

    </Box>
  )
}

export default SpineCard;
