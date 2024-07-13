import { Card, CardContent, CardFooter } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

export default function DetailDaySlider() {
  return (
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
