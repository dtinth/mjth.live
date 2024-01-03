<template>
  <div class="musician" :data-skill="musician.skill">
    <img :src="musician.imageUrl" :alt="musician.instrument" :title="musician.instrument" v-if="musician.imageUrl" />
    <span>{{ musician.name }}</span>
  </div>
</template>

<script setup lang="ts">
import { Musician } from './serverList';

defineProps<{ musician: Musician }>()
</script>

<style scoped>
.musician {
  display: flex;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  align-items: center;
  border: 2px solid var(--client-item-border);
  --client-item-border: hsla(195, 100%, 84%, 24%);
  color: hsl(195, 64%, 84%);
  border-radius: 3px;
  font-weight: 500;
}

img {
  margin-right: 0.25rem;
}

.musician[data-skill="Beginner"] {
  --musician-border: hsla(120, 100%, 84%, 24%);
  color: hsl(120, 64%, 84%);
}

.musician[data-skill="Intermediate"] {
  --musician-border: hsla(60, 100%, 84%, 24%);
  color: hsl(60, 64%, 84%);
}

.musician[data-skill="Expert"] {
  --musician-border: hsla(0, 100%, 84%, 24%);
  color: hsl(0, 64%, 84%);
}
</style>