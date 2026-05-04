-- ============================================
-- JAM MASJID DIGITAL - Supabase Schema
-- ============================================

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('mosque_name', 'Masjid Al-Ikhlas'),
  ('mosque_subtitle', 'Mari Tegakkan Sholat Berjamaah'),
  ('mosque_logo', ''),
  ('clock_duration', '30'),
  ('slide_duration', '20'),
  ('announcement_interval', '12'),
  ('prayer_offset_subuh', '0'),
  ('prayer_offset_dzuhur', '0'),
  ('prayer_offset_ashar', '0'),
  ('prayer_offset_maghrib', '0'),
  ('prayer_offset_isya', '0'),
  ('city', 'solo'),
  ('city_id', '1309')
ON CONFLICT (key) DO NOTHING;

-- Iqomah times table
CREATE TABLE IF NOT EXISTS iqomah_times (
  id BIGSERIAL PRIMARY KEY,
  prayer TEXT UNIQUE NOT NULL,
  minutes INTEGER NOT NULL DEFAULT 10,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default iqomah times
INSERT INTO iqomah_times (prayer, minutes) VALUES
  ('subuh', 10),
  ('dzuhur', 10),
  ('ashar', 10),
  ('maghrib', 5),
  ('isya', 10)
ON CONFLICT (prayer) DO NOTHING;

-- Slides table
CREATE TABLE IF NOT EXISTS slides (
  id BIGSERIAL PRIMARY KEY,
  title TEXT,
  image_url TEXT NOT NULL,
  duration INTEGER DEFAULT 8,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id BIGSERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample announcement
INSERT INTO announcements (text, is_active, "order") VALUES
  ('Selamat datang di Masjid Al-Ikhlas. Mari jaga kebersihan dan ketertiban masjid.', true, 1),
  ('Jadwal kajian rutin setiap Ahad pagi pukul 07.00 WIB bersama Ustadz setempat.', true, 2),
  ('Donasi pembangunan masjid dapat disalurkan melalui kotak amal yang tersedia.', true, 3)
ON CONFLICT DO NOTHING;

-- Audio files table
CREATE TABLE IF NOT EXISTS audio_files (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE iqomah_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_files ENABLE ROW LEVEL SECURITY;

-- Allow public read for display
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Public read iqomah" ON iqomah_times FOR SELECT USING (true);
CREATE POLICY "Public read slides" ON slides FOR SELECT USING (true);
CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Public read audio" ON audio_files FOR SELECT USING (true);

-- Allow all operations (admin uses anon key - adjust as needed for security)
CREATE POLICY "Admin write settings" ON settings FOR ALL USING (true);
CREATE POLICY "Admin write iqomah" ON iqomah_times FOR ALL USING (true);
CREATE POLICY "Admin write slides" ON slides FOR ALL USING (true);
CREATE POLICY "Admin write announcements" ON announcements FOR ALL USING (true);
CREATE POLICY "Admin write audio" ON audio_files FOR ALL USING (true);

-- Storage buckets (run in Supabase Dashboard > Storage)
-- Create bucket: 'slides' (public)
-- Create bucket: 'audio' (public)
