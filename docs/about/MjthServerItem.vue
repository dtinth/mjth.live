<template>
  <span v-if="loading" style="opacity: 0.33">กำลังโหลด...</span>
  <span v-else style="display: flex; gap: 0.25em; align-items: center;" class="tooltip-container" tabindex="0">
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
    <div class="tooltip">
      <div v-if="filteredClients.length > 0" class="client-list">
        <div v-for="client in filteredClients" :key="client.name" class="client-item">
          {{ client.name }}
        </div>
      </div>
      <div v-else class="no-clients">ไม่มีผู้ใช้เชื่อมต่อ</div>
    </div>
  </span>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
const loading = ref(true);
const userCount = ref(0);
const barWidthPercent = ref(50);
const barItems = ref<{ hue: number; grow: number }[]>([
  { hue: 120, grow: 1 },
  { hue: 60, grow: 2 },
  { hue: 0, grow: 1 },
]);
const allClients = ref<{name: string, city: string, country: number, skillLevel: number, instrument: number}[]>([]);
const props = defineProps<{
  address: string;
}>();

const filteredClients = computed(() => {
  return allClients.value.filter(client => {
    // Skip streamers
    if (client.instrument === 24) return false;
    // Skip recorders
    if (client.instrument === 23) return false;
    return true;
  });
});

let eventSource: EventSource | null = null;

onMounted(() => {
  eventSource = new EventSource(`${props.address}events`);
  let clients: {name: string, city: string, country: number, skillLevel: number, instrument: number}[] | undefined
  let levels: number[] | undefined
  eventSource.addEventListener('message', (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    if (data.clients) {
      clients = data.clients;
      allClients.value = clients;
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

<style scoped>
.tooltip-container {
  position: relative;
  cursor: pointer;
}

.tooltip-container:hover .tooltip,
.tooltip-container:focus .tooltip {
  visibility: visible;
  opacity: 1;
}

.tooltip {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.9em;
  transition: opacity 0.2s;
  white-space: nowrap;
  z-index: 1;
  max-height: 300px;
  overflow-y: auto;
  white-space: normal;
  width: max-content;
  max-width: 200px;
}


.client-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.client-item {
  text-align: left;
}

.no-clients {
  font-style: italic;
  opacity: 0.8;
}
</style>