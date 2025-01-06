import { CheckCircle, Clock, Loader } from "lucide-react";
import { Step } from "../type";
const StatusIcon = ({ status }: { status: Step["status"] }) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    case "in-progress":
      return <Loader className="w-6 h-6 text-blue-500 animate-spin" />;
    default:
      return <Clock className="w-4 h-4 text-gray-400" />;
  }
};

const VoltAction = ({ steps }: { steps: Step[] }) => {
  if (!steps.length) {
    return null;
  }

  return (
    <div className="h-[calc(100vh-240px)] sticky z-10 w-800 scrollbar-left overflow-y-scroll p-2 cursor-text">
      {steps.map((step, index) => (
        <div
          key={index}
          className="rounded bg-black-2 w-full p-2 sm:p-4 mb-2 sm:mb-4"
        >
          <div className="flex items-center gap-2">
            <StatusIcon status={step.status} />
            {step.title}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VoltAction;
