<script setup>
  import data from './data.json'
  import BalanceTable from './BalanceTable.vue'
</script>

# สรุปรายรับรายจ่ายรายปี

หน้านี้แสดงรายละเอียดค่าใช้จ่ายต่างๆ ที่เกี่ยวข้องกับการดำเนินงานของเซิร์ฟเวอร์ MJTH.live รวมถึงแหล่งที่มาของเงินที่ใช้ในการชำระค่าใช้จ่ายเหล่านั้น

## ปี 2025 <Badge type="info" :text="'อัพเดทล่าสุดเมื่อ ' + data.lastUpdated" />

::: info 2025

<BalanceTable :data="data.byYear.year2025" />

:::

## ปีก่อนๆ

::: details 2024

<BalanceTable :data="data.byYear.year2024" />

:::

::: details 2023

<BalanceTable :data="data.byYear.year2023" />

:::

::: details 2022

<BalanceTable :data="data.byYear.year2022" />

:::

::: details 2021

<BalanceTable :data="data.byYear.year2021" />

:::
