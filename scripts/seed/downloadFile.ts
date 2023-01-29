const URL =
  "https://www.ine.gub.uy/c/document_library/get_file?uuid=1dcbe20a-153b-4caf-84a7-7a030d109471";

export async function downloadFile() {
  return (await fetch(URL)).arrayBuffer();
}
