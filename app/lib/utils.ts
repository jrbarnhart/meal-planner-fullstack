import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDaysFromDateRange(startDate: Date, endDate: Date) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Set both dates to noon to avoid DST inconsistencies
  start.setHours(12, 0, 0, 0);
  end.setHours(12, 0, 0, 0);

  const timeDiff = end.getTime() - start.getTime();

  // Convert ms to days, rounded up to avoid inconsistencies
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  // Add 1 to include start and end days
  return daysDiff + 1;
}
