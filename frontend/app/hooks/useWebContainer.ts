import { WebContainer } from "@webcontainer/api";
import { useEffect, useState } from "react";

const useWebContainer =  () => {
    const [webContainer, setWebContainer] = useState<WebContainer>()
    async function boot() {
      const webcontainerInstance = await WebContainer.boot();
      setWebContainer(webcontainerInstance)
    }
  useEffect(() => {
    boot();
  }, []);

  return webContainer
};

export default useWebContainer;
