<template>
  <div class="readiness-check">
    <!-- Question 1: OS -->
    <div class="question-section">
      <div class="question-group">
        <h3>{{ q1.label }}</h3>
        <div class="options">
          <button
            v-for="option in q1.options"
            :key="option"
            :class="{ selected: answers.os === option }"
            @click="answers.os = option"
          >
            {{ option }}
          </button>
        </div>
      </div>
      <div v-if="getGuidanceBySection('os')" class="guidance-inline" :class="`guidance-${getGuidanceBySection('os').level}`">
        <div class="guidance-content">
          <p v-html="getGuidanceBySection('os').html"></p>
        </div>
      </div>
      <div v-else class="guidance-inline">
        <div class="guidance-content">
          <p v-if="answers.os === 'Windows'">
            ดาวน์โหลด Jamulus สำหรับ Windows ได้ที่:<br />
            <a href="https://jamulus.io/wiki/Installation-for-Windows" target="_blank">https://jamulus.io/wiki/Installation-for-Windows</a>
          </p>
          <p v-else>
            ดาวน์โหลด Jamulus สำหรับ macOS ได้ที่:<br />
            <a href="https://jamulus.io/wiki/Installation-for-Macintosh" target="_blank">https://jamulus.io/wiki/Installation-for-Macintosh</a>
          </p>
        </div>
      </div>
    </div>

    <!-- Question 2: Audio Interface (Always shown) -->
    <div class="question-section">
      <div class="question-group">
        <h3>{{ q2.label }}</h3>
        <div class="options">
          <button
            v-for="option in q2.options"
            :key="option"
            :class="{ selected: answers.audioInterface === option }"
            @click="answers.audioInterface = option"
          >
            {{ option }}
          </button>
        </div>
      </div>
      <div v-if="getGuidanceBySection('audioInterface')" class="guidance-inline" :class="`guidance-${getGuidanceBySection('audioInterface').level}`">
        <div class="guidance-content">
          <p v-html="getGuidanceBySection('audioInterface').html"></p>
        </div>
      </div>
    </div>

    <!-- Question 3: Internet Connection -->
    <div class="question-section">
      <div class="question-group">
        <h3>{{ q3.label }}</h3>
        <div class="options">
          <button
            v-for="option in q3.options"
            :key="option"
            :class="{ selected: answers.internet === option }"
            @click="answers.internet = option"
          >
            {{ option }}
          </button>
        </div>
      </div>
      <div v-if="getGuidanceBySection('internet')" class="guidance-inline" :class="`guidance-${getGuidanceBySection('internet').level}`">
        <div class="guidance-content">
          <p v-html="getGuidanceBySection('internet').html"></p>
        </div>
      </div>
    </div>

    <!-- Question 4: Audio Output -->
    <div class="question-section">
      <div class="question-group">
        <h3>{{ q4.label }}</h3>
        <div class="options">
          <button
            v-for="option in q4.options"
            :key="option"
            :class="{ selected: answers.audioOutput === option }"
            @click="answers.audioOutput = option"
          >
            {{ option }}
          </button>
        </div>
      </div>
      <div v-if="getGuidanceBySection('audioOutput')" class="guidance-inline" :class="`guidance-${getGuidanceBySection('audioOutput').level}`">
        <div class="guidance-content">
          <p v-html="getGuidanceBySection('audioOutput').html"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'

type GuidanceLevel = 'placeholder' | 'success' | 'warning' | 'danger'
type GuidanceSection = 'os' | 'audioInterface' | 'internet' | 'audioOutput'

interface GuidanceItem {
  level: GuidanceLevel
  html: string
  section: GuidanceSection
}

const answers = reactive({
  os: '',
  audioInterface: '',
  internet: '',
  audioOutput: '',
})

const q1 = {
  label: 'ระบบปฏิบัติการ (OS) - คอมพิวเตอร์ของคุณใช้อะไร?',
  options: ['Windows', 'macOS'],
}

const q2 = {
  label: 'Audio Interface - คุณมีซาวด์การ์ดแยกหรือไม่?',
  options: ['มี', 'ไม่มี'],
}

const q3 = {
  label: 'การเชื่อมต่ออินเทอร์เน็ต',
  options: ['Wi-Fi', 'LAN', '4G / 5G'],
}

const q4 = {
  label: 'ระบบฟังเสียง - คุณจะฟังเสียงเพื่อนๆ ผ่านทางไหน?',
  options: ['หูฟังมีสาย', 'ลำโพง', 'หูฟัง Bluetooth'],
}

const guidance = computed((): GuidanceItem[] => {
  const items: GuidanceItem[] = []

  // OS Guidance
  if (!answers.os) {
    items.push({
      level: 'placeholder',
      html: 'เลือกระบบปฏิบัติการของคุณเพื่อเริ่มต้น',
      section: 'os',
    })
  }

  // Audio Interface Guidance
  if (!answers.os) {
    items.push({
      level: 'placeholder',
      html: 'โปรดตอบคำถามข้อแรก (ระบบปฏิบัติการ) ก่อน เพื่อเลือกคำแนะนำที่เหมาะสม',
      section: 'audioInterface',
    })
  } else if (answers.audioInterface) {
    if (answers.os === 'Windows') {
      if (answers.audioInterface === 'มี') {
        items.push({
          level: 'success',
          html: '<iconify-icon icon="mdi:check-circle" inline></iconify-icon> ดีเลย — ขอแนะนำให้ใช้ ASIO driver ของ Audio Interface นั้น แต่หากไม่มี สามารถใช้ ASIO4ALL ได้',
          section: 'audioInterface',
        })
      } else {
        items.push({
          level: 'warning',
          html: '<iconify-icon icon="mdi:alert-circle" inline></iconify-icon> ใช้งานได้ — สามารถใช้การ์ดเสียงที่มาพร้อมกับเครื่องคอมพิวเตอร์ได้ ผ่านทาง ASIO4ALL แต่เสียงอาจมีดีเลย์มากกว่าใช้ interface แยก — อย่างไรก็ตาม ขอแนะนำให้ทดลองเชื่อมต่อด้วยอุปกรณ์ที่มีดูก่อน',
          section: 'audioInterface',
        })
      }
    } else if (answers.os === 'macOS') {
      if (answers.audioInterface === 'มี') {
        items.push({
          level: 'success',
          html: '<iconify-icon icon="mdi:check-circle" inline></iconify-icon> ดีเลย — ใช้ Audio Interface แยก อาจจะให้คุณภาพเสียงดีกว่า และยืดหยุ่นกว่า',
          section: 'audioInterface',
        })
      } else {
        items.push({
          level: 'success',
          html: '<iconify-icon icon="mdi:check-circle" inline></iconify-icon> ไม่มีปัญหา — macOS มี latency ต่ำอยู่แล้ว จึงไม่จำเป็นต้องมี Audio Interface แยก',
          section: 'audioInterface',
        })
      }
    }
  }

  // Internet Guidance
  if (!answers.internet) {
    items.push({
      level: 'placeholder',
      html: 'เลือกประเภทการเชื่อมต่ออินเทอร์เน็ตของคุณเพื่อรับคำแนะนำ',
      section: 'internet',
    })
  } else {
    if (answers.internet === 'LAN') {
      items.push({
        level: 'success',
        html: '<iconify-icon icon="mdi:check-circle" inline></iconify-icon> ดีที่สุด — การเชื่อมต่อแบบสายจะดีเลย์น้อยกว่าและเสถียรกว่า',
        section: 'internet',
      })
    } else if (answers.internet === 'Wi-Fi') {
      items.push({
        level: 'warning',
        html: '<iconify-icon icon="mdi:alert-circle" inline></iconify-icon> สามารถใช้ได้ — แต่ระหว่างเล่นอาจเจอสัญญาณรบกวนที่ทำให้เสียงกระตุกหรือแตกหัก (Jitter) สามารถเปลี่ยนไปใช้สาย LAN เพื่อลดอาการกระตุก',
        section: 'internet',
      })
    } else if (answers.internet === '4G / 5G') {
      items.push({
        level: 'warning',
        html: '<iconify-icon icon="mdi:alert-circle" inline></iconify-icon> สามารถใช้ได้ — สัญญาณ 4G/5G จะไม่ค่อยเจอปัญหาสัญญาณรบกวนที่ทำให้เสียงกระตุกหรือแตกหัก (Jitter) หากเชื่อมต่อจากมือถือเข้าคอมพิวเตอร์โดยตรง (ใช้สาย USB หรือ Ethernet โดยไม่ผ่าน Wi-Fi) แต่จะมีดีเลย์สูงกว่าใช้เน็ตบ้าน',
        section: 'internet',
      })
    }
  }

  // Audio Output Guidance
  if (!answers.audioOutput) {
    items.push({
      level: 'placeholder',
      html: 'เลือกวิธีฟังเสียงของคุณเพื่อรับคำแนะนำ',
      section: 'audioOutput',
    })
  } else {
    if (answers.audioOutput === 'หูฟังมีสาย') {
      items.push({
        level: 'success',
        html: '<iconify-icon icon="mdi:check-circle" inline></iconify-icon> ดีที่สุด — Latency ต่ำ สภาพเสียงดี',
        section: 'audioOutput',
      })
    } else if (answers.audioOutput === 'ลำโพง') {
      items.push({
        level: 'warning',
        html: '<iconify-icon icon="mdi:alert-circle" inline></iconify-icon> ระวัง Feedback — สามารถเล่นได้ แต่ต้อง "ปิดไมค์" ไม่งั้นเสียงจากลำโพงจะวนเข้าไมค์เกิดเสียงหอน ให้ต่อเครื่องดนตรีเข้าคอมโดยตรงเท่านั้น',
        section: 'audioOutput',
      })
    } else if (answers.audioOutput === 'หูฟัง Bluetooth') {
      items.push({
        level: 'danger',
        html: '<iconify-icon icon="mdi:close-circle" inline></iconify-icon> ไม่แนะนำอย่างยิ่ง — หูฟังไร้สายมี Latency ในตัวเองสูงมาก (แม้จะเป็นรุ่นแพง) จะทำให้คุณได้ยินเสียงดีเลย์จนแจมกับใครไม่ได้เลย ขอแนะนำให้หาหูฟังมีสายมาเสียบ หรือถ้าอยากเชื่อมต่อแบบไร้สายจริงๆ สามารถใช้ Wireless In-Ear Monitor ที่ออกแบบมาสำหรับนักดนตรีโดยเฉพาะแทน',
        section: 'audioOutput',
      })
    }
  }

  return items
})

const getGuidanceBySection = (section: GuidanceSection): GuidanceItem | undefined => {
  return guidance.value.find((item) => item.section === section)
}

</script>

<style scoped>
.readiness-check {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.question-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.question-group {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
}

.question-group h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.options button {
  padding: 0.5rem 1rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.options button:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.options button.selected {
  background: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  color: #fff;
}

.guidance-inline {
  border-left: 4px solid var(--vp-c-brand);
  padding: 1rem 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  animation: slideIn 0.3s ease;
}

.guidance-inline.guidance-placeholder {
  border-left-color: var(--vp-c-divider);
  opacity: 0.6;
}

.guidance-inline.guidance-success {
  border-left-color: var(--vp-c-green-2);
}

.guidance-inline.guidance-warning {
  border-left-color: var(--vp-c-yellow-2);
}

.guidance-inline.guidance-danger {
  border-left-color: var(--vp-c-red-2);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.guidance-content {
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.guidance-content p {
  margin: 0;
}

@media (max-width: 640px) {
  .question-group {
    padding: 1rem;
  }

  .options {
    flex-direction: column;
  }

  .options button {
    width: 100%;
  }

  .guidance-inline {
    padding: 1rem;
  }

  .guidance-content a {
    word-break: break-all;
  }
}
</style>
