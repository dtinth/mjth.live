<template>
  <div style="overflow-x: auto; overscroll-behavior: auto; display: flex; gap: 1rem">
    <div style="flex: 0 0 300px; background: var(--vp-c-bg-soft); padding: 1rem; border-radius: 1rem;"
      v-for="month of months" :key="month.key">
      <strong>{{ month.name }} {{ month.year }}</strong>
      <ol style="padding-left: 1.4em;">
        <li v-for="user of month.users" style="padding-left: 0.2em;">
          <span style="display: flex">
            <strong style="flex: 1">{{ user.name }}</strong>
            <span style="flex: none; opacity: 0.64;">{{ user.hoursSeen.toFixed(1) }}h</span>
          </span>
          <div style="height: 5px; overflow: hidden; background: #fff3; border-radius: 5px; display: flex;"
            :style="{ width: user.percent.toFixed(1) + '%' }">
            <div v-for="server of user.servers" :style="{ flex: server.hoursSeen }" :data-category="server.category"
              class="server-bar"></div>
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: any
}>()

const months = props.data.byYearMonth.map(({ year, month, byName }) => {
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

<style scoped>
.server-bar {
  background: var(--vp-c-yellow-3);
}

.server-bar[data-category="mjth"] {
  background: var(--vp-c-indigo-3);
}

.server-bar[data-category="jamulusth"] {
  background: var(--vp-c-green-3);
}

.server-bar[data-category="dharma"] {
  background: var(--vp-c-red-3);
}</style>
