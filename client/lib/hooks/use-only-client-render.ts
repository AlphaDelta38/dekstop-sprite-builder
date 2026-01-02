import { useEffect, useState } from "react";

const useOnlyClientRender = () => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}

export default useOnlyClientRender;
