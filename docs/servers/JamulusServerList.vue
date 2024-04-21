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
            <div v-if="server.listenUrl" class="buttons">
                <a :href="server.listenUrl" target="_blank" rel="noopener noreferrer" class="listen-button">
                    <iconify-icon inline icon="ion:radio" class="me-1"></iconify-icon>
                    ฟังเสียง
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import Musician from './Musician.vue';
import { $list } from './serverList';
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

.buttons {
    display: flex;
}

.listen-button {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    text-decoration: none;
    border: 1px solid var(--vp-c-green-2);
    color: var(--vp-c-green-1);
}
</style>