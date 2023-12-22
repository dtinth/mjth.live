<script setup>
import DefaultTheme from 'vitepress/theme'
import { onMounted } from 'vue'
const { Layout } = DefaultTheme

onMounted(() => {
  import('lite-youtube-embed')
})
</script>

<template>
  <Layout>
  </Layout>
</template>
