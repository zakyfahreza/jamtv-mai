<template>
  <!-- min-h-screen + overflow-y-auto fixes the scroll bug -->
  <div
    class="admin-view min-h-screen w-full font-body"
    style="background: #0B1E17; color: #E8F5EE;"
  >
    <!-- Sticky header -->
    <header class="sticky top-0 z-30 border-b px-4 py-3"
      style="background: rgba(11,30,23,0.95); backdrop-filter:blur(12px); border-color: rgba(37,77,53,0.8);">
      <div class="max-w-2xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-lg"
            style="background:rgba(58,125,91,0.3); border:1px solid rgba(82,183,136,0.4);">🕌</div>
          <div>
            <h1 class="font-display font-bold" style="font-size:1.1rem; color:#95D5B2;">Admin Panel</h1>
            <p class="text-xs" style="color:#6AAF8A;">Jam Masjid Digital</p>
          </div>
        </div>
        <a href="/" target="_blank"
          class="text-xs px-3 py-1.5 rounded-full font-semibold transition-colors"
          style="border:1px solid rgba(82,183,136,0.4); color:#95D5B2;"
          onmouseover="this.style.background='rgba(82,183,136,0.1)'"
          onmouseout="this.style.background='transparent'"
        >Lihat TV →</a>
      </div>
    </header>

    <!-- Scrollable main content -->
    <main class="max-w-2xl mx-auto px-4 py-6 space-y-5 pb-12">

      <!-- Loading -->
      <div v-if="globalLoading" class="flex justify-center py-16">
        <div class="flex gap-2">
          <div v-for="i in 3" :key="i"
            class="w-2.5 h-2.5 rounded-full animate-bounce"
            style="background:#52B788;"
            :style="{ animationDelay: `${(i-1)*150}ms` }"
          ></div>
        </div>
      </div>

      <template v-else>

        <!-- ── PENGATURAN UMUM ── -->
        <section class="admin-card space-y-4">
          <h2 class="section-title">⚙️ Pengaturan Umum</h2>

          <div>
            <label class="form-label">Tipe Tampilan Layar</label>
            <select v-model="form.display_mode" class="form-input">
              <option value="auto">Bergantian (Otomatis)</option>
              <option value="clock">Jam Saja</option>
              <option value="slideshow">Slideshow Saja</option>
            </select>
          </div>
          <div>
            <label class="form-label">Nama Masjid</label>
            <input v-model="form.mosque_name" type="text" class="form-input" placeholder="Masjid Al-Ikhlas" />
          </div>
          <div>
            <label class="form-label">Subtitle / Tagline</label>
            <input v-model="form.mosque_subtitle" type="text" class="form-input" />
          </div>
          <div>
            <label class="form-label">URL Logo Masjid (dari Supabase Storage)</label>
            <input v-model="form.mosque_logo" type="url" class="form-input" placeholder="https://..." />
            <img v-if="form.mosque_logo" :src="form.mosque_logo" class="mt-2 h-12 w-12 object-cover rounded-full" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="form-label">Durasi Mode Jam (detik)</label>
              <input v-model.number="form.clock_duration" type="number" min="10" max="600" class="form-input" />
            </div>
            <div>
              <label class="form-label">Durasi Slideshow (detik)</label>
              <input v-model.number="form.slide_duration" type="number" min="10" max="600" class="form-input" />
            </div>
          </div>
          <div>
            <label class="form-label">Durasi Tampil Pengumuman (detik)</label>
            <input v-model.number="form.announcement_interval" type="number" min="5" max="60" class="form-input" />
          </div>
          <button @click="saveSettings" :disabled="saving" class="btn-primary w-full">
            {{ saving ? 'Menyimpan...' : '💾 Simpan Pengaturan' }}
          </button>
        </section>

        <!-- ── KOREKSI WAKTU SHOLAT ── -->
        <section class="admin-card space-y-3">
          <h2 class="section-title">🕐 Koreksi Waktu Sholat (menit)</h2>
          <div>
            <label class="form-label">🏙️ Kota / Kab. (ID Kemenag)</label>
            <input v-model="form.city_id" type="text" class="form-input" placeholder="contoh: 1434 (Surakarta)" />
            <p class="text-xs mt-1" style="color:#6AAF8A;">Cari ID kota Anda di: <span style="color:#D4AF37;">api.myquran.com/v2/sholat/kota/semua</span></p>
          </div>
          <p class="text-xs" style="color:#6AAF8A;">Nilai positif = maju, negatif = mundur</p>
          <div class="grid grid-cols-2 gap-3">
            <div v-for="p in prayers" :key="p.key">
              <label class="form-label">{{ p.name }}</label>
              <input
                v-model.number="form[`prayer_offset_${p.key}`]"
                type="number" min="-30" max="30" class="form-input"
              />
            </div>
          </div>
          <button @click="saveSettings" :disabled="saving" class="btn-primary w-full">
            {{ saving ? 'Menyimpan...' : '💾 Simpan Koreksi' }}
          </button>
        </section>

        <!-- ── WAKTU IQOMAH ── -->
        <section class="admin-card space-y-3">
          <h2 class="section-title">⏳ Waktu Iqomah (menit setelah adzan)</h2>
          <div class="grid grid-cols-2 gap-3">
            <div v-for="p in prayers" :key="p.key">
              <label class="form-label">{{ p.name }}</label>
              <input
                v-model.number="iqomahForm[p.key]"
                type="number" min="1" max="60" class="form-input"
              />
            </div>
          </div>
          <button @click="saveIqomah" :disabled="saving" class="btn-primary w-full">
            {{ saving ? 'Menyimpan...' : '💾 Simpan Iqomah' }}
          </button>
        </section>

        <!-- ── SLIDESHOW ── -->
        <section class="admin-card space-y-4">
          <h2 class="section-title">🖼️ Slideshow</h2>
          <div class="p-4 rounded-xl space-y-3 text-sm" style="background:rgba(11,30,23,0.8); border:1px dashed rgba(82,183,136,0.35);">
            <p class="font-semibold" style="color:#95D5B2;">📁 Cara menambah foto slideshow:</p>
            <ol class="list-decimal list-inside space-y-1.5" style="color:#6AAF8A;">
              <li>Simpan file gambar (JPG / PNG / WebP) ke dalam folder:</li>
              <li><code class="px-2 py-0.5 rounded text-xs" style="background:rgba(82,183,136,0.12); color:#D4AF37;">src/assets/slides/</code></li>
              <li>Restart server atau rebuild aplikasi agar foto muncul di slideshow.</li>
            </ol>
            <p class="mt-2 text-xs" style="color:#52B788;">✓ Semua gambar di dalam folder tersebut akan otomatis tampil sebagai slideshow secara berurutan.</p>
          </div>
        </section>

        <!-- ── PENGUMUMAN ── -->
        <section class="admin-card space-y-3">
          <h2 class="section-title">📢 Pengumuman</h2>
          <div class="flex gap-2">
            <input
              v-model="newAnnouncementText"
              type="text"
              class="form-input flex-1"
              placeholder="Ketik teks pengumuman..."
              @keyup.enter="addAnnouncement"
            />
            <button @click="addAnnouncement" class="btn-primary px-4 text-lg">+</button>
          </div>
          <div v-if="!announcements.length" class="text-center py-4 text-sm" style="color:#6AAF8A;">
            Belum ada pengumuman.
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="ann in announcements" :key="ann.id"
              class="flex items-start gap-2 p-3 rounded-lg"
              style="background:rgba(11,30,23,0.7); border:1px solid rgba(37,77,53,0.6);"
            >
              <span style="color:#D4AF37;" class="flex-shrink-0 mt-0.5">📢</span>
              <div class="flex-1">
                <textarea v-if="ann.isEditing" v-model="ann.editText" class="form-input w-full text-sm" rows="2"></textarea>
                <p v-else class="text-sm leading-relaxed">{{ ann.text }}</p>
              </div>
              <div class="flex flex-col gap-1.5 flex-shrink-0">
                <div class="flex gap-1.5">
                  <button v-if="ann.isEditing" @click="saveEditAnnouncement(ann)" class="btn-tiny" style="color:#95D5B2; border-color:rgba(82,183,136,0.4);">✓</button>
                  <button v-else @click="startEditAnnouncement(ann)" class="btn-tiny" style="color:#D4AF37; border-color:rgba(212,175,55,0.4);">✏️</button>
                  <button @click="removeAnnouncement(ann)" class="btn-tiny" style="color:#F87171; border-color:rgba(248,113,113,0.4);">✕</button>
                </div>
                <button v-if="!ann.isEditing" @click="toggleAnnouncement(ann)" class="btn-tiny w-full text-xs"
                  :style="{ color: ann.is_active ? '#52B788' : '#F87171', borderColor: ann.is_active ? 'rgba(82,183,136,0.4)' : 'rgba(248,113,113,0.4)' }">
                  {{ ann.is_active ? 'ON' : 'OFF' }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- ── AUDIO ── -->
        <section class="admin-card space-y-3">
          <h2 class="section-title">🔊 Audio Notifikasi</h2>
          <div class="p-4 rounded-xl space-y-3 text-sm" style="background:rgba(11,30,23,0.8); border:1px dashed rgba(82,183,136,0.35);">
            <p class="font-semibold" style="color:#95D5B2;">🔔 Cara mengatur suara notifikasi:</p>
            <ol class="list-decimal list-inside space-y-1.5" style="color:#6AAF8A;">
              <li>Siapkan file audio (MP3 / WAV / OGG).</li>
              <li>Simpan di path:</li>
              <li><code class="px-2 py-0.5 rounded text-xs" style="background:rgba(82,183,136,0.12); color:#D4AF37;">src/assets/notification.mp3</code></li>
              <li>Rebuild/restart aplikasi.</li>
            </ol>
            <p class="mt-2 text-xs" style="color:#52B788;">✓ Satu file audio ini akan diputar untuk semua notifikasi (adzan & iqomah).</p>
          </div>
        </section>

      </template>
    </main>

    <!-- Toast -->
    <Transition name="fade">
      <div
        v-if="toast.show"
        class="fixed bottom-6 right-4 z-50 px-4 py-3 rounded-xl text-sm font-semibold shadow-xl"
        :style="{
          background: toast.type === 'success' ? 'rgba(46,100,70,0.95)' : 'rgba(120,40,40,0.95)',
          border: `1px solid ${toast.type === 'success' ? 'rgba(82,183,136,0.5)' : 'rgba(248,113,113,0.4)'}`,
          color: toast.type === 'success' ? '#95D5B2' : '#FCA5A5',
        }"
      >{{ toast.message }}</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import {
  getSettings, updateSetting,
  getIqomahTimes, updateIqomahTime,
  getSlides, createSlide, updateSlide, deleteSlide,
  getAllAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement,
  getAudioFiles, createAudioFile, uploadFile
} from '@/composables/useSupabase'

// ─── State ───────────────────────────────────────────────────────────────────
const globalLoading  = ref(true)
const saving         = ref(false)
const uploadingSlide = ref(false)
const slides         = ref([])
const announcements  = ref([])
const audioFiles     = ref({})
const audioInputs    = reactive({})
const newAnnouncementText = ref('')
const newSlide = reactive({ title: '', duration: 8, file: null, preview: null })
const toast    = reactive({ show: false, message: '', type: 'success' })

const form = reactive({
  mosque_name: '', mosque_subtitle: '', mosque_logo: '',
  display_mode: 'auto',
  clock_duration: 30, slide_duration: 20, announcement_interval: 12,
  prayer_offset_subuh: 0, prayer_offset_dzuhur: 0,
  prayer_offset_ashar: 0, prayer_offset_maghrib: 0, prayer_offset_isya: 0,
  city_id: '1434',
})
const iqomahForm = reactive({ subuh: 10, dzuhur: 10, ashar: 10, maghrib: 5, isya: 10 })

const prayers = [
  { key: 'subuh', name: 'Subuh' }, { key: 'dzuhur', name: 'Dzuhur' },
  { key: 'ashar', name: 'Ashar' }, { key: 'maghrib', name: 'Maghrib' },
  { key: 'isya', name: "Isya'" }
]
const audioTypes = [
  { type: 'adzan_subuh', label: '🌙 Adzan Subuh' },
  { type: 'adzan',       label: '☀️ Adzan (Dzuhur–Isya)' },
  { type: 'iqomah',      label: '🕌 Iqomah' },
  { type: 'beep',        label: '🔔 Beep Peringatan' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  Object.assign(toast, { show: true, message: msg, type })
  setTimeout(() => toast.show = false, 3500)
}

// ─── Load ────────────────────────────────────────────────────────────────────
async function loadData() {
  globalLoading.value = true
  try {
    const [s, sl, an, it, af] = await Promise.all([
      getSettings(), getSlides(), getAllAnnouncements(),
      getIqomahTimes(), getAudioFiles()
    ])
    Object.assign(form, {
      mosque_name:    s.mosque_name   || '',
      mosque_subtitle:s.mosque_subtitle || '',
      mosque_logo:    s.mosque_logo   || '',
      display_mode:   s.display_mode  || 'auto',
      clock_duration: parseInt(s.clock_duration)          || 30,
      slide_duration: parseInt(s.slide_duration)          || 20,
      announcement_interval: parseInt(s.announcement_interval) || 12,
      prayer_offset_subuh:   parseInt(s.prayer_offset_subuh)   || 0,
      prayer_offset_dzuhur:  parseInt(s.prayer_offset_dzuhur)  || 0,
      prayer_offset_ashar:   parseInt(s.prayer_offset_ashar)   || 0,
      prayer_offset_maghrib: parseInt(s.prayer_offset_maghrib) || 0,
      prayer_offset_isya:    parseInt(s.prayer_offset_isya)    || 0,
      city_id: s.city_id || '1434',
    })
    Object.assign(iqomahForm, it)
    slides.value = sl
    announcements.value = an
    audioFiles.value = af
  } catch {
    showToast('Gagal memuat data.', 'error')
  } finally {
    globalLoading.value = false
  }
}

// ─── Settings ────────────────────────────────────────────────────────────────
async function saveSettings() {
  saving.value = true
  try {
    await Promise.all(Object.entries(form).map(([k, v]) => updateSetting(k, String(v))))
    showToast('✓ Pengaturan disimpan!')
  } catch { showToast('Gagal menyimpan.', 'error') }
  finally { saving.value = false }
}

async function saveIqomah() {
  saving.value = true
  try {
    await Promise.all(Object.entries(iqomahForm).map(([p, m]) => updateIqomahTime(p, m)))
    showToast('✓ Waktu iqomah disimpan!')
  } catch { showToast('Gagal menyimpan.', 'error') }
  finally { saving.value = false }
}

// ─── Slides ───────────────────────────────────────────────────────────────────
function handleSlideUpload(e) {
  const f = e.target.files[0]
  if (!f) return
  if (f.size > 5 * 1024 * 1024) { showToast('File terlalu besar (maks 5MB)', 'error'); return }
  newSlide.file = f
  newSlide.preview = URL.createObjectURL(f)
}

async function uploadSlide() {
  if (!newSlide.file) return
  uploadingSlide.value = true
  try {
    const ext  = newSlide.file.name.split('.').pop()
    const path = `slide_${Date.now()}.${ext}`
    const url  = await uploadFile('slides', path, newSlide.file)
    if (!url) throw new Error()
    const data = await createSlide({
      title: newSlide.title || null, image_url: url,
      duration: newSlide.duration || 8, order: slides.value.length, is_active: true
    })
    if (data) slides.value.push(data)
    Object.assign(newSlide, { title:'', duration:8, file:null, preview:null })
    showToast('✓ Slide diupload!')
  } catch { showToast('Gagal upload.', 'error') }
  finally { uploadingSlide.value = false }
}

async function toggleSlide(s) {
  await updateSlide(s.id, { is_active: !s.is_active })
  s.is_active = !s.is_active
}
async function removeSlide(s) {
  if (!confirm('Hapus slide ini?')) return
  await deleteSlide(s.id)
  slides.value = slides.value.filter(x => x.id !== s.id)
  showToast('✓ Slide dihapus.')
}

// ─── Announcements ────────────────────────────────────────────────────────────
async function addAnnouncement() {
  if (!newAnnouncementText.value.trim()) return
  const d = await createAnnouncement(newAnnouncementText.value.trim())
  if (d) { announcements.value.push(d); newAnnouncementText.value = ''; showToast('✓ Pengumuman ditambahkan!') }
}
function startEditAnnouncement(a) {
  a.isEditing = true
  a.editText = a.text
}
async function saveEditAnnouncement(a) {
  if (!a.editText.trim()) return
  await updateAnnouncement(a.id, { text: a.editText.trim() })
  a.text = a.editText.trim()
  a.isEditing = false
  showToast('✓ Pengumuman diupdate.')
}
async function toggleAnnouncement(a) {
  await updateAnnouncement(a.id, { is_active: !a.is_active })
  a.is_active = !a.is_active
}
async function removeAnnouncement(a) {
  await deleteAnnouncement(a.id)
  announcements.value = announcements.value.filter(x => x.id !== a.id)
  showToast('✓ Pengumuman dihapus.')
}

// ─── Audio ────────────────────────────────────────────────────────────────────
function triggerAudioUpload(type) { audioInputs[type]?.click() }
async function handleAudioUpload(e, type) {
  const f = e.target.files[0]; if (!f) return
  try {
    const ext  = f.name.split('.').pop()
    const url  = await uploadFile('audio', `${type}_${Date.now()}.${ext}`, f)
    if (!url) throw new Error()
    const label = audioTypes.find(a => a.type === type)?.label || type
    await createAudioFile({ type, label, url, is_active: true })
    audioFiles.value[type] = url
    showToast(`✓ Audio diupload!`)
  } catch { showToast('Gagal upload audio.', 'error') }
}
function previewAudio(type) {
  const url = audioFiles.value[type]; if (!url) return
  new Audio(url).play().catch(() => {})
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
  // Restore scroll for admin page
  document.documentElement.classList.remove('tv-mode')
  document.body.style.overflow = 'auto'
  document.documentElement.style.overflow = 'auto'
  loadData()
})
onUnmounted(() => {
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
})
</script>

<style scoped>
.section-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #95D5B2;
  margin-bottom: 0.25rem;
}
.btn-tiny {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid;
  cursor: pointer;
  background: transparent;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-tiny:hover { background: rgba(255,255,255,0.05); }
</style>
