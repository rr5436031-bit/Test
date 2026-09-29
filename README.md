# Riyo Shooter

3D mobile shooter (Android APK) dibangun dengan Next.js static export + Capacitor,
dirancang agar bisa dikerjakan dan di-build sepenuhnya dari Termux (tanpa laptop,
tanpa Android Studio). Lihat **TERMUX_SETUP.md** untuk panduan build APK lengkap.

## Status implementasi saat ini

Ini adalah scaffold arsitektur yang sudah jalan end-to-end (lobby → gameplay 3D
dasar dengan gerak + drag-to-look + tombol tembak), bukan game lengkap. Yang
sudah ada:

- Struktur folder modular sesuai spesifikasi (app/, components/*, lib/*, types/)
- Static export + konfigurasi Capacitor siap `npx cap sync android`
- Landscape lock native (ScreenOrientation) + fallback gate "PUTAR PERANGKAT"
- Immersive: status bar disembunyikan, safe-area dihormati, no-zoom, no-scroll,
  no-select, no-context-menu, tanpa reload antar layar (client-side routing)
- Splash screen dengan progress bar (background: `public/images/splash.jpg` —
  **belum ada file gambarnya**, lihat catatan di bawah)
- Scene 3D dasar (React Three Fiber): arena placeholder, kamera first-person,
  virtual joystick + drag-to-look + tombol fire (HTML overlay di atas canvas)
- Katalog senjata sebagai data (`lib/game/weapons.ts`) — belum disambung ke
  sistem proyektil/damage
- Profil pemain lokal via localStorage (`lib/auth/localAuth.ts`), tanpa backend/
  Firebase/Google OAuth asli sesuai spesifikasi

## Belum diimplementasikan (langkah berikutnya)

- Layar Inventory, Weapons, Profile (tombol di lobby saat ini belum menuju ke
  layar tersebut — tinggal buat file di `components/inventory/`,
  `components/weapons/`, `components/profile/` mengikuti pola `LobbyScreen.tsx`)
- Sistem proyektil/hit-detection nyata di `PlayerRig.tsx`
- Musuh/AI, skor, progresi level
- Aset visual (model 3D, tekstur, ikon senjata, splash image)

## Catatan penting: gambar splash

Spesifikasi menyebut "gambar pertama yang sudah Anda berikan" untuk background
splash screen, tapi tidak ada file gambar yang benar-benar terlampir di
percakapan ini. `SplashScreen.tsx` sudah disiapkan untuk memakai
`public/images/splash.jpg` — tinggal taruh file itu di sana begitu kamu punya
asetnya; sebelum itu, splash tampil dengan warna solid sebagai fallback.
