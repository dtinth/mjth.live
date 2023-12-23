import { defineConfig } from 'vitepress'

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
  title: 'MJTH.live',
  appearance: 'force-dark',
  themeConfig: {
    logo: '/mjth-h.svg',
    siteTitle: false,
    socialLinks: [
      { icon: 'facebook', link: 'https://www.facebook.com/MusicJammingTH' },
      { icon: 'youtube', link: 'https://www.youtube.com/@MusicJammingTH' },
      { icon: 'discord', link: 'https://discord.gg/tZ8bKmsrcp' },
    ],
    nav: [
      { text: 'Server List', link: '/servers/' },
      {
        text: 'Community',
        items: [
          {
            text: 'Thailand Jamulus User Group',
            items: [
              { text: 'Discord Community', link: 'https://discord.gg/tZ8bKmsrcp' },
              { text: 'Facebook Group', link: 'https://www.facebook.com/groups/jamulus.th/' },
            ]
          },
          {
            text: 'JamulusTH',
            items: [
              { text: 'JamulusTH.com', link: 'https://jamulusth.com/' },
            ]
          },
        ]
      }
    ]
  }
})
