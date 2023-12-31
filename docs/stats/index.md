# สถิติการใช้งานเซิฟเวอร์ MJTH

**หน้านี้แสดงสถิติจากเซิฟเวอร์ MJTH.live เท่านั้น** (โดยมีข้อมูลย้อนหลังถึงปี 2022)
สามารถดูหน้าสถิติที่รวมเซิฟเวอร์อื่นๆ ในไทยด้วยได้ที่หน้า [สถิติการใช้งานในไทย](/community/stats/) (มีข้อมูลย้อนหลังถึงเดือนสิงหาคม 2023)

::: details หมายเหตุ

- หากใช้งาน Jamulus ด้วยชื่อหลายชื่อ ระบบจะนับแยกตามชื่อที่ใช้เข้าเซิฟเวอร์ ไม่นับเป็นผู้ใช้งานคนเดียวกัน
- ระบบจะไม่นับผู้ใช้งานต่อไปนี้:
  - ตั้งค่า Instrument เป็น “Streamer” หรือ “Recorder”
  - ตั้งชื่อว่า “No Name” หรือไม่มีชื่อ หรือชื่อลงท้ายด้วยคำว่า “BRB”, “AFK”
  - ใช้งาน Jamulus เกิน 16 ชั่วโมงภายในวันเดียวกัน จะไม่นับชั่วโมงในวันนั้น

:::

<script setup lang="ts">
  import data from './activeUsers.json'
  import MonthlyTable from '../community/stats/MonthlyTable.vue'
  import YearlySections from '../community/stats/YearlySections.vue'
</script>

## สถิติรายเดือน

<MonthlyTable :data="data" />

## สถิติรายปี

<YearlySections :data="data" />

::: details หมายเหตุ

- รายชื่อนี้แสดงเฉพาะชื่อที่มีชั่วโมงใช้งานอย่างน้อย 16 ชั่วโมง

:::
