-- CreateTable
CREATE TABLE "saved_review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "revisedCode" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "aiLikelihood" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "findings" TEXT NOT NULL,
    "analyzedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "saved_review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "saved_review_userId_createdAt_idx" ON "saved_review"("userId", "createdAt");
