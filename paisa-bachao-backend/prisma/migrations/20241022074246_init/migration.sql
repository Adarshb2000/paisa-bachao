-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'category',
    "usage" INTEGER NOT NULL DEFAULT 0,
    "userID" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToTransaction" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Category_name_userID_idx" ON "Category"("name", "userID");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToTransaction_AB_unique" ON "_CategoryToTransaction"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToTransaction_B_index" ON "_CategoryToTransaction"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToTransaction" ADD CONSTRAINT "_CategoryToTransaction_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToTransaction" ADD CONSTRAINT "_CategoryToTransaction_B_fkey" FOREIGN KEY ("B") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
