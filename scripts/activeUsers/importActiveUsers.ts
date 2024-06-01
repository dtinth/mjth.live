import { db } from "./db";
import { createHash } from "crypto";
import fs from "fs";
import zlib from "zlib";

interface BucketStat {
  hourBucket: string;
  directoryName: string;
  serverHash: string;
  server: {
    name: string;
    country: string;
    city: string;
    ip: string;
    port: number;
  };
  count: number;
  clients: Record<string, ClientStat>;
}

interface ClientStat {
  clientHash: string;
  client: {
    name: string;
    country: string;
    city: string;
    instrument: string;
    skill: string;
  };
  count: number;
}

async function insertData(path) {
  console.log("Loading data from:", path);
  const lines = zlib
    .brotliDecompressSync(fs.readFileSync(path))
    .toString()
    .split("\n");

  const activeUsers: Record<string, BucketStat> = {};
  const clientKeySet = new Set<string>();
  const serverKeySet = new Set<string>();
  let dataPoints = 0;
  for (const line of lines) {
    if (!line.trim()) continue;
    dataPoints++;
    const data = JSON.parse(line);
    const hourBucket = data.time.slice(0, 13);
    if (!Array.isArray(data.list)) {
      console.warn("No list found in data for time", data.time);
      continue;
    }
    for (const server of data.list) {
      const serverKey = [data.genre, server.name, server.ip, server.port].join(
        ":"
      );
      const serverHash = createHash("md5").update(serverKey).digest("hex");
      const key = [hourBucket, serverKey].join(":");
      const bucket = (activeUsers[key] ??= {
        hourBucket,
        directoryName: data.genre,
        serverHash,
        server: {
          name: server.name,
          country: server.country,
          city: server.city,
          ip: server.ip,
          port: server.port,
        },
        count: 0,
        clients: {},
      });
      bucket.count++;
      serverKeySet.add(serverKey);
      for (const client of server.clients || []) {
        const clientName = client.name.trim();
        const clientKey = [
          clientName,
          client.city,
          client.country,
          client.instrument,
          client.skill,
        ].join(":");
        const clientHash = createHash("md5").update(clientKey).digest("hex");
        const clientStat = (bucket.clients[clientKey] ??= {
          clientHash,
          client: {
            name: clientName,
            city: client.city,
            country: client.country,
            instrument: client.instrument,
            skill: client.skill,
          },
          count: 0,
        });
        clientStat.count++;
        clientKeySet.add(clientKey);
      }
    }
  }

  console.log("Number of data points scanned:", dataPoints);
  console.log("Number of servers:", serverKeySet.size);
  console.log("Number of clients:", clientKeySet.size);
  console.log(
    "Number of rows:",
    Object.values(activeUsers).reduce(
      (a, b) => a + Object.keys(b.clients).length,
      0
    )
  );

  let rowsAffected = 0;

  for (const bucket of Object.values(activeUsers)) {
    for (const clientStat of Object.values(bucket.clients)) {
      const id = [
        bucket.hourBucket,
        bucket.serverHash,
        clientStat.clientHash,
      ].join("|");
      const row = {
        id,
        date: bucket.hourBucket.slice(0, 10),
        hour: +bucket.hourBucket.slice(11),
        hours_seen: clientStat.count / bucket.count,
        client_name: clientStat.client.name,
        client_country: clientStat.client.country,
        client_city: clientStat.client.city,
        client_instrument: clientStat.client.instrument,
        client_skill: clientStat.client.skill,
        server_name: bucket.server.name,
        server_country: bucket.server.country,
        server_city: bucket.server.city,
        server_ip: bucket.server.ip,
        server_port: bucket.server.port,
        server_directory_name: bucket.directoryName,
      };
      // Upsert into the database
      const stmt = db.prepare(
        `INSERT INTO active_users
      (${Object.keys(row).join(",")})
      VALUES
      (${Object.keys(row)
        .map((key) => `@${key}`)
        .join(",")})
      ON CONFLICT(id) DO UPDATE SET hours_seen = @hours_seen`
      );
      const info = stmt.run(row);
      rowsAffected += info.changes;
    }
  }
  console.log("Number of rows affected:", rowsAffected);
}

insertData(process.argv[2]);
