import { useParams } from "@remix-run/react";

export default function ShoppingList() {
  const params = useParams();

  return (
    <div>
      <p>This is the shopping list page for list id: {params.id}</p>
    </div>
  );
}
