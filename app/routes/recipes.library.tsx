import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { useTransition } from "react";
import RouteContent from "~/components/layout/routeContent";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { phRecipes } from "~/lib/phData";

function RecipeFilters() {
  return (
    <Form method="get" className="grid grid-cols-4 gap-2 w-full absolute px-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button className="col-start-4">Sort</Button>
        </PopoverTrigger>
        <PopoverContent className="grid gap-2">
          <RadioGroup>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="alpha" id="r1" className="h-6 w-6" />
              <Label htmlFor="r1" className="text-2xl">
                A-Z
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="feeds" id="r2" className="h-6 w-6" />
              <Label htmlFor="r2" className="text-2xl">
                Feeds #
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="time" id="r3" className="h-6 w-6" />
              <Label htmlFor="r3" className="text-2xl">
                Prep Time
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="complexity" id="r4" className="h-6 w-6" />
              <Label htmlFor="r4" className="text-2xl">
                Complexity
              </Label>
            </div>
          </RadioGroup>
          <Button>Reverse</Button>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button>Type</Button>
        </PopoverTrigger>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button>Feeds</Button>
        </PopoverTrigger>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button>Ingredients</Button>
        </PopoverTrigger>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button>Prep Time</Button>
        </PopoverTrigger>
      </Popover>
    </Form>
  );
}

type Filters = {
  type: string;
  feeds: string;
  ingredients: string;
  time: string;
  sort: string;
};

export async function loader({ request }: LoaderFunctionArgs) {
  // Get filter data from url
  const url = new URL(request.url);
  const filters: Filters = {
    type: url.searchParams.get("type") || "",
    feeds: url.searchParams.get("feeds") || "",
    ingredients: url.searchParams.get("ingredients") || "",
    time: url.searchParams.get("time") || "",
    sort: url.searchParams.get("sort") || "",
  };

  // This uses placeholder data for now
  // Get default recipes that match these options
  const recipes = phRecipes; // Not filtered yet
  return { filters, recipes };
}

export default function RecipesLibrary() {
  const { filters, recipes } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const transition = useTransition();

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const form = event.currentTarget.form;
    if (form) {
      submit(form);
    }
  };

  return (
    <RouteContent>
      <h1 className="text-2xl font-bold w-full">Recipe Library</h1>
      <RecipeFilters />
    </RouteContent>
  );
}
