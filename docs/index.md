---
layout: home

hero:
  name: MJTH.live
  text: Jamulus Server
  tagline: ห้องซ้อมดนตรีออนไลน์ ผ่านโปรแกรม Jamulus
  # image:
  #   src: /mjth.svg
  #   alt: mjth
  # actions:
  #   - theme: brand
  #     text: ดูรายชื่อเซิฟเวอร์
  #     link: /servers/
  #   - theme: alt
  #     text: เข้ากลุ่ม Discord
  #     link: https://discord.gg/tZ8bKmsrcp
  #   - theme: alt
  #     text: เข้ากลุ่ม Facebook
  #     link: https://www.facebook.com/groups/jamulus.th/
# features:
#   - icon: 🛠️
#     title: รายชื่อเซิฟเวอร์ในไทย
#     details: ดูรายชื่อเซิฟเวอร์ต่างๆ ในไทย ทั้งเซิฟเวอร์ของ MJTH และเซิฟเวอร์ของผู้ดูแลท่านอื่นๆ
#     link: /servers/
#     linkText: ดูรายชื่อเซิฟเวอร์
#   - title: Another cool feature
#     details: Lorem ipsum...<em>eee</em>
#   - title: Another cool feature
#     details: Lorem ipsum...
#   - title: Another cool feature
#     details: Lorem ipsum...
#   - title: Another cool feature
#     details: Lorem ipsum...
#   - title: Another cool feature
#     details: Lorem ipsum...
#   - title: Another cool feature
#     details: Lorem ipsum...
#   - title: Discord
#     details: สนทนากับผู้ใช้งาน Jamulus ในไทย ทางกลุ่ม Thailand Jamulus User Group บน Discord
#     link: https://discord.gg/tZ8bKmsrcp
#     linkText: เข้ากลุ่ม Discord
---

<div class="container-padding">
<div class="vp-doc" style="max-width:1152px;margin:0 auto;">

<br>

</div>
</div>

<script setup lang="ts">
  import { onMounted } from 'vue'
  // Redirect to https://www.musicjammingth.net/ if not localhost (while under construction)
  onMounted(() => {
    if (location.hostname !== 'localhost') {
      location.replace('https://www.musicjammingth.net/')
    }
  })
</script>
