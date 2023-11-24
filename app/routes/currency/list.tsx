import type { CurrencyDate } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { cors } from "remix-utils";
import { getAllByCurrency } from "~/models/currency.server";

export async function loader({ request }: LoaderArgs) {
  const requestedCurrency = new URL(request.url).searchParams
    .get("currency")
    ?.split(",");

  return cors(
    request,
    json<CurrencyDate[]>(await getAllByCurrency(requestedCurrency))
  );
}
