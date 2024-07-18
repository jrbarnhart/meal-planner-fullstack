import { useLoaderData } from "@remix-run/react";
import RouteContent from "~/components/layout/routeContent";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

// This will be replaced with data from the server eventually
const phRecipeTypes = [
  { label: "Breakfast", id: 1 },
  { label: "Brunch", id: 2 },
  { label: "Lunch", id: 3 },
  { label: "Dinner", id: 4 },
  { label: "Desert", id: 5 },
  { label: "Snacks", id: 6 },
  { label: "Snacks", id: 7 },
  { label: "Snacks", id: 8 },
  { label: "Snacks", id: 9 },
  { label: "Snacks", id: 10 },
];

type PHRecipeTypes = {
  label: string;
  id: number;
}[];

function LibraryFilters({ filterOptions }: { filterOptions: PHRecipeTypes }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Types</Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-4">
        {filterOptions.map((option) => (
          <div key={option.id} className="flex items-center gap-3">
            <Checkbox id={option.label} className="h-10 w-10"></Checkbox>
            <Label htmlFor={option.label}>{option.label}</Label>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export async function loader() {
  const filterOptions: PHRecipeTypes = phRecipeTypes;
  return { filterOptions };
}

export default function RecipesLibrary() {
  const { filterOptions } = useLoaderData<typeof loader>();

  return (
    <RouteContent>
      <h1 className="text-lg font-bold">Munchlify Recipe Library</h1>
      <LibraryFilters filterOptions={filterOptions} />
    </RouteContent>
  );
}
