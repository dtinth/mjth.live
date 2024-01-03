import DefaultTheme from "vitepress/theme";
import "./custom.css";
// import 'lite-youtube-embed/src/lite-yt-embed.css'
import Layout from "./Layout.vue";

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {},
};
