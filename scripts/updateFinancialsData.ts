import { Env } from "@(-.-)/env";
import { writeFileSync } from "fs";
import { GristDocAPI } from "grist-api";
import { z } from "zod";

const env = Env(
  z.object({
    GRIST_DOC_URL: z.string(),
    GRIST_API_KEY: z.string(),
  })
);

const grist = new GristDocAPI(env.GRIST_DOC_URL, { apiKey: env.GRIST_API_KEY });
const accountMap = new Map(
  (await grist.fetchTable("Accounts")).map((row) => {
    return [row.id, row];
  })
);
const rows = (await grist.fetchTable("Transactions")).flatMap((row) => {
  const from = accountMap.get(row.From);
  const to = accountMap.get(row.To);
  if (!from || !to) return [];
  const date = new Date(+row.Date! * 1e3).toISOString().slice(0, 10);
  if (from.Name === "MJTH") {
    return [
      {
        date,
        amount: -row.Amount!,
        account: String(to.Name),
        description: row.Description || "",
      },
    ];
  } else if (to.Name === "MJTH") {
    return [
      {
        date,
        amount: +row.Amount!,
        account: String(from.Name),
        description: row.Description || "",
      },
    ];
  }
  console.warn("Unknown transaction:", row);
  return [];
});
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
