import { prisma } from "~/db.server";

async function getLastDateWithDataBeforeDate(date: Date) {
  return (
    await prisma.currencyDate.aggregate({
      _max: {
        date: true,
      },
      where: {
        date: {
          lte: date,
        },
      },
    })
  )._max.date;
}

export async function getAllCurrenciesByDate(date: Date) {
  const lastDateWithData = await getLastDateWithDataBeforeDate(date);

  if (!lastDateWithData) return null;

  return prisma.currencyDate.findMany({
    where: {
      date: lastDateWithData,
    },
  });
}
