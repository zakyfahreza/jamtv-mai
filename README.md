# Jam Masjid Digital

Aplikasi web jam masjid digital untuk layar TV Android, dibangun dengan Vue 3 + TailwindCSS + Supabase.

## Fitur
- ⏰ Jam digital realtime (24 jam)
- 📅 Tanggal Masehi & Hijriyah
- 🕌 Jadwal sholat otomatis (Kota Solo via API Kemenag)
- ⏳ Countdown Iqomah fullscreen
- 🖼️ Slideshow gambar dari Supabase Storage
- 📢 Vertical scroll pengumuman
- 🔊 Audio notifikasi (adzan, iqomah)
- ⚙️ Admin panel mobile-friendly

## Setup

1. Clone repo & install dependencies:
```bash
npm install
```

2. Copy `.env.example` ke `.env.local` dan isi dengan kredensial Supabase:
```bash
cp .env.example .env.local
```

3. Buat tabel di Supabase (lihat `supabase/schema.sql`)

4. Jalankan dev server:
```bash
npm run dev
```

## Deployment ke Vercel

1. Push ke GitHub
2. Connect repo di Vercel
3. Tambahkan environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

## Akses
- **TV Display**: `https://your-app.vercel.app/`
- **Admin Panel**: `https://your-app.vercel.app/admin`

## Struktur Database Supabase

Lihat file `supabase/schema.sql` untuk SQL lengkap pembuatan tabel.
