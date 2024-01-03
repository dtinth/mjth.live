<script setup>
import DefaultTheme from 'vitepress/theme'
import { onMounted } from 'vue'
const { Layout } = DefaultTheme

onMounted(() => {
  import('@justinribeiro/lite-youtube')
})
</script>

<template>
  <Layout>
  </Layout>
</template>
