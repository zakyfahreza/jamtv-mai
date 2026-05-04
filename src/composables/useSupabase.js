import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials not found. Using demo mode.')
}

export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null

// ─── Settings ───────────────────────────────────────────────────────────────

export async function getSettings() {
  if (!supabase) return getDefaultSettings()
  const { data, error } = await supabase.from('settings').select('key, value')
  if (error) {
    console.error('Error fetching settings:', error)
    return getDefaultSettings()
  }
  const obj = {}
  data.forEach(row => { obj[row.key] = row.value })
  return { ...getDefaultSettings(), ...obj }
}

export async function updateSetting(key, value) {
  if (!supabase) return
  const { error } = await supabase
    .from('settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
  if (error) console.error('Error updating setting:', error)
}

// ─── Iqomah Times ───────────────────────────────────────────────────────────

export async function getIqomahTimes() {
  if (!supabase) return getDefaultIqomah()
  const { data, error } = await supabase.from('iqomah_times').select('*')
  if (error) {
    console.error('Error fetching iqomah times:', error)
    return getDefaultIqomah()
  }
  const obj = {}
  data.forEach(row => { obj[row.prayer] = row.minutes })
  return { ...getDefaultIqomah(), ...obj }
}

export async function updateIqomahTime(prayer, minutes) {
  if (!supabase) return
  const { error } = await supabase
    .from('iqomah_times')
    .upsert({ prayer, minutes, updated_at: new Date().toISOString() }, { onConflict: 'prayer' })
  if (error) console.error('Error updating iqomah time:', error)
}

// ─── Slides ─────────────────────────────────────────────────────────────────

export async function getSlides() {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('slides')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true })
  if (error) { console.error('Error fetching slides:', error); return [] }
  return data
}

export async function createSlide(slide) {
  if (!supabase) return
  const { data, error } = await supabase.from('slides').insert(slide).select().single()
  if (error) console.error('Error creating slide:', error)
  return data
}

export async function updateSlide(id, updates) {
  if (!supabase) return
  const { error } = await supabase.from('slides').update(updates).eq('id', id)
  if (error) console.error('Error updating slide:', error)
}

export async function deleteSlide(id) {
  if (!supabase) return
  const { error } = await supabase.from('slides').delete().eq('id', id)
  if (error) console.error('Error deleting slide:', error)
}

// ─── Announcements ──────────────────────────────────────────────────────────

export async function getAnnouncements() {
  if (!supabase) return getDefaultAnnouncements()
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true })
  if (error) { console.error('Error fetching announcements:', error); return getDefaultAnnouncements() }
  return data
}

export async function getAllAnnouncements() {
  if (!supabase) return getDefaultAnnouncements()
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('id', { ascending: true })
  if (error) return getDefaultAnnouncements()
  return data
}

let mockAnnId = 100
export async function createAnnouncement(text) {
  if (!supabase) return { id: ++mockAnnId, text, is_active: true }
  const { data, error } = await supabase
    .from('announcements')
    .insert({ text, is_active: true })
    .select().single()
  if (error) console.error('Error creating announcement:', error)
  return data
}

export async function updateAnnouncement(id, updates) {
  if (!supabase) return true
  const { error } = await supabase.from('announcements').update(updates).eq('id', id)
  if (error) console.error('Error updating announcement:', error)
}

export async function deleteAnnouncement(id) {
  if (!supabase) return true
  const { error } = await supabase.from('announcements').delete().eq('id', id)
  if (error) console.error('Error deleting announcement:', error)
}

// ─── Audio Files ─────────────────────────────────────────────────────────────

export async function getAudioFiles() {
  if (!supabase) return {}
  const { data, error } = await supabase
    .from('audio_files')
    .select('*')
    .eq('is_active', true)
  if (error) { console.error('Error fetching audio files:', error); return {} }
  const obj = {}
  data.forEach(row => { obj[row.type] = row.url })
  return obj
}

export async function createAudioFile(audioData) {
  if (!supabase) return
  const { data, error } = await supabase.from('audio_files').insert(audioData).select().single()
  if (error) console.error('Error creating audio file:', error)
  return data
}

export async function deleteAudioFile(id) {
  if (!supabase) return
  const { error } = await supabase.from('audio_files').delete().eq('id', id)
  if (error) console.error('Error deleting audio file:', error)
}

// ─── Storage Upload ──────────────────────────────────────────────────────────

export async function uploadFile(bucket, path, file) {
  if (!supabase) return null
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true })
  if (error) { console.error('Error uploading file:', error); return null }
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)
  return urlData.publicUrl
}

export async function deleteFile(bucket, path) {
  if (!supabase) return
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) console.error('Error deleting file:', error)
}

// ─── Defaults (Demo Mode) ────────────────────────────────────────────────────

function getDefaultSettings() {
  return {
    mosque_name: 'Masjid Al-Ikhlas Adi Sucipto',
    mosque_subtitle: '',
    mosque_logo: '',
    clock_duration: '30',
    slide_duration: '20',
    announcement_interval: '12',
    prayer_offset_subuh: '0',
    prayer_offset_dzuhur: '0',
    prayer_offset_ashar: '0',
    prayer_offset_maghrib: '0',
    prayer_offset_isya: '0',
    city: 'Surakarta',
    city_id: '1434',
    pesan_dakwah: 'Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain.'
  }
}

function getDefaultIqomah() {
  return { subuh: 10, dzuhur: 10, ashar: 10, maghrib: 5, isya: 10 }
}

function getDefaultAnnouncements() {
  return [
    { id: 1, text: 'Selamat datang di Masjid Al-Ikhlas. Mari jaga kebersihan dan ketertiban masjid.' },
    { id: 2, text: 'Jadwal kajian rutin setiap Ahad pagi pukul 07.00 WIB.' },
    { id: 3, text: 'Donasi pembangunan masjid dapat disalurkan melalui kotak amal yang tersedia.' }
  ]
}
