<template>
  <strong v-if="props.title">{{ props.title }}</strong>
  <ol :style="{ paddingLeft: props.users.length >= 100 ? '2.5em' : '1.8em' }" :start="props.start || 1">
    <li v-for="user of props.users" style="padding-left: 0.2em;">
      <span style="display: flex">
        <strong style="flex: 1; white-space: nowrap;">{{ user.name }}</strong>
        <span style="flex: none; opacity: 0.64;">{{ user.hoursSeen.toFixed(1) }}h</span>
      </span>
      <div style="height: 5px; overflow: hidden; background: #fff3; border-radius: 5px; display: flex;"
        :style="{ width: user.percent.toFixed(1) + '%' }">
        <div v-for="server of user.servers" :style="{ flex: server.hoursSeen }" :data-category="server.category"
          class="server-bar"></div>
      </div>
    </li>
  </ol>
</template>

<script setup lang="ts">
const props = defineProps<{
  title?: string
  users: UserRow[]
  start?: number
}>()

export interface UserRow {
  name: string
  hoursSeen: number
  percent: number
  servers: ServerStat[]
}

export interface ServerStat {
  category: string
  hoursSeen: number
}
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
}
</style>
