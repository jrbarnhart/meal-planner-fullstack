import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Form, Link, useLocation } from "@remix-run/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import FavIcon from "../icons/favIcon";
import useScreenSize from "~/lib/hooks/useScreenSize";

function InfoHeader({ username }: { username?: string }) {
  const [open, setOpen] = useState(false);
  const screenSize = useScreenSize();
  return (
    <div className="px-4 py-2 shadow-md md:shadow-none flex justify-between items-center 2xl:max-w-[1920px] 2xl:w-full 2xl:justify-self-center 2xl:py-0">
      <Link to={"/"}>
        {screenSize.width >= 1536 ? (
          <img
            src="/titleOpt.svg"
            alt="Munchlify title"
            className="w-24 h-auto"
          />
        ) : (
          <FavIcon className="size-10" />
        )}
      </Link>
      <div className="grid grid-flow-col gap-3 items-center">
        <div className="grid grid-flow-col gap-x-1">
          <p className="md:text-lg">Welcome, </p>
          <Link className="text-accent underline md:text-lg" to={"/user"}>
            {username || "Guest"}
          </Link>
        </div>
        {username ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="p-2 aspect-square rounded-full md:rounded-md md:min-w-20">{`${
                screenSize.width >= 768 ? "Logout" : "X"
              }`}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Log out?</DialogTitle>
              <DialogDescription>
                Your recipe list and meal plans will be there when you come
                back.
              </DialogDescription>
              <Form method="post" className="flex justify-center">
                <Button
                  className="w-full md: max-w-72"
                  onClick={() => setOpen(false)}
                >
                  Logout
                </Button>
              </Form>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>
    </div>
  );
}

function MobileNav() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { pathname } = useLocation();

  return (
    <Card
      className={`absolute md:hidden bottom-1/4 left-0 p-2 bg-card transition-all duration-300 ease-in-out rounded-l-none ${
        isOpen
          ? "w-48"
          : "w-20 shadow-none border-transparent bg-transparent opacity-55"
      }`}
    >
      <nav className="flex items-center gap-2">
        <Button
          className={`h-28 flex-shrink-0 w-14 ${isOpen ? "" : "opacity-35"}`}
          onClick={() => setIsOpen((prev) => !prev)}
          asChild
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
          </svg>
        </Button>
        <div
          className={`flex flex-col space-y-2 overflow-hidden transition-all duration-300 ${
            isOpen ? "w-44 opacity-100" : "w-0 opacity-0"
          }`}
        >
          <Button
            variant={pathname === "/meals" ? "secondary" : "default"}
            className="w-full"
            onClick={() => setIsOpen(false)}
            asChild
          >
            <Link to={"/meals"}>Meals</Link>
          </Button>
          <Button
            variant={pathname === "/recipes" ? "secondary" : "default"}
            className="w-full"
            onClick={() => setIsOpen(false)}
            asChild
          >
            <Link to={"/recipes"}>Recipes</Link>
          </Button>
          <Button
            variant={pathname === "/recipes/library" ? "secondary" : "default"}
            className="w-full"
            onClick={() => setIsOpen(false)}
            asChild
          >
            <Link to={"/recipes/library"}>Recipe Library</Link>
          </Button>
        </div>
      </nav>
    </Card>
  );
}

function Nav() {
  const { pathname } = useLocation();

  return (
    <nav className="items-center hidden md:flex w-full justify-center">
      <div aria-hidden className="shadow-md flex-grow border-b-1 h-full" />
      <Button
        variant={pathname === "/meals" ? "ghost" : "default"}
        className={`rounded-br-none rounded-bl-none border border-transparent shadow-md hover:bg-background hover:text-foreground hover:border-primary hover:border-b-transparent ${
          pathname === "/meals"
            ? "border-primary border-b-transparent shadow-none"
            : ""
        }`}
        asChild
      >
        <Link to={"/meals"}>Meals</Link>
      </Button>
      <div aria-hidden className="shadow-md w-2 border-b-1 h-full" />
      <Button
        variant={pathname === "/recipes" ? "ghost" : "default"}
        className={`rounded-br-none rounded-bl-none border border-transparent shadow-md hover:bg-background hover:text-foreground hover:border-primary hover:border-b-transparent ${
          pathname === "/recipes"
            ? "border-primary border-b-transparent shadow-none"
            : ""
        }`}
        asChild
      >
        <Link to={"/recipes"}>Recipes</Link>
      </Button>
      <div aria-hidden className="shadow-md w-2 border-b-1 h-full" />
      <Button
        variant={pathname === "/recipes/library" ? "ghost" : "default"}
        className={`rounded-br-none rounded-bl-none border border-transparent shadow-md hover:bg-background hover:text-foreground hover:border-primary hover:border-b-transparent ${
          pathname === "/recipes/library"
            ? "border-primary border-b-transparent shadow-none"
            : ""
        }`}
        asChild
      >
        <Link to={"/recipes/library"}>Recipe Library</Link>
      </Button>
      <div aria-hidden className="shadow-md w-2 border-b-1 h-full" />
      <Button
        variant={pathname === "/recipes/add" ? "ghost" : "default"}
        className={`rounded-br-none rounded-bl-none border border-transparent shadow-md hover:bg-background hover:text-foreground hover:border-primary hover:border-b-transparent ${
          pathname === "/recipes/add"
            ? "border-primary border-b-transparent shadow-none"
            : ""
        }`}
        asChild
      >
        <Link to={"/recipes/add"}>Custom Recipe</Link>
      </Button>
      <div aria-hidden className="shadow-md flex-grow border-b-1 h-full" />
    </nav>
  );
}

export default function MainLayout({
  children,
  username,
}: {
  children: React.ReactNode;
  username?: string;
}) {
  const { pathname } = useLocation();
  return (
    <div className="relative h-full grid grid-rows-[min-content_1fr] md:grid-rows-[min-content_min-content_1fr] grid-cols-1 overflow-hidden">
      {pathname !== "/" && pathname !== "/signup" ? (
        <>
          <InfoHeader username={username} />
          <Nav />
        </>
      ) : null}
      {children}
      {pathname !== "/" && pathname !== "/signup" ? <MobileNav /> : null}
    </div>
  );
}
