<template>
  <template v-for="(yearInfo, index) of years" :key="yearInfo.key">
    <details :open="index === 0" class="details custom-block">
      <summary>{{ yearInfo.year }}</summary>
      <div style="overflow-x: auto; overscroll-behavior: auto;">
        <RankingColumn :users="yearInfo.users" />
      </div>
    </details>
  </template>
</template>

<script setup lang="ts">
import RankingColumn from './RankingColumn.vue'
const props = defineProps<{
  data: any
}>()

const years = props.data.byYear.map(({ year, byName }) => {
  const maxHours = byName.reduce((acc, { hoursSeen }) => Math.max(acc, hoursSeen), 0)
  return {
    key: year,
    year,
    users: byName.map(({ name, hoursSeen, servers }) => {
      return {
        name,
        hoursSeen,
        percent: hoursSeen / maxHours * 100,
        servers: servers.map(({ category, hoursSeen }) => ({ category, hoursSeen }))
      }
    }).sort((a, b) => b.hoursSeen - a.hoursSeen)
  }
})
</script>
