import { Recipe } from "@prisma/client";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { useState, useRef } from "react";
import { z } from "zod";
import { prisma } from "~/client";
import RouteContent from "~/components/layout/routeContent";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import InputMany from "~/components/ui/inputMany";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { addLocalRecipe, getLocalId } from "~/lib/localStorageUtils";
import {
  addRecipeSchema,
  localRecipeSchema,
} from "~/lib/zodSchemas/recipeSchema";
import { getSession } from "~/sessions";

type AddLocalRecipeInput = z.input<typeof localRecipeSchema>;
type FlattenedErrors = z.inferFlattenedErrors<typeof localRecipeSchema>;

function formatFormData(formData: FormData): AddLocalRecipeInput {
  const values: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    if (
      key === "types[]" ||
      key === "requirements[]" ||
      key === "steps[]" ||
      key === "ingredients[]"
    ) {
      if (!values[key.replace("[]", "")]) {
        values[key.replace("[]", "")] = formData.getAll(key);
      }
    } else if (key === "time" || key === "feeds") {
      values[key] = parseInt(value as string, 10);
    } else {
      values[key] = value;
    }
  }

  return values as AddLocalRecipeInput;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const isLoggedIn = session.has("userId");

  return json({ isLoggedIn });
}

type ActionResponse = {
  error?: string;
  zodErrors?: z.inferFlattenedErrors<typeof addRecipeSchema>;
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const formattedData = formatFormData(formData);

  const zodResult = await addRecipeSchema.safeParse(formattedData);

  if (!zodResult.success) {
    const zodErrors = zodResult.error.flatten();
    return json({ zodErrors } as ActionResponse);
  }

  const validatedData = zodResult.data;

  try {
    await prisma.recipe.create({ data: validatedData });
    return redirect("/recipes");
  } catch (error) {
    console.error(error);
    return json({
      error: "Error while adding recipe. Please try again.",
    } as ActionResponse);
  }
}

export default function AddRecipe() {
  const navigate = useNavigate();
  function handleLocalSubmit(
    event: React.MouseEvent<HTMLButtonElement>,
    ref: React.RefObject<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!ref.current) {
      return console.error("Missing form ref. Form will not function.");
    }

    const formData = new FormData(ref.current);
    const formattedData = formatFormData(formData);
    const completeData: Recipe = {
      ...formattedData,
      id: getLocalId(),
      isDefault: false,
      userId: -1,
    };

    const zodResult = localRecipeSchema.safeParse(completeData);

    if (!zodResult.success) {
      setLocalErrors(zodResult.error.flatten());
      console.log(zodResult.error.flatten());
      return;
    }

    addLocalRecipe(zodResult.data);
    navigate("/recipes");
  }

  const { isLoggedIn } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const formRef = useRef<HTMLFormElement>(null);

  const [localErrors, setLocalErrors] = useState<FlattenedErrors | undefined>();

  const [requirements, setRequirements] = useState<string[]>([]);
  const requirementsInputRef = useRef<HTMLInputElement>(null);

  const [steps, setSteps] = useState<string[]>([]);
  const stepsInputRef = useRef<HTMLInputElement>(null);

  const [ingredients, setIngredients] = useState<string[]>([]);
  const ingredientsInputRef = useRef<HTMLInputElement>(null);

  return (
    <RouteContent>
      <div className="w-full flex justify-between items-center">
        <Button asChild>
          <Link to={"/recipes"}>My Recipes</Link>
        </Button>
        <h1 className="text-xl">Add a New Recipe</h1>
      </div>
      <Card className="w-full overflow-y-auto">
        <CardContent>
          <Form method="post" className="space-y-4" ref={formRef}>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Recipe Name"></Input>
              {localErrors?.fieldErrors.name && (
                <p className="text-destructive">
                  {localErrors.fieldErrors.name}
                </p>
              )}
              {actionData?.zodErrors?.fieldErrors.name && (
                <p className="text-destructive">
                  {actionData.zodErrors.fieldErrors.name}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="A short description of your recipe."
              ></Textarea>
              {localErrors?.fieldErrors.description && (
                <p className="text-destructive">
                  3{localErrors.fieldErrors.description}
                </p>
              )}
              {actionData?.zodErrors?.fieldErrors.description && (
                <p className="text-destructive">
                  {actionData.zodErrors.fieldErrors.description}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="time">Prep Time - Minutes</Label>
              <Input id="time" name="time" type="number" min={1}></Input>
              {localErrors?.fieldErrors.time && (
                <p className="text-destructive">
                  {localErrors.fieldErrors.time}
                </p>
              )}
              {actionData?.zodErrors?.fieldErrors.time && (
                <p className="text-destructive">
                  {actionData.zodErrors.fieldErrors.time}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="feeds">Feeds</Label>
              <Input id="feeds" name="feeds" type="number" min={1}></Input>
              {localErrors?.fieldErrors.feeds && (
                <p className="text-destructive">
                  {localErrors.fieldErrors.feeds}
                </p>
              )}
              {actionData?.zodErrors?.fieldErrors.feeds && (
                <p className="text-destructive">
                  {actionData.zodErrors.fieldErrors.feeds}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="types">Type(s):</Label>
              <Card className="p-2">
                <fieldset id="types" className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox id="t1" name="types[]" value="breakfast" />
                    <Label htmlFor="t1" className="text-lg">
                      Breakfast
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="t2" name="types[]" value="lunch" />
                    <Label htmlFor="t2" className="text-lg">
                      Lunch
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="t3" name="types[]" value="dinner" />
                    <Label htmlFor="t3" className="text-lg">
                      Dinner
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="t4" name="types[]" value="dessert" />
                    <Label htmlFor="t4" className="text-lg">
                      Dessert
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="t5" name="types[]" value="brunch" />
                    <Label htmlFor="t5" className="text-lg">
                      Brunch
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="t6" name="types[]" value="snacks" />
                    <Label htmlFor="t6" className="text-lg">
                      Snacks
                    </Label>
                  </div>
                </fieldset>
              </Card>
              {localErrors?.fieldErrors.types && (
                <p className="text-destructive">
                  {localErrors.fieldErrors.types}
                </p>
              )}
              {actionData?.zodErrors?.fieldErrors.types && (
                <p className="text-destructive">
                  {actionData.zodErrors.fieldErrors.types}
                </p>
              )}
            </div>
            <div>
              <InputMany
                inputRef={requirementsInputRef}
                name="requirements"
                label="Requirements"
                placeholder="Mixing bowl"
                values={requirements}
                setValues={setRequirements}
              />
              {localErrors?.fieldErrors.requirements && (
                <p className="text-destructive">
                  {localErrors.fieldErrors.requirements}
                </p>
              )}
              {actionData?.zodErrors?.fieldErrors.requirements && (
                <p className="text-destructive">
                  {actionData.zodErrors.fieldErrors.requirements}
                </p>
              )}
            </div>
            <div>
              <InputMany
                inputRef={ingredientsInputRef}
                name="ingredients"
                label="Ingredients"
                placeholder="1 cup water"
                values={ingredients}
                setValues={setIngredients}
              />
              {localErrors?.fieldErrors.ingredients && (
                <p className="text-destructive">
                  {localErrors.fieldErrors.ingredients}
                </p>
              )}
              {actionData?.zodErrors?.fieldErrors.ingredients && (
                <p className="text-destructive">
                  {actionData.zodErrors.fieldErrors.ingredients}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="preNotes">Notes before starting</Label>
              <Textarea
                id="preNotes"
                name="preNotes"
                placeholder="Before you begin..."
              ></Textarea>
              {localErrors?.fieldErrors.preNotes && (
                <p className="text-destructive">
                  {localErrors.fieldErrors.preNotes}
                </p>
              )}
              {actionData?.zodErrors?.fieldErrors.preNotes && (
                <p className="text-destructive">
                  {actionData.zodErrors.fieldErrors.preNotes}
                </p>
              )}
            </div>
            <div>
              <InputMany
                inputRef={stepsInputRef}
                name="steps"
                label="Steps"
                values={steps}
                setValues={setSteps}
                placeholder="First..."
              />
              {localErrors?.fieldErrors.steps && (
                <p className="text-destructive">
                  {localErrors.fieldErrors.steps}
                </p>
              )}
              {actionData?.zodErrors?.fieldErrors.steps && (
                <p className="text-destructive">
                  {actionData.zodErrors.fieldErrors.steps}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="postNotes">Notes when finishing up</Label>
              <Textarea
                id="postNotes"
                name="postNotes"
                placeholder="Now that you are done..."
              ></Textarea>
              {localErrors?.fieldErrors.postNotes && (
                <p className="text-destructive">
                  {localErrors.fieldErrors.postNotes}
                </p>
              )}
              {actionData?.zodErrors?.fieldErrors.postNotes && (
                <p className="text-destructive">
                  {actionData.zodErrors.fieldErrors.postNotes}
                </p>
              )}
            </div>
            {isLoggedIn ? (
              <>
                <Button type="submit" className="w-full">
                  Add Recipe
                </Button>
                {actionData?.error && (
                  <p className="text-destructive">{actionData.error}</p>
                )}
              </>
            ) : (
              <Button
                onClick={(e) => handleLocalSubmit(e, formRef)}
                type="button"
                className="w-full"
              >
                Add Local Recipe
              </Button>
            )}
          </Form>
        </CardContent>
      </Card>
    </RouteContent>
  );
}
