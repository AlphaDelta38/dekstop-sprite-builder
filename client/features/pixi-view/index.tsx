'use client';

import { Box } from "@mui/material";
import { PixiScene } from "./widgets/pixi-scene";
import { CenterAxes } from "./components/сenter-axes.tsx";
import InfiniteGrid from "./components/infinity-gird";

function PixiView() {
  return (
    <Box width={'100%'} height={'100%'}>
      <PixiScene />
      <InfiniteGrid />
      <CenterAxes />
    </Box>
  )
}


export default PixiView;