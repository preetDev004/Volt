import Navbar from "../components/Navbar";
import ChatInput from "../components/ChatInput";
import { useActionData } from "@remix-run/react";
import FileExplorer from "../components/FileExplorer";
import CodeEditor from "../components/CodeEditor";
import { useFileSystem } from "../hooks/useFileSystem";
import { FileOperations } from "../lib/fileOperations";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { parseXml } from "../lib/parseXml";
import { Step } from "../type";
import VoltAction from "../components/VoltAction";

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

    const chatResponse = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...templateData.prompts, message].map((item) => ({
          role: "user",
          content: item,
        })),
      }),
    });

    console.log(chatResponse);

    if (!chatResponse.ok) {
      return {
        success: false,
        error: "Backend request failed",
      };
    }
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
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData?.steps) {
      setProjectSteps(prevSteps => {
        if (prevSteps.length === 0) {
          return actionData.steps;
        }
        const existingIds = new Set(prevSteps.map(step => step.id));
        const uniqueNewSteps = actionData.steps.filter(step => !existingIds.has(step.id));
        return [...prevSteps, ...uniqueNewSteps];
      });
    }
  }, [actionData?.steps]);

  const {
    files,
    selectedFile,
    fileContents,
    setSelectedFile,
    handleCreateFile,
    handleDeleteFile,
    handleRenameFile,
    handleUpdateContent,
  } = useFileSystem();

  const handleFileOperation = (operation: FileOperations) => {
    switch (operation.type) {
      case "create": {
        const name = window.prompt(
          `Enter name for new ${operation.fileType}:`,
          operation.fileType === "file" ? "newfile.ts" : "newfolder"
        );
        if (!name) return;
        handleCreateFile(operation.path, operation.fileType, name);
        break;
      }
      case "delete": {
        if (!window.confirm("Are you sure you want to delete this item?"))
          return;
        handleDeleteFile(operation.path);
        break;
      }
      case "rename": {
        handleRenameFile(operation.path, operation.newName);
        break;
      }
    }
  };

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
                : "flex flex-col items-center justify-center w-full h-full mt-64 gap-4"
            }`}
          >
            {!actionData?.steps && <div className="text-4xl font-semibold">Create a new App!</div>}
            <ChatInput />
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
                  selectedFile={selectedFile}
                  onFileOperation={handleFileOperation}
                />
                <CodeEditor
                  file={selectedFile}
                  content={
                    selectedFile ? fileContents[selectedFile.path] || "" : ""
                  }
                  onChange={(content) =>
                    selectedFile &&
                    handleUpdateContent(selectedFile.path, content)
                  }
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
