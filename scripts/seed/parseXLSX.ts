import * as XLSX from "xlsx";

const INT_REGEX = /^\d+$/;

export type SourceLine = (string | undefined)[];

export function parseXLSX(file: ArrayBuffer) {
  const book = XLSX.read(file, { type: "buffer" });
  const sheet = book.Sheets[book.SheetNames[0]];
  const lines = XLSX.utils.sheet_to_json<SourceLine>(sheet, {
    header: 1,
    range: 7,
  });

  const linesWithData = lines.filter(
    (line) => line[0] && INT_REGEX.test(line[0])
  );

  return linesWithData;
}
