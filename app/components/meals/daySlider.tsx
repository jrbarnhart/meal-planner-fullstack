import { PHMealPlan, PHRecipe } from "~/lib/phData";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Separator } from "../ui/separator";
import {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { formatDateForTitle, getDaysFromDateRange } from "~/lib/utils";
import useEmblaCarousel from "embla-carousel-react";

function SmallRecipeEntry({ recipe }: { recipe: PHRecipe }) {
  return (
    <div className="overflow-hidden text-nowrap bg-secondary flex justify-between rounded-sm px-1 h-min">
      <p className="truncate">{recipe.name}</p>
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
  const mealPlanMap = useMemo(() => {
    return new Map(
      currentMealPlans.map((plan) => [plan.date.toDateString(), plan])
    );
  }, [currentMealPlans]);

  const defaultEnd = new Date(selectedDate);
  defaultEnd.setDate(defaultEnd.getDate() + 30);
  const defaultStart = new Date(selectedDate);
  defaultStart.setDate(defaultStart.getDate() - 7);
  const [range, setRange] = useState<{ start: Date; end: Date }>({
    start: defaultStart,
    end: defaultEnd,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });

  const scrollToSelectedDate = useCallback(() => {
    if (!emblaApi) return;

    const findSelectedDateIndex = (start: Date, end: Date, selected: Date) => {
      const totalDays = getDaysFromDateRange(start, end);
      for (let i = 0; i < totalDays; i++) {
        const currentDate = new Date(start.getTime() + i * 24 * 3600 * 1000);
        if (currentDate.toDateString() === selected.toDateString()) {
          return i;
        }
      }
      return -1;
    };

    const selectedIndex = findSelectedDateIndex(
      range.start,
      range.end,
      selectedDate
    );
    if (selectedIndex !== -1) {
      emblaApi.scrollTo(selectedIndex, true);
      console.log("Scrolled to index:", selectedIndex);
    } else {
      const newStart = new Date(selectedDate);
      newStart.setDate(newStart.getDate() - 7);
      const newEnd = new Date(selectedDate);
      newEnd.setDate(newEnd.getDate() + 30);
      setRange({ start: newStart, end: newEnd });
    }
  }, [emblaApi, range.start, range.end, selectedDate]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("init", () => {
        scrollToSelectedDate();
        console.log("Init");
      });
    }
  }, [emblaApi, scrollToSelectedDate]);

  useEffect(() => {
    scrollToSelectedDate();
  }, [selectedDate, scrollToSelectedDate]);

  return (
    <Carousel
      ref={emblaRef}
      className="w-full mt-4 mb-12"
      opts={{ align: "start" }}
    >
      <CarouselContent className="-ml-0">
        {Array.from({
          length: getDaysFromDateRange(range.start, range.end),
        }).map((_, index) => {
          const currentItemDate = new Date(
            range.start.getTime() + index * 24 * 3600 * 1000
          );
          const currentItemDateString = currentItemDate.toString();
          const mealPlan = mealPlanMap.get(currentItemDateString);

          return (
            <CarouselItem key={index} className="pl-0 basis-1/2">
              <div className="p-1">
                <Card className="h-[25vh] overflow-hidden">
                  <CardHeader className="flex items-center justify-center p-1">
                    <CardTitle>
                      <button
                        onClick={() => setSelectedDate(currentItemDate)}
                        className="text-lg font-semibold"
                      >
                        {formatDateForTitle(
                          new Date(
                            range.start.getTime() + index * 24 * 3600 * 1000
                          )
                        )}
                      </button>
                    </CardTitle>
                    <Separator />
                  </CardHeader>
                  <CardContent className="grid gap-2 px-2 h-[18vh] overflow-y-auto">
                    {mealPlan ? (
                      mealPlan.recipes.map((recipe, recipeIndex) => (
                        <SmallRecipeEntry recipe={recipe} key={recipeIndex} />
                      ))
                    ) : (
                      <div className="overflow-hidden text-nowrap bg-secondary flex justify-between rounded-sm px-1 h-min">
                        <p className="truncate">No meals planned</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
