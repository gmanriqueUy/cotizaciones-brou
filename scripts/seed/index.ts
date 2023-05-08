import { PrismaClient } from "@prisma/client";
import { downloadFile } from "./downloadFile";
import { getLastExistingDate } from "./getLastExistingDate";
import { parseXLSX } from "./parseXLSX";
import { processLines } from "./processLines";

const INSERT_SIZE = 200;
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

  let insertedCount = 0;
  do {
    const chunk = newRecords.splice(0, INSERT_SIZE);
    await prisma.$transaction(
      chunk.map((data) => prisma.currencyDate.create({ data }))
    );
    insertedCount += chunk.length;
    console.log("%s records inserted", insertedCount);
  } while (newRecords.length);

  console.log("All records successfully inserted into the database.");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
