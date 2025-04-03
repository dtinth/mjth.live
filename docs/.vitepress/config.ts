import { defineConfig } from "vitepress";

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
    socialLinks: [
      { icon: "facebook", link: "https://www.facebook.com/MusicJammingTH" },
      { icon: "youtube", link: "https://www.youtube.com/@MusicJammingTH" },
      { icon: "discord", link: "https://discord.gg/tZ8bKmsrcp" },
    ],
    // nav: [{ text: "รายชื่อเซิฟเวอร์ในไทย", link: "/servers/" }],
    docFooter: {
      prev: false,
      next: false,
    },
    sidebar: [
      {
        text: "Jamulus",
        items: [
          {
            text: "Jamulus คืออะไร",
            link: "/jamulus/",
          },
        ],
      },
      {
        text: "Community",
        items: [
          // {
          //   text: "กลุ่มผู้ใช้งาน Jamulus ในไทย",
          //   link: "/community/",
          // },
          {
            text: "รายชื่อเซิฟเวอร์ในไทย",
            link: "/servers/",
          },
          {
            text: "สถิติการใช้งานในไทย",
            link: "/community/stats/",
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
      },
      {
        text: "MJTH",
        items: [
          {
            text: "เกี่ยวกับ MJTH.live",
            link: "/about/",
          },
          {
            text: "ฟังเสียง",
            link: "https://lobby.mjth.live/",
          },
          {
            text: "ระบบบันทึกเสียงย้อนหลัง",
            link: "/clipper/",
          },
          {
            text: "สถิติการใช้งาน",
            link: "/stats/",
          },
          {
            text: "สรุปรายรับรายจ่าย",
            link: "/financials/",
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
      },
    ],
  },
});
