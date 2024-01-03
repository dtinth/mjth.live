<template>
    <div class="grid">
        <div v-for="(server, index) of list" :key="index" class="grid-item">
            <div>
                <h2>{{ server.name }}</h2>
                <p class="server-genre">{{ server.genre }}</p>
            </div>
            <div class="server-musicians" v-if="server.musicians.length > 0">
                <Musician v-for="(musician, index) of server.musicians" :key="index" :musician="musician" />
            </div>
            <div v-else>
                <p class="empty-servers"><em>ไม่มีคนในเซิฟเวอร์ขณะนี้</em></p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { $list } from './serverList'
import Musician from './Musician.vue'
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue'
const list = useStore($list)
</script>

<style scoped>
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 1rem;
}

.grid-item {
    padding: 1rem;
    border-radius: 1rem;
    background-color: var(--vp-c-bg-soft);
    display: flex;
    gap: 1rem;
    flex-direction: column;
    border: 1px solid var(--vp-c-bg-soft);
}

h2 {
    font-size: 1.25em;
    font-weight: 600;
}

.server-genre {
    font-weight: 300;
}

.server-musicians {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
}

.empty-servers {
    opacity: 0.64;
}
</style>