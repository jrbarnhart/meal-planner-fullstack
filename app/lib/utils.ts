import { Recipe } from "@prisma/client";
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

export function formatDateForTitle(date: Date): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];

  const suffix = (day: number): string => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${month} ${day}${suffix(day)}`;
}

export function normalizeToMidnight(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function dateToUTC(date: Date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
}

export function UTCToLocal(date: Date) {
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
}

export function calculateComplexity(recipe: Recipe) {
  const { time } = recipe;
  const totalRequirements = recipe.requirements.length;
  const totalSteps = recipe.steps.length;
  const totalIngredients = recipe.ingredients.length;
  const timeCeiling = 180;
  const requirementsCeiling = 8;
  const stepsCeiling = 15;
  const ingredientsCeiling = 10;
  const complexity =
    0.33 * (time / timeCeiling) +
    0.2 * (totalRequirements / requirementsCeiling) +
    0.15 * (totalIngredients / ingredientsCeiling) +
    0.32 * (totalSteps / stepsCeiling);
  if (complexity > 0.9) {
    return "5 - Advanced";
  } else if (complexity > 0.75) {
    return "4 - Challenging";
  } else if (complexity > 0.4) {
    return "3 - Intermediate";
  } else if (complexity > 0.3) {
    return "2 - Basic";
  } else return "1 - Easy";
}
