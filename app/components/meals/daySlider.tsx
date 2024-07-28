import { PHMealPlan } from "~/lib/phData";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Separator } from "../ui/separator";
import { SetStateAction, useEffect, useState } from "react";
import { formatDateForTitle, getDaysFromDateRange } from "~/lib/utils";

function SmallRecipeEntry() {
  return (
    <div className="overflow-hidden text-nowrap bg-secondary flex justify-between rounded-sm px-1 h-min">
      <p className="truncate">Recipe Name</p>
      <p>&#x2713;</p>
    </div>
  );
}

export default function DaySlider({
  ...props
}: {
  currentMealPlans: PHMealPlan[];
  selectedDate: Date;
  setSelectedDate: React.Dispatch<SetStateAction<Date>>;
}) {
  const { currentMealPlans, selectedDate, setSelectedDate } = props;

  const defaultEnd = new Date(selectedDate);
  defaultEnd.setDate(defaultEnd.getDate() + 30);
  const defaultStart = new Date(selectedDate);
  defaultStart.setDate(defaultStart.getDate() - 7);

  const [range, setRange] = useState<{ start: Date; end: Date }>({
    start: defaultStart,
    end: defaultEnd,
  });

  useEffect(() => {
    const end = new Date(selectedDate);
    end.setDate(end.getDate() + 30);
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - 7);
    setRange({ start, end });
  }, [selectedDate]);

  // Determine the range that should be used to create the date entries in the slider
  // Use a startDate and endDate
  // Default range = one week ago - 30 days out
  // Selecting a new date in the other component should update the range

  return (
    <Carousel className="w-full mt-4 mb-12" opts={{ align: "start" }}>
      <CarouselContent className="-ml-0">
        {Array.from({
          length: getDaysFromDateRange(range.start, range.end),
        }).map((_, index) => (
          <CarouselItem key={index} className="pl-0 basis-1/2">
            <div className="p-1">
              <Card className="h-[25vh] overflow-hidden">
                <CardHeader className="flex items-center justify-center p-1">
                  <CardTitle>
                    <p className="text-lg font-semibold">
                      {formatDateForTitle(
                        new Date(
                          range.start.getTime() + index * 24 * 3600 * 1000
                        )
                      )}
                    </p>
                  </CardTitle>
                  <Separator />
                </CardHeader>
                <CardContent className="grid gap-2 px-2 h-[18vh] overflow-y-auto">
                  {/* map small recipe */}
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
