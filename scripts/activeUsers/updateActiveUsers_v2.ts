import { BigQuery } from "@google-cloud/bigquery";
import { readFileSync } from "fs";

const sql = readFileSync(
  "scripts/activeUsers/queries/thailand_yearly.sql",
  "utf8"
);
const bigquery = new BigQuery();
const result = await bigquery.query({ query: sql });
console.log(result);
