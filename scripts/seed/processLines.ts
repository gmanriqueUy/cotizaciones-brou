import type { CurrencyDate } from "@prisma/client";
import { isBefore, isEqual, isValid, parse } from "date-fns";
import { es } from "date-fns/locale";
import invariant from "tiny-invariant";
import type { SourceLine } from "./parseXLSX";

const CURRENCY_ISOS = ["USD", "ARS", "BRL", "EUR"] as const;

const COLUMN = {
  DAY: 0,
  MONTH: 1,
  YEAR: 2,
  USD: {
    BUY: 3,
    SELL: 4,
  },
  ARS: {
    BUY: 12,
    SELL: 13,
  },
  BRL: {
    BUY: 15,
    SELL: 16,
  },
  EUR: {
    BUY: 9,
    SELL: 10,
  },
};

const FLOAT_REGEX = /^\d+([.,]\d+)?$/;

function sanitizeMonth(month: string) {
  if (!month) return "not found";

  let sanitizedMonth = month.toLocaleLowerCase().trim();

  switch (sanitizedMonth) {
    case "set":
    case "setiembre":
    case "septiembre":
      sanitizedMonth = "sep";
      break;
    case "agosto":
      sanitizedMonth = "ago";
      break;
  }

  return sanitizedMonth;
}

function getMonthToken(month: string) {
  return month.length === 3 ? "MMM" : "MMMM";
}

function getDate(day: number, month: string, year: number) {
  const sanitizedMonth = sanitizeMonth(month);
  const dateString = `${day} ${sanitizedMonth} ${year}`;
  return parse(
    dateString,
    `d ${getMonthToken(sanitizedMonth)} yyyy`,
    new Date(),
    { locale: es }
  );
}

function getValue(value: string | number | undefined) {
  if (typeof value === "number") return value;

  return value && typeof value === "string" && FLOAT_REGEX.test(value)
    ? parseFloat(value.replace(",", "."))
    : null;
}

export function processLines(lines: SourceLine[], lastDate: Date) {
  const currencyDates = new Map<string, CurrencyDate>();

  let month: SourceLine[number];
  let year: SourceLine[number];

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const day = line[COLUMN.DAY];
    month = line[COLUMN.MONTH] || month;
    year = line[COLUMN.YEAR] || year;

    invariant(typeof day === "number", "Day must be a number");
    invariant(typeof month === "string", "Month must be a string");
    invariant(typeof year === "number", "Year must be a number");

    const date = getDate(day, month, year);

    if (!isValid(date)) {
      console.warn("Invalid date found. Index: %s. Line: %o", index, line);
      continue;
    }

    if (isBefore(date, lastDate) || isEqual(date, lastDate)) continue;

    CURRENCY_ISOS.forEach((iso) => {
      const buy = getValue(line[COLUMN[iso].BUY]);
      const sell = getValue(line[COLUMN[iso].SELL]);

      if (buy && sell) {
        currencyDates.set(`${iso}-${date}`, {
          iso,
          date,
          buy,
          sell,
        });
      }
    });
  }

  return Array.from(currencyDates.values());
}
