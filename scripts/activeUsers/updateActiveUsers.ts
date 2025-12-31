import { getOrCreate } from "@thai/get-or-create";
import { readFileSync, writeFileSync } from "fs";

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
  mjth: [
    "🏘 MJTH Lobby",
    "MusicJammingTH [r1]",
    "🏘 MJTH.live",
    "MJTH [Dindaeng]",
    "MJTH [Phayathai]",
    "MJTH [Huaikhwang]",
  ],
  jamulusth: [
    "🎵JamulusTH [PRO]",
    "JamulusTH [01]",
    "🎵JamulusTH",
    "🎵JamulusTH [Pro]",
    "🎵JamulusTH [Studio]",
    "🎵JamulusTH [Play]",
  ],
  dharma: ["- Dharma Room", " - Drama Room TH"],
  openjam: ["OpenJam.TH", "OpenJam.TH [mini]"],
  thomas: ["Thomas playground"],
};
type ServerCategory = keyof typeof serverCategories;
const serverToCategory = new Map<string, ServerCategory>(
  Object.entries(serverCategories).flatMap(([category, servers]) =>
    servers.map((server) => [server, category as ServerCategory])
  )
);

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
