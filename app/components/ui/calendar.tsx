/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";
import { MealPlan } from "@prisma/client";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  mealPlans,
  ...props
}: CalendarProps & { mealPlans: MealPlan[] | null }) {
  const mealPlanDays =
    mealPlans?.map(
      (plan) =>
        new Date(
          plan.date.getFullYear(),
          plan.date.getMonth(),
          plan.date.getDate()
        )
    ) ?? [];

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-1", className)}
      classNames={{
        root: "flex flex-col w-full max-w-[768px] h-full",
        months: "flex-grow flex flex-row space-y-4 w-full",
        month: "flex flex-col space-y-4 w-full p-4",
        caption: "flex justify-center relative items-center",
        caption_label: "text-sm md:text-lg font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 md:size-9 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "flex-grow flex flex-col w-full border-collapse space-y-1",
        tbody: "flex-grow flex flex-col",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] md:text-base",
        row: "flex-grow flex w-full mt-2",
        cell: "flex flex-col w-full text-center text-sm md:text-lg p-0 relative rounded-md [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          "flex-grow w-full p-0 font-normal aria-selected:opacity-100 rounded-md"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "border border-1 border-accent",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",

        ...classNames,
      }}
      modifiers={{ hasMealPlan: mealPlanDays }}
      modifiersClassNames={{ hasMealPlan: "!text-accent" }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
