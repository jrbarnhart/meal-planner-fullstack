import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Link, useLocation } from "@remix-run/react";
import Icon from "~/svg/icon";

function InfoHeader({ username }: { username?: string }) {
  return (
    <div className="px-4 py-2 shadow-md flex justify-between items-center">
      <Link to={"/"}>
        <Icon height={48} width={48} />
      </Link>
      <div className="flex flex-col items-end">
        <p>Welcome, {username ?? "Guest"}</p>
        {username ? (
          <p className="text-sm justify-end text-blue-600">Logout</p>
        ) : null}
      </div>
    </div>
  );
}

function Nav() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { pathname } = useLocation();

  return (
    <Card
      className={`absolute bottom-1/4 left-0 p-2 bg-card transition-all duration-300 ease-in-out rounded-l-none ${
        isOpen
          ? "w-48"
          : "w-20 shadow-none border-transparent bg-transparent opacity-55"
      }`}
    >
      <nav className="flex items-center gap-2">
        <Button
          className={`h-28 flex-shrink-0 w-14 ${isOpen ? "" : "opacity-35"}`}
          onMouseDown={() => setIsOpen((prev) => !prev)}
        >
          <p
            className={`${
              isOpen ? "rotate-180" : ""
            } transition-all duration-300 ease-in-out`}
          >
            &gt;
          </p>
        </Button>
        <div
          className={`flex flex-col space-y-2 overflow-hidden transition-all duration-300 ${
            isOpen ? "w-44 opacity-100" : "w-0 opacity-0"
          }`}
        >
          <Link to={pathname.startsWith("/recipes") ? "/meals" : "/recipes"}>
            <Button className="w-full">
              {pathname.startsWith("/recipes") ? "Meals" : "Recipes"}
            </Button>
          </Link>
          <Link to={pathname.startsWith("/shopping") ? "/meals" : "/shopping"}>
            <Button className="w-full">
              {pathname.startsWith("/shopping") ? "Meals" : "Shopping"}
            </Button>
          </Link>
        </div>
      </nav>
    </Card>
  );
}

export default function MainLayout({
  children,
  username,
}: {
  children: React.ReactNode;
  username?: string;
}) {
  return (
    <div className="relative h-full grid grid-rows-[min-content_1fr] grid-cols-1 overflow-hidden">
      <InfoHeader username={username} />
      {children}
      <Nav />
    </div>
  );
}
