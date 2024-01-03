<template>
  <table>
    <tr v-if="props.data.startingBalance > 0">
      <td>ยกยอดมาจากปีก่อน</td>
      <td class="num">{{ thb(props.data.startingBalance) }}</td>
    </tr>
    <tr>
      <td>รวมยอดสนับสนุน</td>
      <td class="num">{{ thb(props.data.totalIn) }}</td>
    </tr>
    <tr>
      <td>รวมยอดค่าใช้จ่าย</td>
      <td class="num">{{ thb(-props.data.totalOut) }}</td>
    </tr>
    <tr>
      <td>ยอดคงเหลือ</td>
      <td class="num"><strong>{{ thb(props.data.endingBalance) }}</strong></td>
    </tr>
  </table>

  <div class="grid">
    <div v-for="side of sides" :key="side.key">
      <table style="width: 100%">
        <thead>
          <tr>
            <th colspan="2">{{ side.title }}ปี {{ props.data.year }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="([name, amount]) of side.data" :key="name">
            <td>{{ accountNameMap[name] ?? name }}</td>
            <td class="num">
              {{ thb(amount * side.sign) }}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td><strong>รวม{{ side.name }}</strong></td>
            <td class="num">
              <strong>{{ thb(side.total * side.sign) }}</strong>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue';
import { BalanceTrackingYearlyData } from './BalanceTrackingData';
import { accountNameMap } from './accounts';

const props = defineProps<{
  data: BalanceTrackingYearlyData;
}>();

const sides = computed(() => {
  return ['in', 'out'].map(key => {
    const data: [name: string, amount: number][] = Object.entries(props.data[key]);
    const total = key === 'in' ? props.data.totalIn : props.data.totalOut;
    const sign = key === 'in' ? 1 : -1;
    const name = key === 'in' ? 'ยอดสนับสนุน' : 'ยอดค่าใช้จ่าย';
    const title = key === 'in' ? 'ผู้สนับสนุนค่าใช้จ่าย' : 'ค่าใช้จ่าย';
    return { key, data, total, sign, name, title };
  });
})

function thb(x: number) {
  return x.toLocaleString('th-TH', { style: 'currency', currency: 'THB' }).replace('฿', '');
}
</script>

<style scoped>
.num {
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
  font-family: var(--vp-font-family-mono);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}
</style>