import { getOrCreate } from "@thai/get-or-create";
import { createReadStream, mkdirSync, writeFileSync } from "fs";
import { createInterface } from "readline";
import zlib from "zlib";

async function loadData() {
  let header: string[] | undefined;
  let rows: any[] = [];
  for await (const line of createInterface({
    input: createReadStream(
      "scripts/activeUsers/legacyData/mjth_legacy.tsv.br"
    ).pipe(zlib.createBrotliDecompress()),
  })) {
    if (!header) {
      header = line.split("\t");
      console.log(header);
      continue;
    }
    rows.push(
      Object.fromEntries(header.map((k, i) => [k, line.split("\t")[i]]))
    );
  }
  console.log("Rows read:", rows.length);
  return rows as {
    date: string;
    hour: string;
    client_name: string;
    client_instrument: string;
    hours_seen: string;
  }[];
}

function createAggregator<T extends object>() {
  const map = new Map<string, T & { hours_seen: number }>();
  return {
    add: (search: T, hoursSeen: number) => {
      const key = Object.keys(search)
        .sort()
        .map((k) => `${k}:${search[k]}`)
        .join(",");
      const entry = getOrCreate(map, key, () => ({ ...search, hours_seen: 0 }));
      entry.hours_seen += hoursSeen;
    },
    export: () =>
      Array.from(map.keys())
        .sort()
        .map((k) => map.get(k)!),
  };
}

async function main() {
  const rows = await loadData();
  const monthly = createAggregator<{
    month: string;
    client_name: string;
    server_name: string;
  }>();
  const yearly = createAggregator<{
    year: string;
    client_name: string;
    server_name: string;
  }>();
  for (const row of rows) {
    if (row.date < "2022-01-01") continue;
    if (!row.date.match(/^\d\d\d\d-\d\d-\d\d$/)) {
      console.log("Skipping invalid row", row);
      continue;
    }
    if (["Streamer", "Recorder"].includes(row.client_instrument)) continue;
    if (!row.client_name) continue;
    if (row.client_name === "No Name") continue;
    if (row.client_name.match(/\sBRB$/)) continue;
    if (row.client_name.match(/\sAFK$/)) continue;
    const month = row.date.slice(0, 7);
    const year = row.date.slice(0, 4);
    monthly.add(
      {
        month,
        client_name: row.client_name,
        server_name: "🏘 MJTH.live",
      },
      parseFloat(row.hours_seen)
    );
    yearly.add(
      {
        year,
        client_name: row.client_name,
        server_name: "🏘 MJTH.live",
      },
      parseFloat(row.hours_seen)
    );
  }
  mkdirSync("tmp.local/queries", { recursive: true });

  const monthlyRows = monthly.export();
  const yearlyRows = yearly.export();

  const monthlyOutFile = "tmp.local/queries/mjth_legacy_monthly.json";
  const yearlyOutFile = "tmp.local/queries/mjth_legacy_yearly.json";
  writeFileSync(
    monthlyOutFile,
    "[" + monthlyRows.map((r) => JSON.stringify(r)).join("\n,") + "\n]"
  );
  console.log("Written to", monthlyOutFile);

  writeFileSync(
    yearlyOutFile,
    "[" + yearlyRows.map((r) => JSON.stringify(r)).join("\n,") + "\n]"
  );
  console.log("Written to", yearlyOutFile);
}

await main();
