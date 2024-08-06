-- CreateTable
CREATE TABLE "_UserRecipeList" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserRecipeList_AB_unique" ON "_UserRecipeList"("A", "B");

-- CreateIndex
CREATE INDEX "_UserRecipeList_B_index" ON "_UserRecipeList"("B");

-- AddForeignKey
ALTER TABLE "_UserRecipeList" ADD CONSTRAINT "_UserRecipeList_A_fkey" FOREIGN KEY ("A") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserRecipeList" ADD CONSTRAINT "_UserRecipeList_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
