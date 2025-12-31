# สถิติการใช้งาน Jamulus ในประเทศไทย

**หน้านี้แสดงสถิติการใช้งานจากเซิร์ฟเวอร์ Jamulus ต่างๆ ในไทย** มีข้อมูลย้อนหลังถึงเดือนสิงหาคม 2023

::: details หมายเหตุ

- หากใช้งาน Jamulus ด้วยชื่อหลายชื่อ ระบบจะนับแยกตามชื่อที่ใช้เข้าเซิร์ฟเวอร์ ไม่นับเป็นผู้ใช้งานคนเดียวกัน
- ระบบจะไม่นับผู้ใช้งานต่อไปนี้:
  - ตั้งค่า Instrument เป็น “Streamer” หรือ “Recorder”
  - ตั้งชื่อว่า “No Name” หรือไม่มีชื่อ หรือชื่อลงท้ายด้วยคำว่า “BRB”, “AFK”
  - ใช้งาน Jamulus เกิน 16 ชั่วโมงภายในวันเดียวกัน จะไม่นับชั่วโมงในวันนั้น
- สีที่แสดงใต้ชื่อ แทนเวลาที่ใช้ในเซิร์ฟเวอร์ต่างๆ
  - <span class="color-block" style="background: var(--server-mjth)"></span> [เซิร์ฟเวอร์ของ MJTH](/about/)
  - <span class="color-block" style="background: var(--server-jamulusth)"></span> เซิร์ฟเวอร์ของ JamulusTH.com
  - <span class="color-block" style="background: var(--server-dharma)"></span> เซิร์ฟเวอร์ของ Dharma Room
  - <span class="color-block" style="background: var(--server-openjam)"></span> เซิร์ฟเวอร์ของ OpenJam.TH
  - <span class="color-block" style="background: var(--server-thomas)"></span> เซิร์ฟเวอร์ Thomas playground
  - <span class="color-block" style="background: var(--server-unknown)"></span> เซิร์ฟเวอร์อื่นๆ

:::

<script setup lang="ts">
  import data from './activeUsers.json'
  import MonthlyTable from './MonthlyTable.vue'
  import YearlySections from './YearlySections.vue'
</script>

## สถิติรายเดือน

<MonthlyTable :data="data" />

## สถิติรายปี

<YearlySections :data="data" />

::: details หมายเหตุ

- ปี 2023 มีข้อมูลแค่เดือนสิงหาคมเป็นต้นไปเท่านั้น
- รายชื่อนี้แสดงเฉพาะชื่อที่มีชั่วโมงใช้งานอย่างน้อย 16 ชั่วโมง

:::

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
