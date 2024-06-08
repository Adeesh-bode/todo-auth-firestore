import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) { // class name
  return twMerge(clsx(inputs))
}
