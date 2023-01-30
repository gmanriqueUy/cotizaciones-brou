import { processLines } from "./processLines";

const line = [
  2,
  "Enero",
  2023,
  38.7,
  41.2,
  undefined,
  39.2,
  40.7,
  undefined,
  40.41,
  45.36,
  undefined,
  0.05,
  0.35,
  undefined,
  7.17,
  9.17,
];
const lastDate = new Date(0);

describe("processLines", () => {
  it("should process a single line", () => {
    expect(processLines([line], lastDate)).toMatchSnapshot();
  });
});
