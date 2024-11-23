import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseTransformString(str: string): [number, number, number] {
  try {
    return JSON.parse(str);
  } catch {
    return [0, 0, 0];
  }
}
