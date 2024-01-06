# สถิติการใช้งาน Jamulus ในประเทศไทย

**หน้านี้แสดงสถิติการใช้งานจากเซิฟเวอร์ Jamulus ต่างๆ ในไทย** มีข้อมูลย้อนหลังถึงเดือนสิงหาคม 2023

::: details หมายเหตุ

- หากใช้งาน Jamulus ด้วยชื่อหลายชื่อ ระบบจะนับแยกตามชื่อที่ใช้เข้าเซิฟเวอร์ ไม่นับเป็นผู้ใช้งานคนเดียวกัน
- ระบบจะไม่นับผู้ใช้งานต่อไปนี้:
  - ตั้งค่า Instrument เป็น “Streamer” หรือ “Recorder”
  - ตั้งชื่อว่า “No Name” หรือไม่มีชื่อ หรือชื่อลงท้ายด้วยคำว่า “BRB”, “AFK”
  - ใช้งาน Jamulus เกิน 16 ชั่วโมงในวันเดียวกัน
- สีที่แสดงใต้ชื่อ แทนเวลาที่ใช้ในเซิฟเวอร์ต่างๆ
  - <span class="color-block" style="background: var(--vp-c-indigo-3)"></span> เซิฟเวอร์ของ MJTH.live
  - <span class="color-block" style="background: var(--vp-c-green-3)"></span> เซิฟเวอร์ของ JamulusTH.com
  - <span class="color-block" style="background: var(--vp-c-red-3)"></span> เซิฟเวอร์ของ Dharma Room
  - <span class="color-block" style="background: var(--vp-c-yellow-3)"></span> เซิฟเวอร์อื่นๆ

:::

## สถิติรายเดือน

<MonthlyTable :data="data" />

## สถิติรายปี

<YearlySections :data="data" />

<script setup lang="ts">
  import data from './activeUsers.json'
  import MonthlyTable from './MonthlyTable.vue'
  import YearlySections from './YearlySections.vue'
</script>

<style scoped>
.color-block {
  display: inline-block;
  width: 1em;
  height: 1em;
  border-radius: 0.25em;
  margin-right: 0.1em;
  background: #ccc;
  vertical-align: middle;
  transform: translateY(-0.1ex);
}
</style>
