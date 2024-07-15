import { Card, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";

export default function DayInterface() {
  return (
    <Card className="p-2 w-full flex-grow">
      <CardHeader className="p-1 text-lg font-semibold flex items-center">
        <p>Date</p>
      </CardHeader>
      <Separator />
      <p>content</p>
    </Card>
  );
}
