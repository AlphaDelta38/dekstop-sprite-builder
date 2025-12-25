import { SettingsState } from "@/app/features/spine-sprites-builder/types";

export enum PersistantKey {
  ATHLAS_RENDER_SETTINGS = "athlas-render-settings",
}

export interface PersistantStateMap {
  [PersistantKey.ATHLAS_RENDER_SETTINGS]: SettingsState;
}

