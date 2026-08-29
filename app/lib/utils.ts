import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  const [year, month, day]: number[] = date.split(/-|:|T|Z/).slice(0, 3).map((item: string, idx: number) => idx === 1 ? Number(item) - 1 : Number(item));
  const dateFormatted = new Date(year, month, day);
  return `${dateFormatted.getDate()} ${dateFormatted.toLocaleString("en-US", { month: "short" })}, ${dateFormatted.getFullYear()}`;
}
