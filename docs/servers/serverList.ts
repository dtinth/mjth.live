import { atom, onMount } from "nanostores";
import { getInstrumentImageUrl } from "./instruments";

interface Server {
  count: number;
  listenUrl?: string;
  port: number;
  address: string;
  name: string;
  genre: string;
  musicians: Musician[];
  listeners: number;
  addressWithPort: string;

  _clients?: JamulusExplorerClient[];
}
interface Musician {
  name: string;
  instrument: string;
  skill: string;
  imageUrl?: string;
}

export const $list = atom<Server[]>([]);
export const $count = atom(0);
export const $lastUpdated = atom("…");

interface InformationFile {
  key: string;
}
interface DataPoint {
  time: string;
  genre: string;
  list: JamulusExplorerServer[];
}
interface JamulusExplorerServer {
  numip: number;
  port: number;
  country: string;
  maxclients: number;
  perm: number;
  name: string;
  ipaddrs: string;
  city: string;
  ip: string;
  ping: number;
  os: string;
  version: string;
  versionsort: string;
  nclients?: number;
  clients?: JamulusExplorerClient[];
  index: number;
}
export interface JamulusExplorerClient {
  chanid: number;
  country: string;
  instrument: string;
  skill: string;
  name: string;
  city: string;
}

const listenUrls = {
  "150.95.25.226": "https://lobby.musicjammingth.net/",
  "103.246.19.200": "https://lobby.jamulusth.com/",
  "103.91.189.71": "https://lobbypro.jamulusth.com/",
};

async function refresh() {
  const info = await fetch(
    "https://jamulus-archive.ap-south-1.linodeobjects.com/main/latest.json"
  ).then((r) => r.json() as Promise<InformationFile>);

  const datapoints = await fetch(
    `https://jamulus-archive.ap-south-1.linodeobjects.com/${info.key}`
  ).then((r) => r.json() as Promise<DataPoint[]>);

  const serversInThailand = datapoints.flatMap((d) =>
    d.list
      .filter((s) => s.country === "Thailand" || s.city === "Uranus")
      .map((s) => ({
        ...s,
        genre: d.genre,
      }))
  );
  const count = serversInThailand.length;

  const maxTime = datapoints
    .map((d) => new Date(d.time).getTime())
    .reduce((a, b) => Math.max(a, b), 0);
  const lastUpdated = new Date(maxTime).toLocaleString("th-TH", {
    timeZone: "Asia/Bangkok",
  });

  const list: Server[] = serversInThailand
    .map((s): Server => {
      const musicians: Musician[] = [];
      let listeners = 0;
      const listenUrl = listenUrls[s.ip] ?? undefined;
      for (const c of s.clients ?? []) {
        const instrument = c.instrument;
        if (instrument === "Streamer" || instrument === "Recorder") {
          const m = c.name.match(/^[ ][ ]lobby \[(\d+)\][ ][ ]$/);
          if (m) {
            listeners += parseInt(m[1]);
          }
          continue;
        }
        const imageUrl = getInstrumentImageUrl(instrument);
        musicians.push({
          ...c,
          imageUrl: imageUrl,
        });
      }

      return {
        count: musicians.length,
        musicians,
        port: s.port,
        address: s.ip,
        name: s.name,
        genre: s.genre,
        listeners,
        addressWithPort: s.port == 22124 ? s.ip : `${s.ip}:${s.port}`,
        listenUrl,
        _clients: s.clients,
      };
    })
    .sort((a, b) => b.count - a.count);

  $count.set(count);
  $lastUpdated.set(lastUpdated);
  $list.set(list);
  console.log({ list });

  // const list: Server[] = data.servers
  //   .sort((a, b) => b.count - a.count)
  //   .map((s) => {
  //     const clients = s.clients.map((c): Musician => {
  //       const instrument = c.instrument;
  //       const imageUrl = getInstrumentImageUrl(instrument);
  //       return {
  //         ...c,
  //         imageUrl: imageUrl,
  //       };
  //     });
  //     const listeners = clients.reduce((a, c) => {
  //       const match = c.name.match(/^[ ][ ]lobby \[(\d+)\][ ][ ]$/);
  //       if (!match) return a;
  //       if (!s.listenUrl) return a;
  //       if (c.skill !== "Expert") return a;
  //       if (c.instrument !== "Streamer") return a;
  //       return a + parseInt(match[1]);
  //     }, 0);
  //     return {
  //       ...s,
  //       musicians: clients.filter((c) => c.instrument !== "Streamer"),
  //       listeners,
  //       // musicians: clients,
  //       addressWithPort: s.port == 22124 ? s.address : `${s.address}:${s.port}`,
  //     } as Server;
  //   });
  // $list.set(list);
  // // if (!navigator.userAgent.includes("Googlebot")) {
  // //     document.title = this.count
  // //         ? `(${this.count}) ${originalTitle}`
  // //         : originalTitle;
  // // }
  // console.log({ data, list });
}

if (typeof window !== "undefined") {
  onMount($list, () => {
    refresh();
    const interval = setInterval(refresh, 240000);
    return () => {
      clearInterval(interval);
    };
  });
}
