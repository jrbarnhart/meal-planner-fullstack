import { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { useState, useRef } from "react";
import RouteContent from "~/components/layout/routeContent";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import InputMany from "~/components/ui/inputMany";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const values: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};

  for (const [key, value] of formData.entries()) {
    if (key === "types[]") {
      if (!values.types) {
        values["types"] = formData.getAll("types[]");
      }
    } else if (key === "requirements[]") {
      if (!values.requirements) {
        values["requirements"] = formData.getAll("requirements[]");
      }
    } else if (key === "steps[]") {
      if (!values.steps) {
        values["steps"] = formData.getAll("steps[]");
      }
    } else {
      values[key] = value;
    }
  }

  console.log(values);
  return null;
}

export default function CreateRecipe() {
  const [requirements, setRequirements] = useState<string[]>([]);
  const requirementsInputRef = useRef<HTMLInputElement>(null);

  const [steps, setSteps] = useState<string[]>([]);
  const stepsInputRef = useRef<HTMLInputElement>(null);

  return (
    <RouteContent>
      <div className="w-full flex justify-between">
        <Button asChild>
          <Link to={"/recipes"}>My Recipes</Link>
        </Button>
        <h1 className="text-xl">Add a New Recipe</h1>
      </div>
      <Card className="w-full overflow-y-auto">
        <CardContent>
          <Form method="post" className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Recipe Name"></Input>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="A short description of your recipe."
              ></Textarea>
            </div>
            <div>
              <Label htmlFor="time">Prep Time - Minutes</Label>
              <Input
                id="time"
                name="time"
                type="number"
                min={1}
                placeholder="1"
              ></Input>
            </div>
            <div>
              <Label htmlFor="feeds">Feeds</Label>
              <Input
                id="feeds"
                name="feeds"
                type="number"
                min={1}
                placeholder="1"
              ></Input>
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
            </div>
            <InputMany
              inputRef={requirementsInputRef}
              name="requirements"
              label="Requirements"
              placeholder="Mixing bowl"
              values={requirements}
              setValues={setRequirements}
            />
            <div>
              <Label htmlFor="preNotes">Notes before starting</Label>
              <Textarea
                id="preNotes"
                name="preNotes"
                placeholder="Before you begin..."
              ></Textarea>
            </div>
            <InputMany
              inputRef={stepsInputRef}
              name="steps"
              label="Steps"
              values={steps}
              setValues={setSteps}
              placeholder="First..."
            />
            <div>
              <Label htmlFor="postNotes">Notes when finishing up</Label>
              <Textarea
                id="postNotes"
                name="postNotes"
                placeholder="Now that you are done..."
              ></Textarea>
            </div>
            <Button type="submit">Add Recipe</Button>
          </Form>
        </CardContent>
      </Card>
    </RouteContent>
  );
}
