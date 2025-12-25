"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PersistantKey, PersistantStateMap } from "../types/persistant-types";

function usePersistantState<T extends PersistantKey>(key: PersistantKey, initialValue: PersistantStateMap[T]): [PersistantStateMap[T], Dispatch<SetStateAction<PersistantStateMap[T]>>] {
  const [state, setState] = useState<PersistantStateMap[T]>(initialValue);

  useEffect(() => {
    const item = localStorage.getItem(key);
    if (item) {
      setState(JSON.parse(item));
    }
  }, [key]);

  useEffect(() => {
    if (state) {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [state]);

  return [state, setState] as const;
}

export default usePersistantState;