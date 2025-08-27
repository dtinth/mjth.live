# สนับสนุน

[MJTH.live](/about/) คือเซิร์ฟเวอร์ [Jamulus](/jamulus/) ที่เปิดให้ทุกคนเล่นดนตรีร่วมกันแบบออนไลน์ได้ฟรี

เซิร์ฟเวอร์ของ MJTH อาศัยการสนับสนุนจากชุมชนในการแบ่งเบาภาระ[ค่าใช้จ่าย](#สรุปรายรับรายจ่ายรายปี)ในการเช่าเซิฟเวอร์และดูแลรักษาระบบ ซึ่งอยู่ที่ประมาณ 60 บาทต่อวัน (หรือราว 1,800 บาทต่อเดือน)

<p>
  <VPButton size="big" tag="a" href="https://forms.gle/ue7EB2Hp9pAgXHEx6" target="_blank" rel="noopener noreferrer" text="คลิกที่นี่เพื่อร่วมสนับสนุน" style="text-decoration:none"></VPButton>
</p>

## รายชื่อผู้สนับสนุน

ขอบคุณผู้สนับสนุนทุกท่านที่มีส่วนร่วมในการแบ่งเบาภาระ[ค่าใช้จ่ายด้านการโฮสต์เซิร์ฟเวอร์](#สรุปรายรับรายจ่ายรายปี) ทำให้ชุมชนดนตรีออนไลน์แห่งนี้สามารถเติบโตและมอบเสียงเพลงให้กับทุกคนได้อย่างต่อเนื่อง:

<ul class="supporter-list">
  <template v-for="(item, index) in list" :key="index">
    <li 
      class="supporter-name tooltip-container" 
      tabindex="0"
    >
      {{ item.name }}<span class="tooltip" v-if="item.rawAmount > 0">฿{{ item.amount }}</span>
    </li>
  </template>
</ul>

<p>
  <VPButton size="big" theme="alt" tag="a" href="https://forms.gle/ue7EB2Hp9pAgXHEx6" target="_blank" rel="noopener noreferrer" text="คลิกที่นี่เพื่อร่วมสนับสนุน" style="text-decoration:none"></VPButton>
</p>

## สรุปรายรับรายจ่ายรายปี

### ปี 2025 <Badge type="info" :text="'อัพเดทล่าสุดเมื่อ ' + data.lastUpdated" />

::: info 2025

<BalanceTable :data="data.byYear.year2025" />

:::

### ปีก่อนๆ

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

<script setup lang="ts">
  import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue'
  import data from './../financials/data.json'
  import {shouldCountAsSupporter} from './../financials/accounts'
  import BalanceTable from '../financials/BalanceTable.vue'

  const totals = {}

  for (const [year, { in: list }] of Object.entries(data.byYear)) {
    for (const [name, amount] of Object.entries(list)) {
      totals[name] = (totals[name] ?? 0) + amount
    }
  }

  function thb(x: number) {
    return x.toLocaleString('th-TH', { style: 'currency', currency: 'THB' }).replace('฿', '');
  }

  const list = Object.entries(totals)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .sort((a, b) => b[1] - a[1])
    .filter(a => shouldCountAsSupporter(a[0]))
    .map(([name, amount]) => ({ name, amount: thb(amount), rawAmount: amount }))
</script>

<style scoped>
  .supporter-list {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    padding: 0;
    list-style: none;
    align-items: center;
  }
  .supporter-name {
    position: relative;
    cursor: pointer;
    display: block;
    background: var(--vp-c-gray-soft);
    border: 1px solid var(--vp-c-gray-2);
    padding: 4px 8px;
    border-radius: 4px;
  }
  li.supporter-name {
    margin: 0;
  }
  .tooltip-container:hover .tooltip,
  .tooltip-container:focus .tooltip {
    visibility: visible;
    opacity: 1;
  }
  .tooltip {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9em;
    transition: opacity 0.2s;
    white-space: nowrap;
    z-index: 1;
  }
  .tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.9) transparent transparent transparent;
  }
</style>
