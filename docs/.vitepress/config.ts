import { defineConfig, type DefaultTheme } from "vitepress";

const guide: DefaultTheme.SidebarItem & DefaultTheme.NavItem = {
  text: "MJTH Guide",
  items: [
    {
      text: "Jamulus คืออะไร",
      link: "/jamulus/",
    },
    {
      text: "เช็คความพร้อมอุปกรณ์",
      link: "/check/",
    },
    {
      text: "คำถามที่พบบ่อย (FAQ)",
      link: "/faq/",
    },
    {
      text: "เข้ากลุ่ม Discord",
      link: "https://discord.gg/tZ8bKmsrcp",
    },
    {
      text: "เข้ากลุ่ม Facebook",
      link: "https://www.facebook.com/groups/jamulus.th/",
    },
  ],
};

const services: DefaultTheme.SidebarItem & DefaultTheme.NavItem = {
  text: "MJTH Services",
  items: [
    {
      text: "เกี่ยวกับ MJTH Services",
      link: "/services/",
    },
    {
      text: "รายชื่อเซิร์ฟเวอร์ในไทย",
      link: "/servers/",
    },
    {
      text: "สถิติการใช้งานในไทย",
      link: "/community/stats/",
    },
    {
      text: "หาคอร์ดเพลงไทย",
      link: "https://chord.source.in.th/",
    },
  ],
};

const servers: DefaultTheme.SidebarItem & DefaultTheme.NavItem = {
  text: "MJTH Servers",
  items: [
    {
      text: "เกี่ยวกับ MJTH Servers",
      link: "/about/",
    },
    {
      text: "ระบบบันทึกเสียงย้อนหลัง",
      link: "/clipper/",
    },
    {
      text: "สถิติการใช้งานเซิร์ฟเวอร์ MJTH",
      link: "/stats/",
    },
    {
      text: "ร่วมสนับสนุนค่าใช้จ่าย",
      link: "/support/",
    },
  ],
};

const band: DefaultTheme.SidebarItem & DefaultTheme.NavItem = {
  text: "MJTH Band",
  items: [
    {
      text: "เกี่ยวกับ MJTH Band",
      link: "/band/",
    },
    {
      text: "TikTok",
      link: "https://www.tiktok.com/@musicjammingth",
    },
    {
      text: "Facebook Page",
      link: "https://www.facebook.com/MusicJammingTH",
    },
    {
      text: "YouTube Channel",
      link: "https://www.youtube.com/@MusicJammingTH",
    },
  ],
};

function makeSectionLink(
  target: DefaultTheme.SidebarItem & DefaultTheme.NavItemWithChildren
) {
  return {
    text: target.text,
    link: target.items[0].link,
  };
}

const sidebar: DefaultTheme.SidebarItem[] = [
  { ...guide, collapsed: true },
  { ...services, collapsed: true },
  { ...servers, collapsed: true },
  { ...band, collapsed: true },
];

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
  title: "MJTH.live",
  description: "ห้องซ้อมดนตรีออนไลน์ ผ่านโปรแกรม Jamulus",
  appearance: "force-dark",
  head: [
    ["link", { rel: "icon", href: "/favicon.svg" }],
    [
      "script",
      {
        src: "https://cdn.jsdelivr.net/npm/iconify-icon@2.1.0/dist/iconify-icon.min.js",
        async: "",
        crossorigin: "anonymous",
      },
    ],
  ],
  themeConfig: {
    logo: "/mjth-h.svg",
    siteTitle: false,
    // socialLinks: [
    //   { icon: "facebook", link: "https://www.facebook.com/MusicJammingTH" },
    //   { icon: "youtube", link: "https://www.youtube.com/@MusicJammingTH" },
    //   { icon: "discord", link: "https://discord.gg/tZ8bKmsrcp" },
    //   { icon: "tiktok", link: "https://www.tiktok.com/@musicjammingth" },
    // ],
    nav: [guide, services, servers, band],
    docFooter: {
      // prev: true,
      // next: true,
    },
    sidebar: sidebar,
  },
});
