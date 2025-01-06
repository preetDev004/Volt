import { useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import ChatInput from "../components/ChatInput";
import CodeEditor from "../components/CodeEditor";
import { FileExplorer } from "../components/FileExplorer";
import { Button } from "../components/ui/button";
import VoltAction from "../components/VoltAction";
import { BACKEND_URL } from "../config";
import useWebContainer from "../hooks/useWebContainer";
import { mountStructure } from "../lib/mountStructure";
import { parseXml } from "../lib/parseXml";
import {
  FileItem,
  Step,
  WebContainerDirectory,
  WebContainerFile,
} from "../type";
import { folderStructure } from "../lib/folderStructure";
import Navbar from "../components/Navbar";
import Preview from "../components/Preview";
import Loader from "../components/Loader";

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
    const templateSteps = parseXml(templateData.uiPrompts[0]);

    const chatResponse = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          ...templateData.prompts,
          ...templateData.uiPrompts,
          message,
        ].map((item) => ({
          role: "user",
          content: item,
        })),
      }),
    });
    if (!chatResponse.ok) {
      return {
        success: false,
        error: "Backend request failed",
      };
    }
    const chatData = await chatResponse.json();
    const chatSteps = parseXml(chatData.data);
    console.log(templateSteps, chatSteps);

    return {
      success: true,
      steps: [...templateSteps, ...chatSteps],
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
  const webContainer = useWebContainer();
  const [isCode, setIsCode] = useState(true);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [mountedFiles, setMountedFiles] = useState<
    Record<string, WebContainerDirectory | WebContainerFile>
  >({});
  const [projectSteps, setProjectSteps] = useState<Step[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";

  useEffect(() => {
    if (actionData?.steps) {
      setProjectSteps((prevSteps) => {
        if (prevSteps.length === 0) {
          return actionData.steps.map((step) => ({
            ...step,
            status: "pending" as Step["status"],
          }));
        }
        const newSteps = actionData.steps.map((step) => ({
          ...step,
          status: "pending" as Step["status"],
        }));
        return [...prevSteps, ...newSteps];
      });
    }
  }, [actionData?.steps]);

  // update the folders/files based on the project steps and response of LLM.
  useEffect(() => {
    const { updateHappened, originalFiles, updatedSteps } = folderStructure(
      files,
      projectSteps
    );

    if (updateHappened) {
      // set the states only if the update happened (To avoid infinite rendering)
      setFiles(originalFiles);
      setProjectSteps(updatedSteps);
      setMountedFiles(() => mountStructure(originalFiles));
      setProjectSteps((steps) =>
        steps.map((s: Step) => {
          return {
            ...s,
            status: "completed",
          };
        })
      );
    }
  }, [projectSteps, files]);

  useEffect(() => {
    console.log(mountedFiles);
    webContainer?.mount(mountedFiles);
  }, [mountedFiles]);

  return (
    <div className="min-h-screen max-h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-col md:flex-row h-full gap-6 mt-4">
        <div className="relative flex flex-col h-full flex-1 gap-5">
          {actionData?.steps && <VoltAction steps={projectSteps} />}
          <div
            className={`${
              actionData?.steps
                ? "sticky w-full h-full z-50 bottom-0 overflow-hidden"
                : "flex flex-col items-center justify-center h-screen -mt-20 gap-4"
            }`}
          >
            {!actionData?.steps && !isSubmitting && (
              <>
                <p className="glow-white text-2xl sm:text-5xl font-bold text-white/90">
                  What do you want to build?
                </p>
                <p className="mx-auto mb-2 max-w-2xl text-base sm:text-lg text-gray-400">
                  Prompt, run, edit, and deploy full-stack web apps.
                </p>
              </>
            )}
            {isSubmitting && !actionData?.steps ? (
              // <div className="flex w-full h-full items-center justify-center">
              <Loader />
            ) : (
              // </div>
              <ChatInput
                isSubmitting={isSubmitting}
                placeholder={`${
                  actionData?.steps
                    ? "Type your message..."
                    : "Describe your app idea... (e.g., 'Create a task management app with dark mode!')"
                }`}
              />
            )}
          </div>
        </div>
        {actionData?.steps && (
          <div className="w-[72%] min-h-full max-h-[90vh] mb-4 bg-black-2 flex flex-col right-0 rounded">
            <div className="px-2 py-2 border-b border-zinc-700">
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
                <div className="w-[20%] h-full">
                  <FileExplorer selectedFile={selectedFile} files={files} onFileSelect={setSelectedFile} />
                </div>
                <CodeEditor file={selectedFile} />
              </div>
            ) : (
              <div className="flex flex-row w-full h-full">
                <Preview files={mountedFiles} webContainer={webContainer} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
