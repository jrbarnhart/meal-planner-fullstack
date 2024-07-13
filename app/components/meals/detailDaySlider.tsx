import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

function SmallRecipeEntry() {
  return (
    <div className="overflow-hidden text-nowrap text-sm text-center bg-secondary">
      <p>Recipe Name</p>
    </div>
  );
}

export default function DetailDaySlider() {
  return (
    <div className="grid justify-center">
      <Carousel className="w-full max-w-[300px]">
        <CarouselContent className="-ml-0">
          {Array.from({ length: 31 }).map((_, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="p-1">
                <Card>
                  <CardHeader className="flex items-center justify-center p-0">
                    <p className="text-lg font-semibold">
                      {index + 1 >= 10 && index + 1 <= 13
                        ? `${index + 1}th`
                        : (index + 1).toString().endsWith("1")
                        ? `${index + 1}st`
                        : (index + 1).toString().endsWith("2")
                        ? `${index + 1}nd`
                        : (index + 1).toString().endsWith("3")
                        ? `${index + 1}rd`
                        : `${index + 1}th`}
                    </p>
                  </CardHeader>
                  <CardContent className="grid grid-flow-col gap-2 px-2">
                    <SmallRecipeEntry />
                  </CardContent>
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
