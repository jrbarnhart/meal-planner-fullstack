import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Link, useLocation } from "@remix-run/react";

function Nav() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { pathname } = useLocation();

  return (
    <Card
      className={`absolute bottom-1/4 right-0 p-2 bg-card transition-all duration-300 ease-in-out rounded-r-none ${
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
          <Link to={pathname.startsWith("/recipes") ? "/" : "/recipes"}>
            <Button className="w-full">
              {pathname.startsWith("/recipes") ? "Home" : "Recipes"}
            </Button>
          </Link>
          <Link to={pathname.startsWith("/shopping") ? "/" : "/shopping"}>
            <Button className="w-full">
              {pathname.startsWith("/shopping") ? "Home" : "Shopping"}
            </Button>
          </Link>
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
