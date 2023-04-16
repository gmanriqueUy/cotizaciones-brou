import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { format, isValid } from "date-fns";
import { getAllCurrenciesByDate } from "~/models/currency.server";
import type { Currency, CurrencyDate } from "@prisma/client";

type Rates = Record<Currency["iso"], Pick<CurrencyDate, "buy" | "sell">>;

type CurrenciesResponse = {
  base: Currency["iso"];
  timestamp: number;
  dateISOString: string;
  rates: Rates;
};

function toRates(currencyDates: CurrencyDate[]): Rates {
  return currencyDates.reduce<Rates>((rates, { iso, buy, sell }) => {
    rates[iso] = { buy, sell };
    return rates;
  }, {});
}

export async function loader({ params }: LoaderArgs) {
  invariant(params.date, "date not found");

  const date = params.date === "latest" ? new Date() : new Date(params.date);

  if (!isValid(date)) {
    throw new Response("Invalid date", { status: 400 });
  }

  const currencyDates = await getAllCurrenciesByDate(date);

  if (!currencyDates) {
    throw new Response("No data found for the date provided", { status: 404 });
  }

  return json<CurrenciesResponse>({
    base: "UYU", // TODO - Remove hard-coded value
    timestamp: currencyDates[0].date.getTime(),
    dateISOString: format(currencyDates[0].date, "yyyy-MM-dd"),
    rates: toRates(currencyDates),
  });
}
