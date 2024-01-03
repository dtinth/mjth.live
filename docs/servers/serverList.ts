import { atom, onMount } from "nanostores";
import { getInstrumentImageUrl } from "./instruments";

interface ServerList {
  count: number;
  maxTime: string;
  servers: RawServer[];
}
interface RawServer {
  count: number;
  clients: ClientInfo[];
  listenUrl?: string;
  port: number;
  address: string;
  name: string;
  genre: string;
}
interface Server extends RawServer {
  musicians: Musician[];
  listeners: number;
  addressWithPort: string;
}
interface ClientInfo {
  name: string;
  instrument: string;
  skill: string;
}
export interface Musician extends ClientInfo {
  imageUrl?: string;
}

export const $list = atom<Server[]>([]);
export const $count = atom(0);
export const $lastUpdated = atom("…");

async function refresh() {
  const data = await fetch(
    "https://json-data-storage-default-rtdb.asia-southeast1.firebasedatabase.app/tenants/thailand-jamulus-user-group/data/servers.json"
  )
    .then((r) => r.json())
    .then((t) => JSON.parse(t.json) as ServerList);
  $count.set(data.count);
  $lastUpdated.set(
    new Date(data.maxTime).toLocaleString("th-TH", {
      timeZone: "Asia/Bangkok",
    })
  );
  const list: Server[] = data.servers
    .sort((a, b) => b.count - a.count)
    .map((s) => {
      const clients = s.clients.map((c): Musician => {
        const instrument = c.instrument;
        const imageUrl = getInstrumentImageUrl(instrument);
        return {
          ...c,
          imageUrl: imageUrl,
        };
      });
      const listeners = clients.reduce((a, c) => {
        const match = c.name.match(/^[ ][ ]lobby \[(\d+)\][ ][ ]$/);
        if (!match) return a;
        if (!s.listenUrl) return a;
        if (c.skill !== "Expert") return a;
        if (c.instrument !== "Streamer") return a;
        return a + parseInt(match[1]);
      }, 0);
      return {
        ...s,
        musicians: clients.filter((c) => c.instrument !== "Streamer"),
        listeners,
        // musicians: clients,
        addressWithPort: s.port == 22124 ? s.address : `${s.address}:${s.port}`,
      } as Server;
    });
  $list.set(list);
  // if (!navigator.userAgent.includes("Googlebot")) {
  //     document.title = this.count
  //         ? `(${this.count}) ${originalTitle}`
  //         : originalTitle;
  // }
  console.log({ data, list });
}

onMount($list, () => {
  refresh();
  const interval = setInterval(refresh, 240000);
  return () => {
    clearInterval(interval);
  };
});
