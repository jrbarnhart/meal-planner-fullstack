import { Card, CardContent, CardFooter } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

export default function Meals() {
  // Get the range that would be valid for meal plans. This will be the users first meal record date (or today -1 month if less than that or if null) through 5 years from now.
  // This range should be used to dynamically populate the Carousel below.

  return (
    // Month Name Date Picker
    // Fast Day Carousel
    // Detail Day Carousel
    // Meals Interface
    <div className="grid justify-center">
      <Carousel className="w-full max-w-[300px]" opts={{ dragFree: true }}>
        <CarouselContent className="-ml-0">
          {Array.from({ length: 31 }).map((_, index) => (
            <CarouselItem key={index} className="basis-1/3 pl-0">
              <div className="p-1">
                <Card>
                  <CardContent className="flex items-center justify-center p-0">
                    <span className="text-2xl font-semibold">
                      {(index + 1).toString().endsWith("1")
                        ? `${index + 1}st`
                        : (index + 1).toString().endsWith("2")
                        ? `${index + 1}nd`
                        : (index + 1).toString().endsWith("3")
                        ? `${index + 1}rd`
                        : `${index + 1}th`}
                    </span>
                  </CardContent>
                  <CardFooter className="flex items-center justify-center text-lg p-0">
                    Jan
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
