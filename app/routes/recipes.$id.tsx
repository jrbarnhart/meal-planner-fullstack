import { useParams } from "@remix-run/react";

export default function RecipeDetails() {
  const params = useParams();

  return (
    <div>
      <p>
        This is the details page for recipe id: {params.id ?? "No id found."}!
      </p>
    </div>
  );
}
