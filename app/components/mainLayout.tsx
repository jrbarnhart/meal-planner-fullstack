import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

function Nav() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Card
      className={`absolute bottom-1/4 right-0 p-2 bg-card transition-all duration-300 ease-in-out ${
        isOpen ? "w-48" : "w-12"
      }`}
    >
      <nav className="flex items-center gap-2">
        <Button
          className="h-20 w-12 flex-shrink-0"
          onMouseDown={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? ">" : "<"}
        </Button>
        <div
          className={`flex flex-col space-y-2 overflow-hidden transition-all duration-300 ${
            isOpen ? "w-36 opacity-100" : "w-0 opacity-0"
          }`}
        >
          <Button>Recipes</Button>
          <Button>Shopping</Button>
        </div>
      </nav>
    </Card>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-full">
      {children}
      <Nav />
    </div>
  );
}
