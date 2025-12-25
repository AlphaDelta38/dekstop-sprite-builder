"use client";

import { Box, Switch, Typography } from "@mui/material";

import styles from "./index.module.scss";

interface SwitcherProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

function Switcher({ checked, onChange, label }: SwitcherProps) {
  return (
    <Box className={styles.switcher}>
      <Typography variant="body1">{label}</Typography>
      <Switch checked={checked} onChange={() => onChange(!checked)} />
    </Box>
  )
}

export default Switcher;