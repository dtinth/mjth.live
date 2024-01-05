import { writeFileSync } from "fs";
import { db } from "./db";

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
  jamulusth: ["🎵JamulusTH [PRO]", "JamulusTH [01]", "🎵JamulusTH"],
  dharma: ["- Dharma Room"],
};
const serverToCategory = new Map(
  Object.entries(serverCategories).flatMap(([category, servers]) =>
    servers.map((server) => [server, category])
  )
);

async function generateDateRangeData(
  startDate: string,
  endDate: string,
  filter: ServerFilter,
  max: number
) {
  const sql = `WITH daily_rollup AS (
    SELECT client_name, date, server_name, SUM(hours_seen) AS hours_seen
    FROM active_users
    WHERE (${
      filter === "mjth"
        ? "server_name IN ('🏘 MJTH Lobby', 'MusicJammingTH [r1]', '🏘 MJTH.live')"
        : "server_country = 'Thailand' OR server_city = 'Uranus'"
    })
    AND (date >= @start_date AND date < @end_date)
    AND client_instrument <> 'Streamer'
    AND client_name NOT IN ('No Name')
    AND client_name <> ''
    AND client_name NOT LIKE '% BRB'
    AND client_name NOT LIKE '% AFK'
    GROUP BY client_name, date, server_name
    HAVING SUM(hours_seen) < 16
  )
  SELECT client_name, server_name, SUM(hours_seen) AS hours_seen
  FROM daily_rollup
  GROUP BY client_name, server_name
  ORDER BY hours_seen DESC`;

  const rows = db.prepare(sql).all({
    start_date: startDate,
    end_date: endDate,
  });

  const byName = new Map();

  for (const row of rows) {
    const { client_name, server_name, hours_seen } = row;
    const serverCategory = serverToCategory.get(server_name) ?? "others";
    const client = byName.get(client_name) ?? {
      name: client_name,
      servers: new Map(),
      hoursSeen: 0,
    };
    client.servers.set(
      serverCategory,
      (client.servers.get(serverCategory) ?? 0) + hours_seen
    );
    client.hoursSeen += hours_seen;
    byName.set(client_name, client);
  }
  return {
    byName: [...byName.values()]
      .sort((a, b) => b.hoursSeen - a.hoursSeen)
      .map((client) => {
        return {
          ...client,
          servers: [...client.servers.entries()]
            .map(([category, hoursSeen]) => ({
              category,
              hoursSeen,
            }))
            .sort((a, b) => b.hoursSeen - a.hoursSeen),
        };
      })
      .slice(0, max),
  };
}

type ServerFilter = "mjth" | "thailand";

async function generateMonthlyData(yearMonth: string, filter: ServerFilter) {
  const startDate = `${yearMonth}-01`;
  const endDate = `${yearMonth}-32`;
  const output = {
    year: +yearMonth.slice(0, 4),
    month: +yearMonth.slice(5),
    ...(await generateDateRangeData(startDate, endDate, filter, 16)),
  };
  return output;
}

async function generateYearlyData(year: number, filter: ServerFilter) {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-32`;
  const output = {
    year,
    ...(await generateDateRangeData(startDate, endDate, filter, 128)),
  };
  return output;
}

async function process(
  filter: ServerFilter,
  firstMonth: string,
  outFile: string
) {
  const months: any[] = [];
  const years: any[] = [];
  const yearMonths = [...generateYearMonths(firstMonth)].slice(1);
  const yearSet = new Set<number>();
  for (const yearMonth of yearMonths) {
    const data = await generateMonthlyData(yearMonth, filter);
    months.push(data);
    yearSet.add(data.year);
  }
  for (const year of yearSet) {
    years.push(await generateYearlyData(year, filter));
  }
  const payload = {
    byYearMonth: months,
    byYear: years,
  };
  writeFileSync(outFile, JSON.stringify(payload, null, 2));
}

await process("thailand", "2023-08", "docs/community/stats/activeUsers.json");
await process("mjth", "2022-01", "docs/stats/activeUsers.json");
