# สนับสนุน

[MJTH.live](/about/) คือเซิร์ฟเวอร์ [Jamulus](/jamulus/) ที่เปิดให้ทุกคนเล่นดนตรีร่วมกันแบบออนไลน์ได้ฟรี

เซิร์ฟเวอร์ของ MJTH อาศัยการสนับสนุนจากชุมชนในการแบ่งเบาภาระ[ค่าใช้จ่าย](#สรุปรายรับรายจ่ายรายปี)ในการเช่าเซิฟเวอร์และดูแลรักษาระบบ ซึ่งอยู่ที่ประมาณ 60 บาทต่อวัน (หรือราว 1,800 บาทต่อเดือน)

## สถานะปัจจุบัน

<div class="current-status">
  <div class="status-item">
    <div class="status-label">เงินคงเหลือปัจจุบัน</div>
    <div class="status-value">฿{{ currentBalance?.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '…' }}</div> 
  </div>
  <div class="status-item">
    <div class="status-label">ค่าใช้จ่ายต่อวัน</div>
    <div class="status-value">฿{{ data.currentStatus.runningCostPerDay }}</div>
  </div>
  <div class="status-item">
    <div class="status-label">คงเหลือถึง</div>
    <div class="status-value">{{ formatThaiDate(data.currentStatus.depletionDate) }}</div>
  </div>
  <div class="status-item">
    <div class="status-label">เหลืออีก</div>
    <div class="status-value">{{ daysLeft || '…' }} วัน</div>
  </div>
</div>

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
  import { ref, onMounted } from 'vue'

  const totals = {}

  for (const [year, { in: list }] of Object.entries(data.byYear)) {
    for (const [name, amount] of Object.entries(list)) {
      totals[name] = (totals[name] ?? 0) + amount
    }
  }

  function thb(x: number) {
    return x.toLocaleString('th-TH', { style: 'currency', currency: 'THB' }).replace('฿', '');
  }

  function formatThaiDate(dateString: string) {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const list = Object.entries(totals)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .sort((a, b) => b[1] - a[1])
    .filter(a => shouldCountAsSupporter(a[0]))
    .map(([name, amount]) => ({ name, amount: thb(amount), rawAmount: amount }))

  const daysLeft = ref<number | null>(null)
  const currentBalance = ref<number | null>(null)

  function calculateCurrentBalance() {
    const lastUpdated = new Date(data.lastUpdated)
    const now = new Date()
    const hoursSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60)
    const dailyCost = data.currentStatus.runningCostPerDay
    const costSinceUpdate = (hoursSinceUpdate / 24) * dailyCost
    currentBalance.value = Math.max(0, data.currentStatus.remainingBalance - costSinceUpdate)
  }

  function calculateDaysLeft() {
    const depletionDate = new Date(data.currentStatus.depletionDate)
    const today = new Date()
    const diffTime = depletionDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    daysLeft.value = diffDays
  }

  onMounted(() => {
    calculateCurrentBalance()
    calculateDaysLeft()
    
    // Update every 5 seconds
    setInterval(() => {
      calculateCurrentBalance()
      calculateDaysLeft()
    }, 1000)
  })
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

<style scoped>
  .current-status {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 1rem;
    margin: 2rem 0;
    padding: 1rem;
    background: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-border);
    border-radius: 8px;
    font-variant-numeric: tabular-nums;
  }

  .status-item {
    text-align: center;
  }

  .status-label {
    font-size: 0.9em;
    color: var(--vp-c-text-2);
    margin-bottom: 0.25rem;
    font-weight: 500;
  }

  .status-value {
    font-size: 1.2em;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }

  @media (max-width: 640px) {
    .current-status {
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  }
</style>
