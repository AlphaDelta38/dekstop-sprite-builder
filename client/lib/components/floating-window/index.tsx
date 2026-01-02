"use client";

import { Rnd } from 'react-rnd';
import { PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ClearIcon from '@mui/icons-material/Clear';

import styles from './index.module.scss';
import { Box, IconButton } from '@mui/material';

interface FloatingWindowProps {
  minWidth?: number;
  minHeight?: number;
  className?: string;
  draggHandleClassName?: string;
  linkType?: 'window' | 'parent';
  enableResizing?: boolean;
  header?: React.ReactNode;
  onClose: () => void;
}

function FloatingWindow({ 
  children, 
  className, 
  draggHandleClassName, 
  linkType = 'window',
  minWidth = 200, 
  minHeight = 100,
  enableResizing = false,
  header = true,
  onClose,
}: PropsWithChildren<FloatingWindowProps>) {
  const [centerPos, setCenterPos] = useState<{x: number, y: number} | null>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (measureRef.current && !centerPos) {
      const { width, height } = measureRef.current.getBoundingClientRect();
      
      setCenterPos({
        x: (window.innerWidth - width) / 2,
        y: (window.innerHeight - height) / 2,
      });
    }
  }, []);

  if (!centerPos) {
    return createPortal(
      <div 
        ref={measureRef} 
        className={`${styles.floatingWindow} ${className}`}
        style={{ 
          position: 'absolute', 
          left: 0,
          top: 0,
          opacity: 0,
          pointerEvents: 'none',
          width: 'fit-content',
          height: 'fit-content'
        }}
      >
        {children}
      </div>, 
      document.body
    );
  }

  const floatingwindow = (
    <Rnd
      default={{
        x: centerPos.x,
        y: centerPos.y,
        width: "auto",
        height: "auto"
      }}
      enableResizing={enableResizing}
      minWidth={minWidth}
      minHeight={minHeight}
      dragHandleClassName={draggHandleClassName}
      bounds={linkType}
      className={`${styles.floatingWindow} ${className}`}
    >
      {header && (
        <Box className={styles.gragHandleIconContainer}>
          <MoreHorizIcon className={styles.dragIcon}/>

          <Box className="flex items-center justify-end w-full">
            <IconButton onClick={onClose}>
              <ClearIcon className={styles.clearIcon}/>
            </IconButton>
          </Box>
      
        </Box>
      )}
      {children}
    </Rnd>
  );

  return createPortal(floatingwindow, document.body);
};

export default FloatingWindow;