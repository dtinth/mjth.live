import { Env } from "@(-.-)/env";
import { writeFileSync } from "fs";
import { z } from "zod";

const env = Env(
  z.object({
    BALANCE_TRACKING_TSV_1: z.string(),
  })
);

const tsv = await fetch(env.BALANCE_TRACKING_TSV_1).then((res) => res.text());
const rows = tsv
  .split("\n")
  .map((row) => row.split("\t").map((x) => x.trim()))
  .filter((r) => r[0].match(/^\d\d\d\d-\d\d-\d\d$/))
  .map((r) => ({
    date: r[0],
    amount: +r[1],
    account: r[2],
    description: r[3] || "",
  }));

const output: [year: string, data: YearData][] = [];
interface YearData {}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

function tally(r: typeof rows) {
  const map = new Map<string, number>();
  for (const row of r) {
    const prev = map.get(row.account) || 0;
    const next = round(prev + Math.abs(row.amount));
    map.set(row.account, next);
  }
  return Object.fromEntries(
    Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  );
}
function total(r: typeof rows) {
  return r.reduce((a, r) => round(a + Math.abs(r.amount)), 0);
}

let balance = 0;
for (let year = 2021; year <= new Date().getFullYear(); year++) {
  const matchingRows = rows.filter((r) => r.date.startsWith(`${year}-`));
  const inRows = matchingRows.filter((r) => r.amount > 0);
  const outRows = matchingRows.filter((r) => r.amount < 0);
  const totalIn = total(inRows);
  const totalOut = total(outRows);
  const startingBalance = balance;
  const endingBalance = round(startingBalance + totalIn - totalOut);
  balance = endingBalance;
  output.push([
    `year${year}`,
    {
      year,
      in: tally(inRows),
      out: tally(outRows),
      totalIn: totalIn,
      totalOut: totalOut,
      startingBalance: startingBalance,
      endingBalance: endingBalance,
    },
  ]);
}

const outData = {
  byYear: Object.fromEntries(output.reverse()),
  lastUpdated: rows[rows.length - 1].date,
};
writeFileSync("docs/financials/data.json", JSON.stringify(outData, null, 2));
