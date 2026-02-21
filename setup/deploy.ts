import { execSync } from "node:child_process";

interface DeployConfig {
  id: string;
  publicHost: string;
  jamulusMaxUsers: number;
  serverName: string;
  serverLocation: string;
  serverDirectory: string;
  domain: string;
}

const deployConfigs: DeployConfig[] = [
  {
    id: "peanut-express",
    publicHost: "103.27.201.197",
    jamulusMaxUsers: 20,
    serverName: "MJTH [Phayathai]",
    serverLocation: "Ruk-Com/CSLox, BKK;TH",
    serverDirectory: "anygenre1.jamulus.io:22124",
    domain: "peanut-express.server.mjth.live",
  },
  {
    id: "wrap-wealthy",
    publicHost: "47.81.39.184",
    jamulusMaxUsers: 20,
    serverName: "MJTH [Wattana]",
    serverLocation: "阿里云, BKK;TH",
    serverDirectory: "anygenre1.jamulus.io:22124",
    domain: "wrap-wealthy.server.mjth.live",
  },
  {
    id: "party-wavy",
    publicHost: "34.15.148.255",
    jamulusMaxUsers: 20,
    serverName: "TEST [Pathumwan]",
    serverLocation: "GCP, BKK;TH",
    serverDirectory: "anygenre1.jamulus.io:22124",
    domain: "34.15.148.255",
  },
  {
    id: "watch-mansion",
    publicHost: "147.50.242.54",
    jamulusMaxUsers: 20,
    serverName: "TEST [Wangmai]",
    serverLocation: "Hostify, BKK;TH",
    serverDirectory: "anygenre1.jamulus.io:22124",
    domain: "watch-mansion.server.mjth.live",
  },
];

const config = deployConfigs.find((c) => c.id === process.argv[2]);

if (!config) {
  console.error("Please provide a valid deployment ID.");
  console.error("Available IDs:", deployConfigs.map((c) => c.id).join(", "));
  process.exit(1);
}

const ageKey = execSync(
  'cat ~/.config/fnox/age-mjth.txt | grep "AGE-SECRET-KEY"',
)
  .toString()
  .trim();

process.env.DOCKER_CONTEXT = `mjth-${config.id}`;
process.env.MJTH_SERVER_ID = config.id;
process.env.FNOX_PROFILE = config.id;
process.env.FNOX_AGE_KEY = ageKey;
process.env.PUBLIC_HOST = config.publicHost;
process.env.JAMULUS_MAX_USERS = config.jamulusMaxUsers.toString();
process.env.SERVER_NAME = config.serverName;
process.env.SERVER_LOCATION = config.serverLocation;
process.env.SERVER_DIRECTORY = config.serverDirectory;
process.env.DOMAIN = config.domain;

console.log(`Starting deployment for ${config.id}...`);
execSync(
  "fnox exec docker compose --project-name=mjth-server --project-directory=setup up --detach --pull always --build",
  { stdio: "inherit" },
);
