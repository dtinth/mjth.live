# สนับสนุน

[MJTH.live](/about/) คือเซิร์ฟเวอร์ [Jamulus](/jamulus/) ที่เปิดให้ทุกคนเล่นดนตรีร่วมกันแบบออนไลน์ได้ฟรี
หน้าเว็บนี้แสดงรายชื่อผู้สนับสนุน และช่องทางการสนับสนุน

## รายชื่อผู้สนับสนุน

ขอบคุณผู้สนับสนุนทุกท่านที่มีส่วนร่วมในการแบ่งเบาภาระ[ค่าใช้จ่ายด้านการโฮสต์เซิร์ฟเวอร์](/financials/) ทำให้ชุมชนดนตรีออนไลน์แห่งนี้สามารถเติบโตและมอบเสียงเพลงให้กับทุกคนได้อย่างต่อเนื่อง:

<ul>
  <li v-for="item in list">
    <span>{{ item.name }}</span>
  </li>
</ul>

## ร่วมสนับสนุน

หากสนใจร่วมสนับสนุน สามารถโอนเงินเข้าบัญชีธนาคารได้ตามรายละเอียดด้านล่างนี้

เมื่อทำการสนับสนุนแล้ว กรุณาแจ้งชื่อ และจำนวนเงินที่โอนมา [ทางเพจ Facebook](https://m.me/musicjammingth) หรือทางอีเมล [dtinth@mjth.live](mailto:dtinth@mjth.live) เพื่ออัพเดตรายชื่อผู้สนับสนุนบนเว็บไซต์

::: details PromptPay / QR code

<img src="https://im.dt.in.th/ipfs/bafybeig3d2ghk3rc3mpzw3ccbmfyhol6gyxgkseuc456ondu4sudoskmlm/image.webp" width="256" height="256"> \
Ref. 004999071283963 \
Mr. Thai Pangsakulyanont \
K Plus Wallet

:::

::: details โอนเข้าบัญชี

KBANK 106-3-68911-0 \
Thai Pangsakulyanont

:::

<script setup lang="ts">
  import data from './../financials/data.json'
  import {shouldCountAsSupporter} from './../financials/accounts'

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
    .map(([name, amount]) => ({ name, amount: thb(amount) }))
</script>
