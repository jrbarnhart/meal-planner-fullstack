import RouteContent from "~/components/layout/routeContent";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "~/components/ui/menubar";

function LibraryFilters() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Type</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <ul>
              <label>Label</label>
              <input type="checkbox" />
            </ul>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export default function RecipesLibrary() {
  return (
    <RouteContent>
      <h1 className="text-lg font-bold">Munchlify Recipe Library</h1>
      <LibraryFilters />
    </RouteContent>
  );
}
