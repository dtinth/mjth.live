<template>
  <div style="overflow-x: auto; overscroll-behavior: auto; display: flex; gap: 1rem">
    <template v-for="month of months" :key="month.key">
      <div style="flex: 0 0 256px; background: var(--vp-c-bg-soft); padding: 1rem; border-radius: 1rem;">
        <RankingColumn :title="`${month.name} ${month.year}`" :users="month.users" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import RankingColumn from './RankingColumn.vue'
const props = defineProps<{
  data: any
}>()

const months = props.data.byYearMonth.slice(1).map(({ year, month, byName }) => {
  const name = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'][+month - 1]
  const maxHours = byName.reduce((acc, { hoursSeen }) => Math.max(acc, hoursSeen), 0)
  return {
    key: year + '.' + month,
    year,
    month,
    name,
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
