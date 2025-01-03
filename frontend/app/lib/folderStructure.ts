import { FileItem, Step, StepType } from "../type";

export const folderStructure = (files : FileItem[], projectSteps: Step[]) => {
  let originalFiles = [...files];
  let updateHappened = false;
  projectSteps
    .filter(({ status }) => status === "pending")
    .map((step) => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure = [...originalFiles]; // {}
        const finalAnswerRef = currentFileStructure;

        let currentFolder = "";
        while (parsedPath.length) {
          currentFolder = `${currentFolder}/${parsedPath[0]}`;
          const currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);

          if (!parsedPath.length) {
            // final file
            const file = currentFileStructure.find(
              (x) => x.path === currentFolder
            );
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: "file",
                path: currentFolder,
                content: step.code,
              });
            } else {
              console.log("updating file");
              file.content = step.code;
            }
          } else {
            /// in a folder
            const folder = currentFileStructure.find(
              (x) => x.path === currentFolder
            );
            if (!folder) {
              // create the folder
              currentFileStructure.push({
                name: currentFolderName,
                type: "folder",
                path: currentFolder,
                children: [],
              });
            }

            currentFileStructure = currentFileStructure.find(
              (x) => x.path === currentFolder
            )!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }
    });
    return {updateHappened, originalFiles}
};
