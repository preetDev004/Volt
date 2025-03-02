import * as React from "react"

import { cn } from "../../lib/utils"

const Textarea = React.forwardRef<
HTMLTextAreaElement,
React.ComponentProps<"textarea"> & { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex resize-none min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
