const URL =
  "https://www5.ine.gub.uy/documents/Estad%C3%ADsticasecon%C3%B3micas/SERIES%20Y%20OTROS/Cotizaci%C3%B3n%20de%20monedas/Cotizaci%C3%B3n%20monedas.xlsx";

export async function downloadFile() {
  return (await fetch(URL)).arrayBuffer();
}
