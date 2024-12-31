import { Step } from "../type";

const VoltAction = ({ steps }: { steps: Step[] | undefined }) => {
  if (!steps) {
    return null;
  }
  return (
    <div className="h-[calc(100vh-200px)] w-800 scrollbar-left overflow-y-scroll p-2 cursor-text">
      {/* <Steps /> */}
      {steps.map((step) => (
        <div
          key={step.id}
          className="rounded bg-black-2 w-full p-2 sm:p-4 mb-2 sm:mb-4"
        >
          {step.title}
          {step?.code}
          {step?.path}
          {step.status}
        </div>
      ))}
    </div>
  );
};

export default VoltAction;
