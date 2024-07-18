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
import { phRecipes, PHRecipeTypes, phRecipeTypes } from "~/lib/phData";

function RecipeFilters({
  filters,
  filterOptions,
}: {
  filters: Filters;
  filterOptions: FilterOptions;
}) {
  return (
    <Form method="get" className="grid grid-cols-4 gap-2 w-full absolute px-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button className="col-start-4">Sort</Button>
        </PopoverTrigger>
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

type FilterOptions = {
  type: PHRecipeTypes;
  feeds: undefined;
  ingredients: undefined;
  time: undefined;
  sort: undefined;
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
  // Get recipe filter options
  const filterOptions = { type: phRecipeTypes };
  // Get default recipes that match these options
  const recipes = phRecipes; // Not filtered yet
  return { filters, filterOptions, recipes };
}

export default function RecipesLibrary() {
  const { filters, filterOptions, recipes } = useLoaderData<typeof loader>();
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
      <RecipeFilters filterOptions={filterOptions} filters={filters} />
    </RouteContent>
  );
}
