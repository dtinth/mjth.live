import { BigQuery } from "@google-cloud/bigquery";
import { mkdirSync, readFileSync, writeFileSync } from "fs";

mkdirSync("tmp.local/queries", { recursive: true });
const bigquery = new BigQuery();

for (const queryName of [
  "thailand_yearly",
  "thailand_monthly",
  "mjth_yearly",
  "mjth_monthly",
]) {
  console.log(`=> ${queryName}`);
  const sql = readFileSync(
    `scripts/activeUsers/queries/${queryName}.sql`,
    "utf8"
  );
  const [rows] = await bigquery.query({ query: sql });
  console.log(`Queried ${rows.length} rows`);
  const outPath = `tmp.local/queries/${queryName}.json`;
  writeFileSync(
    outPath,
    "[" + rows.map((r) => JSON.stringify(r)).join("\n,") + "\n]"
  );
  console.log(`Written to ${outPath}`);
}
