import { Form } from "@remix-run/react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function ChatInput({
  placeholder,
  isSubmitting,
}: {
  placeholder: string;
  isSubmitting: boolean;
}) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 500)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      e.preventDefault();
      return;
    }
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default "Enter" behavior (e.g., new line in the textarea).
      const form = textareaRef.current?.form; // Get the associated form element.
      if (form) {
        form.requestSubmit(); // Programmatically trigger the form submission.
      }
    }
  };
  return (
    <div className="w-full max-w-[500px] mx-auto h-auto sticky bottom-0 mb-4 overflow-hidden backdrop-blur-sm">
      <Form onSubmit={handleSubmit} method="post" action="/chat" className="">
        <div className="relative">
          <Textarea
            aria-label="Message"
            className="text-white bg-black-1 border border-purple-400 border-b-0 p-4 pr-14 rounded-none rounded-t-md focus:outline-none placeholder:text-gray-400"
            ref={textareaRef}
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
          />
          <div className="bg-black-1 text-gray-400 text-sm p-4 border border-purple-400 border-t-0 rounded-b-md">
            <p
              className={` transition-all duration-300 ease-in-out 
                ${
                  message.trim().length < 5 || isSubmitting
                    ? "opacity-0 translate-y-5"
                    : " opacity-100 -translate-y-1"
                }`}
            >
              Press{" "}
              <span className="py-1 px-2 text-white rounded bg-black-2">
                Shift
              </span>{" "}
              +{" "}
              <span className="py-1 px-2 text-white rounded bg-black-2">
                Enter
              </span>{" "}
              for a new line
            </p>
          </div>

          <Button
            aria-label="Submit"
            type="submit"
            className={`absolute right-4 top-6 p-2 w-8 h-8 rounded-md transition-all duration-300 ease-in-out 
                ${
                  message.trim() === "" || isSubmitting
                    ? "bg-gray-200 text-gray-400 -top-10 cursor-not-allowed opacity-0 -translate-y-2"
                    : "bg-purple-500 text-white hover:bg-purple-600 active:bg-purple-700 opacity-100"
                }`}
            disabled={message.trim() === "" || isSubmitting}
          >
            {isSubmitting ? (
              <svg
                className="animate-spin h-6 w-6 "
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <ArrowRight />
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
}
