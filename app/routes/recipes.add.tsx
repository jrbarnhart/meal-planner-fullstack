import { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import RouteContent from "~/components/layout/routeContent";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const values = Object.fromEntries(formData);

  console.log(values);
}

export default function CreateRecipe() {
  return (
    <RouteContent>
      <div className="w-full">
        <Button asChild>
          <Link to={"/recipes"}>My Recipes</Link>
        </Button>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Add a New Recipe</CardTitle>
        </CardHeader>
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
              <Label htmlFor="types">Type(s):</Label>
              <Card className="p-2">
                <fieldset id="types" className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox id="t1" name="breakfast" />
                    <Label htmlFor="t1" className="text-lg">
                      Breakfast
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="t2" name="lunch" />
                    <Label htmlFor="t2" className="text-lg">
                      Lunch
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="t3" name="dinner" />
                    <Label htmlFor="t3" className="text-lg">
                      Dinner
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="t4" name="dessert" />
                    <Label htmlFor="t4" className="text-lg">
                      Dessert
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="t5" name="brunch" />
                    <Label htmlFor="t5" className="text-lg">
                      Brunch
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="t6" name="snacks" />
                    <Label htmlFor="t6" className="text-lg">
                      Snacks
                    </Label>
                  </div>
                </fieldset>
              </Card>
            </div>
          </Form>
        </CardContent>
      </Card>
    </RouteContent>
  );
}
