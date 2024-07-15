import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

function SmallRecipeEntry() {
  return (
    <div className="overflow-hidden text-nowrap bg-secondary flex justify-between">
      <p>Recipe Name</p>
      <p>&#x2713;</p>
    </div>
  );
}

export default function DaySlider() {
  return (
    <Carousel className="w-full mt-4 mb-12" opts={{ align: "start" }}>
      <CarouselContent className="-ml-0">
        {Array.from({ length: 31 }).map((_, index) => (
          <CarouselItem key={index} className="pl-0 basis-1/2">
            <div className="p-1">
              <Card className="h-[33vh]">
                <CardHeader className="flex items-center justify-center p-0">
                  <CardTitle>
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
                  </CardTitle>
                  <CardDescription className="w-full flex justify-between px-2">
                    <span>Recipe</span>
                    <span>Shopped</span>
                  </CardDescription>
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
  );
}
