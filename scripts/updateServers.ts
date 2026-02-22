import { Env } from "@(-.-)/env";
import { writeFileSync } from "fs";
import { GristDocAPI } from "grist-api";
import { z } from "zod";

const env = Env(
  z.object({
    GRIST_API_KEY: z.string(),
  }),
);

const grist = new GristDocAPI(
  "https://mjth.getgrist.com/o939NKtzq7Da/MJTH-Website-Data",
  { apiKey: env.GRIST_API_KEY },
);

const servers = (await grist.fetchTable("Servers")) as {
  id: string;
  Slug: string;
  Name: string;
  ListenURL: string;
  Provider: string;
  Status: string;
  MaxParticipants: number;
}[];

// Filter for active servers only
const activeServers = servers.filter(
  (server) => server.Status === "active" || server.Status === "testing",
);

// Generate markdown table
let markdownContent =
  "| สาขา | ผู้ให้บริการคลาวด์ | จำนวนคนสูงสุด | จำนวนผู้ใช้งาน |\n";
markdownContent += "|---|---|---:|---:|\n";

for (const server of activeServers) {
  const serverLink = `[${server.Name}](${server.ListenURL})`;
  markdownContent += `| ${serverLink} | ${server.Provider} | ${server.MaxParticipants} | <MjthServerItem address="${server.ListenURL}" /> |\n`;
}

writeFileSync("includes/servers.md", markdownContent);
console.log("Servers data updated successfully");
