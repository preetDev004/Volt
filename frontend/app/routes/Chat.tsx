import Navbar from "../components/Navbar";
import ChatInput from "../components/ChatInput";
import { useActionData } from "@remix-run/react";
import CodeEditor from "../components/CodeEditor";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { parseXml } from "../lib/parseXml";
import { FileItem, Step, StepType } from "../type";
import VoltAction from "../components/VoltAction";
import { FileExplorer } from "../components/FileExplorer";

export async function action({ request }: { request: Request }) {
  try {
    const formData = await request.formData();
    const { message } = Object.fromEntries(formData);
    if (!message) {
      return { success: false, error: "No input provided" };
    }
    const templateResponse = await fetch(`${BACKEND_URL}/template`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!templateResponse.ok) {
      return {
        success: false,
        error: "Backend request failed",
      };
    }
    const templateData = await templateResponse.json();

    // const chatResponse = await fetch(`${BACKEND_URL}/chat`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     messages: [...templateData.prompts, message].map((item) => ({
    //       role: "user",
    //       content: item,
    //     })),
    //   }),
    // });

    // console.log(chatResponse);

    // if (!chatResponse.ok) {
    //   return {
    //     success: false,
    //     error: "Backend request failed",
    //   };
    // }
    const steps = parseXml(templateData.uiPrompts[0]);

    return {
      success: true,
      // prompts: prompts,
      steps: steps,
    };
  } catch (error) {
    console.error("Action error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

const Chat = () => {
  const [isCode, setIsCode] = useState(true);
  const [projectSteps, setProjectSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData?.steps) {
      setProjectSteps((prevSteps) => {
        if (prevSteps.length === 0) {
          return actionData.steps;
        }
        const existingIds = new Set(prevSteps.map((step) => step.id));
        const uniqueNewSteps = actionData.steps.filter(
          (step) => !existingIds.has(step.id)
        );
        return [...prevSteps, ...uniqueNewSteps];
      });
    }
  }, [actionData?.steps]);

  // update the folders/files based on the project steps and response of LLM.
  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    projectSteps.filter(({status}) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure = [...originalFiles]; // {}
        const finalAnswerRef = currentFileStructure;
  
        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
          const currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
            // final file
            const file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            /// in a folder
            const folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              // create the folder
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }
  
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }

    })

    if (updateHappened) {
      // set the states only if the update happened (To avoid infinite rendering)
      setFiles(originalFiles)
      setProjectSteps(steps => steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }
        
      }))
    }
    console.log(files);
  }, [projectSteps, files]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex flex-col md:flex-row h-full gap-6 mt-4">
        <div className="flex flex-col flex-1 gap-5 z-1">
          {actionData?.steps && <VoltAction steps={projectSteps} />}
          <div
            className={`${
              actionData?.steps
                ? ""
                : "flex flex-col items-center justify-center h-screen -mt-20 gap-4"
            }`}
          >
            {!actionData?.steps && (
              <>
                <p className="glow-white text-2xl sm:text-5xl font-bold text-white/90">
                  What do you want to build?
                </p>
                <p className="mx-auto mb-2 max-w-2xl text-base sm:text-lg text-gray-400">
                  Prompt, run, edit, and deploy full-stack web apps.
                </p>
              </>
            )}
            <ChatInput
              placeholder={`${
                actionData?.steps
                  ? "Type your message..."
                  : "Describe your app idea... (e.g., 'Create a task management app with dark mode!')"
              }`}
            />
          </div>
        </div>
        {actionData?.steps && (
          <div className="w-[72%] min-h-full mb-4 bg-black-2 flex flex-col right-0 rounded">
            <div className="px-2 py-2">
              <div className="w-fit h-8 bg-black-1 rounded-full flex gap-2 transition-all duration-300 ease-in-out">
                <Button
                  onClick={() => setIsCode(true)}
                  className={`px-4 h-8 rounded-l-full border-l border-b ${
                    isCode
                      ? "border-purple-600 text-purple-500"
                      : "border-white/60 text-white/60"
                  }`}
                >
                  Code
                </Button>
                <Button
                  onClick={() => setIsCode(false)}
                  className={`px-4 h-8 rounded-r-full border-t border-r ${
                    isCode
                      ? "border-white/60 text-white/60"
                      : "border-purple-600 text-purple-500"
                  } `}
                >
                  Preview
                </Button>
              </div>
            </div>
            {isCode ? (
              <div className="flex flex-row w-full h-full">
                <FileExplorer
                  files={files}
                  onFileSelect={setSelectedFile}
                />
                <CodeEditor
                  file={selectedFile}
                  
                />
              </div>
            ) : (
              <div className="flex flex-row w-full h-full">preview div</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
