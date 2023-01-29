-- CreateTable
CREATE TABLE "Currency" (
    "iso" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CurrencyDate" (
    "iso" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "buy" REAL NOT NULL,
    "sell" REAL NOT NULL,

    PRIMARY KEY ("iso", "date"),
    CONSTRAINT "CurrencyDate_iso_fkey" FOREIGN KEY ("iso") REFERENCES "Currency" ("iso") ON DELETE RESTRICT ON UPDATE CASCADE
);
