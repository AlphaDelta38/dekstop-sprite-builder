'use client';

import { useFileController } from "@/app/lib/contexts/file-controller/index.";
import { useEffect, useMemo, useState } from "react";
import { Box, Button, IconButton } from "@mui/material";

import Sequences from "./sections/sequences";
import SpriteParts from "./sections/sprite-parts";
import StaticBuilt from "./sections/static-built";
import Animations from "./sections/animations";
import { Settings } from "@mui/icons-material";
import useModal from "@/app/lib/hooks/modal.hooks";
import SettingsModalContent from "./components/settings-modal-content";
import usePersistantState from "@/app/lib/hooks/persistant-state";
import { PersistantKey } from "@/app/lib/types/persistant-types";
import buildSprite from "./utils/build-sprite";
import { Spine } from "@pixi-spine/runtime-4.1";
import { useCacheController } from "@/app/lib/contexts/cache-controller";
import { CacheKey } from "@/app/lib/contexts/cache-controller/types";
import { FFmpeg } from "@ffmpeg/ffmpeg";

interface RenderPhase {
  buttonClicked: boolean;
  spineSkeletonsRendered: boolean;
}

function AthlasViewRender() {
  const { setCache } = useCacheController();
  const { filesIsReady, files } = useFileController();
  const { closeModal, openModal, Modal } = useModal();

  const [ffmpeg, setFFmpeg] = useState<FFmpeg | null>(null);

  useEffect(() => {
    const instance = new FFmpeg();
    setFFmpeg(instance);
  }, []);


  const [renderKey, setRenderKey] = useState(0);
  const [renderPhasesState, setRenderPhasesState] = useState<RenderPhase>({
    buttonClicked: false,
    spineSkeletonsRendered: false,
  });

  const [settings, setSettings] = usePersistantState<PersistantKey.ATHLAS_RENDER_SETTINGS>(PersistantKey.ATHLAS_RENDER_SETTINGS, {
    spineAnimations: true,
    staticBuild: true,
    spriteParts: true,
    sequences: true,
  });

  const handleRenderClick = () => {
    setRenderPhasesState(prev => ({ ...prev, buttonClicked: true }));
    setRenderKey(prev => prev + 1);
  };

  const calculateSpineSkeletonsRendered = async () => {
    if (!files.indexAtlas) return;

    const spineSkeletons: Record<string, Spine> = {};

    for (const json of files.jsons) {
      const spriteData = await buildSprite({ athlas: files.indexAtlas, skeleton: json, textures: files.images });
      spineSkeletons[json.name] = spriteData;
    }

    setCache<CacheKey.SPRITE_SPINE_DATA>(CacheKey.SPRITE_SPINE_DATA, spineSkeletons);
    setRenderPhasesState(prev => ({ ...prev, spineSkeletonsRendered: true }));
  }

  useEffect(() => {
    if (renderPhasesState.buttonClicked && (settings.spineAnimations || settings.staticBuild || settings.sequences)) {
      calculateSpineSkeletonsRendered();
    }
  }, [renderPhasesState.buttonClicked, renderKey]);


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>

      <Box sx={{ display: 'flex', gap: 2, width: '100%', alignItems: 'center', justifyContent: 'flex-end', padding: 2 }}>

        <Button disabled={!filesIsReady} variant="contained" color="primary" onClick={handleRenderClick}>
          Render Sprites
        </Button>

        <IconButton onClick={() => openModal()}>
          <Settings sx={{ fontSize: 32 }} /> 
        </IconButton>

      </Box>

      {renderPhasesState.buttonClicked && 
        (
          <>
            {settings.spriteParts && <SpriteParts renderKey={renderKey} />}
            {settings.staticBuild && renderPhasesState.spineSkeletonsRendered && <StaticBuilt renderKey={renderKey} />}
            {settings.sequences && renderPhasesState.spineSkeletonsRendered && <Sequences renderKey={renderKey} />}
            {settings.spineAnimations && renderPhasesState.spineSkeletonsRendered && <Animations renderKey={renderKey} ffmpeg={ffmpeg} />}
          </>
        )
      }

      <Modal>
        <SettingsModalContent closeModal={closeModal} settings={settings} setSettings={setSettings} />
      </Modal>

    </Box>
  )
}

export default AthlasViewRender;