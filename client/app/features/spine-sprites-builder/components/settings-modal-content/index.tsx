"use client";

import Switcher from "@/app/lib/components/switcher";
import Close from "@mui/icons-material/Close";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { SettingsState } from "../../types";
import { Dispatch, SetStateAction, useState } from "react";

interface SettingsModalContentProps {
  closeModal: () => void;
  settings: SettingsState;
  setSettings: Dispatch<SetStateAction<SettingsState>>;
}

function SettingsModalContent({ closeModal, settings, setSettings }: SettingsModalContentProps) {
  const [initialState, setInitialState] = useState<SettingsState>(settings);

  const onSave = () => {
    setSettings(initialState);
    closeModal();
  }

  return (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2}}>

    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="h6">Render Settings</Typography>
      <IconButton onClick={() => closeModal()}>
        <Close />
      </IconButton>
    </Box>
    
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: "400px"}}>
      <Switcher checked={initialState.spineAnimations} onChange={() => setInitialState({ ...initialState, spineAnimations: !settings.spineAnimations })} label="Spine Animations" />
      <Switcher checked={initialState.staticBuild} onChange={() => setInitialState({ ...initialState, staticBuild: !settings.staticBuild })} label="Static build" />
      <Switcher checked={initialState.spriteParts} onChange={() => setInitialState({ ...initialState, spriteParts: !settings.spriteParts })} label="Sprite Parts" />
      <Switcher checked={initialState.sequences} onChange={() => setInitialState({ ...initialState, sequences: !settings.sequences })} label="Sequences" />
    </Box>
    
    <Button variant="contained" color="primary" onClick={onSave}>Save</Button>
  </Box>
  )
}

export default SettingsModalContent;