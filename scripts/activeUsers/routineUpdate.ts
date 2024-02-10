import { execSync } from "child_process";
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  statSync,
  unlinkSync,
} from "fs";
import * as Minio from "minio";
import { pipeline } from "stream/promises";

const minioClient = new Minio.Client({
  endPoint: "ap-south-1.linodeobjects.com",
  useSSL: true,
  accessKey: "RR1HWHRXKR5429MF73TM",
  secretKey: process.env.SK_RR1HWHRXKR5429MF73TM!,
});
const bucketName = "musicjammingth";
const dbName = "active_users.db";
mkdirSync("data.local/userslog", { recursive: true });

console.log('=> Downloading "active_users.db"...');
await pipeline(
  await minioClient.getObject(bucketName, dbName),
  createWriteStream(`data.local/${dbName}`)
);

const beforeSize = statSync(`data.local/${dbName}`).size;
console.log(
  `=> Size before update: ${(beforeSize / 1024 / 1024).toFixed(2)} MB`
);

if (beforeSize < 100 * 1024 * 1024) {
  console.log("=> Database seems too small... something is wrong?");
  process.exit(1);
}

const inputFiles: string[] = [];
const refTime = Date.now();
for (let i = 0; i < 7; i++) {
  const date = new Date(refTime - i * 86400e3).toISOString().slice(0, 10);
  const [yyyy, mm, dd] = date.split("-");
  const dailyUrl = `https://jamulus-archive.ap-south-1.linodeobjects.com/main/daily/${yyyy}-${mm}/${yyyy}-${mm}-${dd}.ndjson.br`;
  const targetFile = `data.local/userslog/${date}.ndjson.br`;
  if (existsSync(targetFile)) {
    console.log(`=> ${date} already exists, skipping...`);
    inputFiles.push(targetFile);
    continue;
  }
  console.log(`=> Downloading ${date}`);
  try {
    execSync(`wget -O ${targetFile} ${dailyUrl}`, {
      stdio: "inherit",
    });
    console.log(`=> Downloaded ${date}`);
    inputFiles.push(targetFile);
  } catch (e) {
    console.log(`=> Failed to download ${date}`, e);
    unlinkSync(targetFile);
  }
}

for (const file of inputFiles) {
  console.log(`=> Processing ${file}`);
  execSync(`pnpm tsx scripts/activeUsers/importActiveUsers.ts ${file}`, {
    stdio: "inherit",
  });
}

const afterSize = statSync(`data.local/${dbName}`).size;
console.log(`=> Size after update: ${(afterSize / 1024 / 1024).toFixed(2)} MB`);

console.log("=> Uploading the updated database...");
await minioClient.putObject(bucketName, dbName, `data.local/${dbName}`);
