<template>
    <div>
        <div v-for="(server, index) of list" :key="index">
            <h2>{{ server.name }}</h2>
            <p>{{ server.genre }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { $list } from './serverList'
const list = useStore($list)
</script>