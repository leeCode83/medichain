"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          title: "text-black dark:text-black",
          description: "text-black dark:text-black",
          actionButton: "bg-zinc-900 text-white dark:bg-zinc-900 dark:text-white",
          cancelButton: "bg-zinc-100 text-zinc-900 dark:bg-zinc-100 dark:text-zinc-900",
          error: "bg-white border-red-200",
          success: "bg-white border-green-200",
          warning: "bg-white border-yellow-200",
          info: "bg-white border-blue-200",
          toast: "bg-white dark:bg-white border-zinc-200 shadow-lg",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-5 text-green-600" />,
        info: <InfoIcon className="size-5 text-blue-600" />,
        warning: <TriangleAlertIcon className="size-5 text-yellow-600" />,
        error: <OctagonXIcon className="size-5 text-red-600" />,
        loading: <Loader2Icon className="size-5 animate-spin text-zinc-600" />,
      }}
      {...props}
    />
  )
}

export { Toaster }
