'use client';

import { Box } from "@mui/material";
import PixiView from "../../features/pixi-view";
import SpineCardList from "../../lib/widgets/spineCardList";

import styles from './index.module.scss';

function HomePage() {

  return (
    <Box className={styles.pageContainer}>
      <Box className={styles.spineSpritesChooseContainer}>
        <SpineCardList />
      </Box>
      <Box className={styles.spineSpritesViewContainer}>
        <Box className={styles.actionContainer}>

        </Box>
        <Box className={styles.pixiViewContainer}>
          <PixiView />
        </Box>
        <Box className={styles.bottomManagePanelContainer}>

        </Box>
      </Box>
    </Box>
  );
}

export default HomePage;