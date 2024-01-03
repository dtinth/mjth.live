---
layout: page
---

<script setup>
import JamulusServerList from './JamulusServerList.vue'
import { onMounted } from 'vue'

onMounted(() => {
  if (location.hostname !== 'localhost') {
    location.replace('https://jamulus.musicjammingth.net/')
  }
})
</script>

<div class="container-padding">
<div style="max-width: 1152px; margin: 2em auto;">

<div class="vp-doc">

# Jamulus Servers in Thailand

รายชื่อเซิฟเวอร์ Jamulus ในประเทศไทย

</div>

<JamulusServerList />

</div>
</div>
