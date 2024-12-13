import { useFetcher } from "@remix-run/react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function ChatInput() {
  const fetcher = useFetcher();
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const isSubmitting =
    fetcher.state === "submitting" || fetcher.state === "loading";

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
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    fetcher.submit({ message: trimmedMessage });

    setMessage("");
  };

  return (
    <div className="w-[450px] mx-auto h-auto absolute bottom-0 mb-4 overflow-hidden">
    <fetcher.Form onSubmit={handleSubmit} method="post">
      <Textarea
        aria-label="Message"
        className="text-white  bg-black-2 p-4 pr-14 rounded-md focus:outline-none shadow-purple-700-lg"
        ref={textareaRef}
        name="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <Button
        aria-label="Submit"
        type="submit"
        className={`absolute right-4 bottom-6 p-2 w-8 h-8 rounded-md transition-all duration-300 ease-in-out 
                ${
                  message.trim() === "" || isSubmitting
                    ? "bg-gray-200 text-gray-400 -bottom-10 cursor-not-allowed opacity-0 translate-y-2"
                    : "bg-purple-500 text-white hover:bg-purple-600 active:bg-purple-700 opacity-100 -translate-y-2"
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
          <ArrowRight/>
        )}
      </Button>
    </fetcher.Form>
    </div>
  );
}
