-- CreateTable
CREATE TABLE "TagGraph" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "primaryTagID" TEXT NOT NULL,
    "relatedTagID" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "userID" TEXT,

    CONSTRAINT "TagGraph_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TagGraph_primaryTagID_userID_idx" ON "TagGraph"("primaryTagID", "userID");

-- CreateIndex
CREATE UNIQUE INDEX "TagGraph_primaryTagID_relatedTagID_userID_key" ON "TagGraph"("primaryTagID", "relatedTagID", "userID");

-- AddForeignKey
ALTER TABLE "TagGraph" ADD CONSTRAINT "TagGraph_primaryTagID_fkey" FOREIGN KEY ("primaryTagID") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagGraph" ADD CONSTRAINT "TagGraph_relatedTagID_fkey" FOREIGN KEY ("relatedTagID") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
