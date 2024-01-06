# สถิติการใช้งานเซิฟเวอร์ MJTH

**หน้านี้แสดงสถิติจากเซิฟเวอร์ MJTH.live เท่านั้น** (ซึ่งมีข้อมูลย้อนหลังถึงปี 2022) ไม่รวมเซิฟเวอร์อื่นๆ ในประเทศไทย (ซึ่งมีข้อมูลย้อนหลังถึงแค่เดือนสิงหาคม 2023)
สามารถดูหน้าสถิติที่รวมเซิฟเวอร์อื่นๆ ในไทยด้วยได้ที่หน้า [สถิติการใช้งานในไทย](/community/stats/)

::: details หมายเหตุ

- หากใช้งาน Jamulus ด้วยชื่อหลายชื่อ ระบบจะนับแยกตามชื่อที่ใช้เข้าเซิฟเวอร์ ไม่นับเป็นผู้ใช้งานคนเดียวกัน
- ระบบจะไม่นับผู้ใช้งานต่อไปนี้:
  - ตั้งค่า Instrument เป็น “Streamer” หรือ “Recorder”
  - ตั้งชื่อว่า “No Name” หรือไม่มีชื่อ หรือชื่อลงท้ายด้วยคำว่า “BRB”, “AFK”
  - ใช้งาน Jamulus เกิน 16 ชั่วโมงในวันเดียวกัน

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
