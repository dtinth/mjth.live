import { readFileSync, writeFileSync } from "fs";
import { getOrCreate } from "./_getOrCreate";

interface StatRow {
  client_name: string;
  server_name: string;
  hours_seen: number;
}
interface MonthlyStatRow extends StatRow {
  month: string;
}
interface YearlyStatRow extends StatRow {
  year: string;
}

function* generateYearMonths(end: string) {
  let last;
  for (
    let date = new Date();
    date.toISOString() >= end;
    date.setDate(date.getDate() - 1)
  ) {
    const month = date.toISOString().slice(0, 7);
    if (last !== month) {
      last = month;
      yield month;
    }
  }
}

const serverCategories = {
  mjth: ["🏘 MJTH Lobby", "MusicJammingTH [r1]", "🏘 MJTH.live"],
  jamulusth: [
    "🎵JamulusTH [PRO]",
    "JamulusTH [01]",
    "🎵JamulusTH",
    "🎵JamulusTH [Pro]",
  ],
  dharma: ["- Dharma Room"],
};
type ServerCategory = keyof typeof serverCategories;
const serverToCategory = new Map<string, ServerCategory>(
  Object.entries(serverCategories).flatMap(([category, servers]) =>
    servers.map((server) => [server, category as ServerCategory])
  )
);

// async function generateDateRangeData(
//   startDate: string,
//   endDate: string,
//   filter: ServerFilter,
//   max: number
// ) {
//   const sql = `WITH daily_rollup AS (
//     SELECT client_name, date, server_name, SUM(hours_seen) AS hours_seen
//     FROM active_users
//     WHERE (${
//       filter === "mjth"
//         ? "server_name IN ('🏘 MJTH Lobby', 'MusicJammingTH [r1]', '🏘 MJTH.live')"
//         : "(server_country = 'Thailand' OR server_city = 'Uranus') AND (server_directory_name <> 'MJTH Legacy')"
//     })
//     AND (date >= @start_date AND date < @end_date)
//     AND client_instrument NOT IN ('Streamer', 'Recorder')
//     AND client_name NOT IN ('No Name', '')
//     AND client_name NOT LIKE '% BRB'
//     AND client_name NOT LIKE '% AFK'
//     GROUP BY client_name, date, server_name
//     HAVING SUM(hours_seen) < 16
//   )
//   SELECT client_name, server_name, SUM(hours_seen) AS hours_seen
//   FROM daily_rollup
//   GROUP BY client_name, server_name
//   ORDER BY hours_seen DESC`;

//   const rows = db.prepare(sql).all({
//     start_date: startDate,
//     end_date: endDate,
//   });

//   const byName = new Map();

//   for (const row of rows) {
//     const { client_name, server_name, hours_seen } = row;
//     const serverCategory = serverToCategory.get(server_name) ?? "others";
//     const client = byName.get(client_name) ?? {
//       name: client_name,
//       servers: new Map(),
//       hoursSeen: 0,
//     };
//     client.servers.set(
//       serverCategory,
//       (client.servers.get(serverCategory) ?? 0) + hours_seen
//     );
//     client.hoursSeen += hours_seen;
//     byName.set(client_name, client);
//   }
//   return {
//     byName: [...byName.values()]
//       .sort((a, b) => b.hoursSeen - a.hoursSeen)
//       .map((client) => {
//         return {
//           ...client,
//           servers: [...client.servers.entries()]
//             .map(([category, hoursSeen]) => ({
//               category,
//               hoursSeen,
//             }))
//             .sort((a, b) => b.hoursSeen - a.hoursSeen),
//         };
//       })
//       .slice(0, max),
//   };
// }
interface UsageRanking {
  byName: RankingEntryByName[];
}
interface RankingEntryByName {
  name: string;
  hoursSeen: number;
  servers: RankingEntryServer[];
}
interface RankingEntryServer {
  category: string;
  hoursSeen: number;
}
interface MonthlyRanking extends UsageRanking {
  year: number;
  month: number;
}
interface YearlyRanking extends UsageRanking {
  year: number;
}

// type ServerFilter = "mjth" | "thailand";

// async function generateMonthlyData(yearMonth: string, filter: ServerFilter) {
//   const output: MonthlyRanking = {
//     year: +yearMonth.slice(0, 4),
//     month: +yearMonth.slice(5),
//     // ...(await generateDateRangeData(startDate, endDate, filter, 20)),
//   };
//   return output;
// }
// async function generateYearlyData(year: number, filter: ServerFilter) {
//   const output: YearlyRanking = {
//     year,
//     // ...(await generateDateRangeData(startDate, endDate, filter, 1000)),
//   };
//   output.byName = output.byName.filter((client) => client.hoursSeen > 16);
//   return output;
// }

// async function process(
//   filter: ServerFilter,
//   firstMonth: string,
//   outFile: string
// ) {
//   const months: any[] = [];
//   const years: any[] = [];
//   const yearMonths = [...generateYearMonths(firstMonth)];
//   const yearSet = new Set<number>();
//   for (const yearMonth of yearMonths) {
//     const data = await generateMonthlyData(yearMonth, filter);
//     months.push(data);
//     yearSet.add(data.year);
//   }
//   for (const year of yearSet) {
//     years.push(await generateYearlyData(year, filter));
//   }
//   const payload = {
//     byYearMonth: months,
//     byYear: years,
//   };
//   writeFileSync(outFile, JSON.stringify(payload, null, 2));
// }

// await process("thailand", "2023-08", "docs/community/stats/activeUsers.json");
// await process("mjth", "2022-01", "docs/stats/activeUsers.json");

function groupByName(rows: StatRow[]): RankingEntryByName[] {
  type ByNameData = {
    name: string;
    hoursSeen: number;
    servers: Map<string, { category: string; hoursSeen: number }>;
  };
  const byName = new Map<string, ByNameData>();
  for (const row of rows) {
    const name = row.client_name;
    const client = getOrCreate(byName, name, () => ({
      name,
      hoursSeen: 0,
      servers: new Map(),
    }));
    client.hoursSeen += row.hours_seen;
    const category = serverToCategory.get(row.server_name) ?? "others";
    const categoryData = getOrCreate(client.servers, category, () => ({
      category,
      hoursSeen: 0,
    }));
    categoryData.hoursSeen += row.hours_seen;
  }

  return Array.from(byName.values())
    .sort((a, b) => b.hoursSeen - a.hoursSeen)
    .map((data): RankingEntryByName => {
      return {
        name: data.name,
        hoursSeen: data.hoursSeen,
        servers: Array.from(data.servers.values()).sort(
          (a, b) => b.hoursSeen - a.hoursSeen
        ),
      };
    });
}

interface GenerateRankingOptions<R extends StatRow, S, O> {
  rows: R[];
  groupKey: (row: R) => string;
  groupInfo: (row: R) => S;
  formatGroup: (entries: RankingEntryByName[], groupInfo: S) => O;
}
function generateRanking<R extends StatRow, S, O>(
  options: GenerateRankingOptions<R, S, O>
) {
  type Group = {
    rows: R[];
    groupInfo: S;
  };
  const groups = new Map<string, Group>();
  for (const row of options.rows) {
    const groupKey = options.groupKey(row);
    const group = getOrCreate(groups, groupKey, () => ({
      rows: [],
      groupInfo: options.groupInfo(row),
    }));
    group.rows.push(row);
  }
  return Array.from(groups.keys())
    .sort()
    .reverse()
    .map((key) => {
      const group = groups.get(key)!;
      return options.formatGroup(groupByName(group.rows), group.groupInfo);
    });
}

interface GenerateRankingFileOptions {
  monthly: MonthlyStatRow[];
  yearly: YearlyStatRow[];
  outFile: string;
}
async function generateRankingFile(options: GenerateRankingFileOptions) {
  const byYearMonth = generateRanking({
    rows: options.monthly,
    groupKey: (row) => row.month,
    groupInfo: (row) => ({
      year: +row.month.slice(0, 4),
      month: +row.month.slice(5),
    }),
    formatGroup: (entries, groupInfo): MonthlyRanking => ({
      year: groupInfo.year,
      month: groupInfo.month,
      byName: entries.slice(0, 20),
    }),
  });
  const byYear = generateRanking({
    rows: options.yearly,
    groupKey: (row) => row.year,
    groupInfo: (row) => ({ year: +row.year }),
    formatGroup: (entries, groupInfo): YearlyRanking => ({
      year: groupInfo.year,
      byName: entries.filter((entry) => entry.hoursSeen > 16),
    }),
  });
  const payload = {
    byYearMonth: byYearMonth,
    byYear: byYear,
  };
  writeFileSync(options.outFile, JSON.stringify(payload, null, 2));
  console.log(`Written to ${options.outFile}`);
}
const loadJson = (file: string) => JSON.parse(readFileSync(file, "utf-8"));
await generateRankingFile({
  monthly: [
    ...loadJson("tmp.local/queries/mjth_legacy_monthly.json"),
    ...loadJson("tmp.local/queries/mjth_monthly.json"),
  ],
  yearly: [
    ...loadJson("tmp.local/queries/mjth_legacy_yearly.json"),
    ...loadJson("tmp.local/queries/mjth_yearly.json"),
  ],
  outFile: "docs/stats/activeUsers.json",
});
await generateRankingFile({
  monthly: loadJson("tmp.local/queries/thailand_monthly.json"),
  yearly: loadJson("tmp.local/queries/thailand_yearly.json"),
  outFile: "docs/community/stats/activeUsers.json",
});
