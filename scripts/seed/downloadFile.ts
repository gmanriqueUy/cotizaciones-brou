import { fetch } from "@remix-run/node";
import { readFile } from "fs/promises";

const URL =
  "https://www5.ine.gub.uy/documents/Estad%C3%ADsticasecon%C3%B3micas/SERIES%20Y%20OTROS/Cotizaci%C3%B3n%20monedas/Cotizaci%C3%B3n%20monedas.xlsx";

export async function downloadFile() {
  const response = await fetch(URL);

  if (response.status === 200) {
    return response.arrayBuffer();
  }

  console.log("File download failed. Reading fallback.xlsx");
  return await readFile(__dirname + "/fallback.xlsx");
}
