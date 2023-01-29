import { PrismaClient } from "@prisma/client";
import { downloadFile } from "./downloadFile";
import { getLastExistingDate } from "./getLastExistingDate";
import { parseXLSX } from "./parseXLSX";
import { processLines } from "./processLines";

const prisma = new PrismaClient();

async function seed() {
  console.log("Downloading file...");
  const [file, lastDate] = await Promise.all([
    downloadFile(),
    getLastExistingDate(prisma),
  ]);

  const lines = parseXLSX(file);
  const newRecords = processLines(lines, lastDate);

  if (!newRecords.length) {
    console.log("There are no new records to insert. Exiting...");
    return;
  }

  console.log("About to insert %s new records", newRecords.length);

  await prisma.$transaction(
    newRecords.map((data) => prisma.currencyDate.create({ data }))
  );

  console.log("New records successfully inserted into the database.");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
