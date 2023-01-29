import type { PrismaClient } from "@prisma/client";

export async function getLastExistingDate(prisma: PrismaClient) {
  return (
    (await prisma.currencyDate.aggregate({ _max: { date: true } }))._max.date ??
    new Date(0)
  );
}
