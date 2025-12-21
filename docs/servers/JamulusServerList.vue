<template>
    <div class="grid">
        <div v-for="(server, index) of list" :key="index" class="grid-item">
            <div>
                <h2>
                    <template v-if="isMjth(server)">
                        <img :src="mjthIcon" width="20" height="16" style="display: inline-block" />
                        <span v-html="' '"></span>
                    </template>
                    {{ server.name }}
                </h2>
                <p class="server-genre">{{ server.genre }}</p>
            </div>
            <div class="server-musicians" v-if="server.musicians.length > 0">
                <Musician v-for="(musician, index) of server.musicians" :key="index" :musician="musician" />
            </div>
            <div v-else>
                <p class="empty-servers"><em>ไม่มีคนในเซิร์ฟเวอร์ขณะนี้</em></p>
            </div>
            <div class="buttons">
                <a :href="server.listenUrl" target="_blank" rel="noopener noreferrer" class="btn btn-green"
                    v-if="server.listenUrl">
                    <iconify-icon inline icon="ion:radio" class="me-1"></iconify-icon>
                    ฟังเสียง
                </a>
                <a :href="`javascript:void navigator.clipboard.writeText(${JSON.stringify(server.addressWithPort)})`"
                    class="btn btn-gray" @click.prevent="copyToClipboard(server.addressWithPort)"
                    :title="`Copy server address (${server.addressWithPort})`">
                    <span style="width: 1rem; display: inline-block; text-align: center">
                        <iconify-icon inline icon="ion:copy-outline"
                            v-if="copied !== server.addressWithPort"></iconify-icon>
                        <iconify-icon inline icon="ion:checkmark-circle-outline" v-else></iconify-icon>
                    </span>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { ref } from 'vue';
import mjthIcon from '../public/mjth-ico.svg?url';
import Musician from './Musician.vue';
import { $list, Server } from './serverList';
const list = useStore($list)
const copied = ref('')

async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    copied.value = text;
    setTimeout(() => {
        copied.value = '';
    }, 1000);
}

function isMjth(server: Server) {
    return server.listenUrl?.includes('.mjth.live')
}
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
    gap: 0.5rem;
    flex-wrap: wrap;
}

.btn {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    text-decoration: none;
    border: 1px solid var(--btn-border-color);
    color: var(--btn-text-color);
}

.btn-green {
    --btn-border-color: var(--vp-c-green-2);
    --btn-text-color: var(--vp-c-green-1);
}

.btn-gray {
    --btn-border-color: rgba(255, 255, 255, 0.36);
    --btn-text-color: rgba(255, 255, 255, 0.5);
}
</style>