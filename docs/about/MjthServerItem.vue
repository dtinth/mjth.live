<template>
  <span v-if="loading" style="opacity: 0.33">กำลังโหลด...</span>
  <span v-else style="display: flex; gap: 0.25em; align-items: center;">
    <span style="display: flex; height: 1em; width: 7em; border: 1px solid var(--vp-c-gray-2)">
      <span style="display: flex;" :style="{ width: barWidthPercent + '%' }">
        <span
          v-for="item of barItems"
          :key="item.hue"
          :style="{
            flexGrow: item.grow,
            flexBasis: '0',
            backgroundColor: `hsl(${item.hue}, 80%, 80%)`,
          }"
        ></span>
      </span>
    </span>
    <span style="margin-left: auto; flex-basis: 3ch">{{ userCount }}</span>
  </span>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
const loading = ref(true);
const userCount = ref(0);
const barWidthPercent = ref(50);
const barItems = ref<{ hue: number; grow: number }[]>([
  { hue: 120, grow: 1 },
  { hue: 60, grow: 2 },
  { hue: 0, grow: 1 },
]);
const props = defineProps<{
  address: string;
}>();

let eventSource: EventSource | null = null;

onMounted(() => {
  eventSource = new EventSource(`${props.address}events`);
  let clients: {name: string, city: string, country: number, skillLevel: number, instrument: number}[] | undefined
  let levels: number[] | undefined
  eventSource.addEventListener('message', (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    if (data.clients) {
      clients = data.clients;
    }
    if (data.levels) {
      levels = data.levels;
    }
    if (clients && levels) {
      let clientCount = 0;
      let totalLevel = 0;
      let levelByInstrument = new Map<number, number>();
      for (const [i, client] of clients.entries()) {
        // Skip streamers
        if (client.instrument === 24) continue;
        // Skip recorders
        if (client.instrument === 23) continue;
        clientCount++;
        const level = levels[i];
        totalLevel += level / 8;
        levelByInstrument.set(
          client.instrument,
          (levelByInstrument.get(client.instrument) || 0) + level
        );
      }
      userCount.value = clientCount;
      loading.value = false;
      barWidthPercent.value = Math.round((1 - Math.exp(-totalLevel)) * 100);
      barItems.value = Array.from(levelByInstrument.entries()).map(
        ([instrument, level]) => ({
          hue: (instrument / 48 * 360) % 360,
          grow: level,
        })
      );
    }
  });
});
onUnmounted(() => {
  if (eventSource) {
    eventSource.close();
  }
});
</script>