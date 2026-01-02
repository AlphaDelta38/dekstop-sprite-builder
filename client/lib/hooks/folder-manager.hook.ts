"use client";

import { PathState } from "@/lib/components/folder-manager/types/folder-manager";
import { Dispatch, SetStateAction, useRef, useState } from "react";


interface returnProps {
  handleBackFolder: () => void;
  handleForwardFolder: () => void;
  changeFolderTo: (path: string) => void;
  fullPath: string;
  props: {
    setPathStateCallback: (setPathState: Dispatch<SetStateAction<PathState>>) => void;
    onPathChange: (fullPath: string) => void;
  }
}

function useFolderManager(): returnProps {
  const [fullPath, setFullPath] = useState<string>("");
  const pathStateCallbackRef= useRef<Dispatch<SetStateAction<PathState>>>(() => {});

  const initPathStateCallback = (setPathState: Dispatch<SetStateAction<PathState>>) => {
    pathStateCallbackRef.current = setPathState;
  }

  const handleBackFolder = () => {
    pathStateCallbackRef.current((prev) => {
      const result = {
        fullPath: prev.fullPath,
        prevFolder: prev.fullPath,
      }

      const parsedPaths = prev.fullPath.split("/");
      
      if (parsedPaths.length > 1) {
        const lastPath = parsedPaths.pop();

        result.fullPath = parsedPaths.join("/");
        result.prevFolder = lastPath ?? "";
      }

      return result;
    });
  }

  const handleForwardFolder = () => {
    pathStateCallbackRef.current((prev) => {
      if (prev.prevFolder === (prev.fullPath.split("/").pop() ?? "")) return prev;

      const parsedPaths = prev.fullPath.split("/");
      
      parsedPaths.push(prev.prevFolder);

      const newFullPath = parsedPaths.join("/");

      return {
        prevFolder: prev.prevFolder,
        fullPath: newFullPath,
      }
    });
  }

  const onPathChange = (fullPath: string) => {
    setFullPath(fullPath);
  }


  const changeFolderTo = (path: string) => {
    const parsedPaths = fullPath.split("/");
    const indexOfPath = parsedPaths.indexOf(path);
    const newFullPath = parsedPaths.slice(0, indexOfPath + 1).join("/");

    setFullPath(newFullPath);

    pathStateCallbackRef.current((prev) => ({
      fullPath: newFullPath,
      prevFolder: parsedPaths[parsedPaths.length - 1] ?? "",
    }))
  }

  return {
    fullPath,
    handleBackFolder,
    handleForwardFolder,
    changeFolderTo,
    props: {
      setPathStateCallback: initPathStateCallback,
      onPathChange,
    }
  }
}

export default useFolderManager;