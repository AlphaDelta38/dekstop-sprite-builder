import PixiViewProvider from "@/features/pixi-view/context";
import CacheControllerProvider from "./cache-controller";
import FileControllerProvider from "./file-controller/index.";


function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <PixiViewProvider>
      <CacheControllerProvider>
        <FileControllerProvider>
          {children}
        </FileControllerProvider>
      </CacheControllerProvider>
    </PixiViewProvider>
  )
}

export default GlobalContextProvider; 