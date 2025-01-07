import { CheckCircle, Clock, Loader, User2Icon } from "lucide-react";
import { Step, StepType } from "../type";
import { useEffect, useRef } from "react";

const StatusIcon = ({ status }: { status: Step["status"] }) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "in-progress":
      return <Loader className="w-6 h-6 text-blue-500 animate-spin" />;
    default:
      return <Clock className="w-5 h-5 text-gray-400" />;
  }
};

const VoltAction = ({ steps }: { steps: Step[] }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [steps]); // Trigger effect when 'steps' changes

  if (!steps.length) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-240px)] sticky z-10 w-800 scrollbar-left overflow-y-scroll p-2 cursor-text"
    >
      {steps.map((step, index) => (
        <div key={index}>
          {step.type !== StepType.Message ? (
            <div
              key={index}
              className="rounded bg-black-2 w-full p-2 sm:p-4 mb-2 sm:mb-4"
            >
              <div className="flex items-center gap-2">
                <StatusIcon status={step.status} />
                <span>{step.title}</span>
              </div>
            </div>
          ) : (
            <div
              key={index}
              className="rounded bg-purple-900 text-white w-full p-2 sm:p-4 mb-2 sm:mb-4"
            >
              <div className="flex items-start gap-2">
                <User2Icon className="w-6 h-6" />
                <span className="flex-1">{step.title}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default VoltAction;
