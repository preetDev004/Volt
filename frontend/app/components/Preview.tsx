import { WebContainer } from "@webcontainer/api";
import { WebContainerDirectory, WebContainerFile } from "../type";
import { useEffect, useState } from "react";
import Loader from "./Loader";

const Preview = ({
  files,
  webContainer,
}: {
  files: Record<string, WebContainerDirectory | WebContainerFile> | undefined;
  webContainer: WebContainer | undefined;
}) => {
  const [url, setUrl] = useState("");
  const runProject = async () => {
    if (!webContainer || !files) {
      return;
    }
    try {
      const installProcess = await webContainer.spawn("npm", ["install"]);
      installProcess.output.pipeTo(
        new WritableStream({
          write(chunk) {
            console.log(chunk.toString());
          },
        })
      );

      const installExitCode = await installProcess.exit;

      if (installExitCode !== 0) {
        throw new Error("Unable to run npm install");
      }

      // `npm run dev`
      await webContainer.spawn("npm", ["run", "dev"]);

      webContainer.on("server-ready", (port, url) => {
        setUrl(url);
        console.log(`Server is running on ${url} at port ${port}`);
      });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    runProject();
  }, [webContainer, files]);

  if (!webContainer || !files) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <Loader subtext="Getting Projects Files..." />
      </div>
    );
  }
  return (
    <div className="w-full h-full">
      {url === "" ? (
        <div className="flex w-full h-full items-center justify-center">
          <Loader subtext="Starting Project..." />
        </div>
      ) : (
        <iframe
          className="rounded-b-md"
          title="Preview"
          src={url}
          width="100%"
          height="100%"
        />
      )}
    </div>
  );
};
export default Preview;
