-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "inputType" TEXT NOT NULL,
    "originalText" TEXT,
    "sourceName" TEXT,
    "language" TEXT NOT NULL DEFAULT 'English',
    "analysis" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
