# TERMUX_SETUP.md — Build Riyo Shooter APK 100% dari Termux (Android)

Panduan ini TIDAK membutuhkan laptop, TIDAK membutuhkan Android Studio.
Semua dijalankan di dalam Termux, di HP Android yang sama.

Catatan sebelum mulai:
- Build APK di HP membutuhkan RAM lumayan besar (disarankan HP dengan RAM 4GB+,
  makin besar makin lancar) dan penyimpanan kosong minimal ~6-8 GB (Android SDK +
  Gradle cache + node_modules cukup besar).
- Semua path di bawah pakai variabel lingkungan agar mudah disesuaikan — JANGAN
  hardcode path yang berbeda dari environment kamu sendiri.

---

## 1. Install Termux dari sumber resmi

Install Termux dari F-Droid (BUKAN dari Play Store — versi Play Store sudah
tidak diupdate dan sering bermasalah untuk build native):

https://f-droid.org/en/packages/com.termux/

Setelah terinstall, buka Termux lalu update paket dasar:

```
pkg update -y && pkg upgrade -y
```

Izinkan akses storage (opsional, untuk menyalin APK hasil build ke folder Download):

```
termux-setup-storage
```

---

## 2. Install Node.js

```
pkg install -y nodejs-lts git
node -v
npm -v
```

---

## 3. Install Java/JDK yang kompatibel

Android Gradle Plugin modern butuh JDK 17.

```
pkg install -y openjdk-17
```

Cek:

```
javac -version
```

---

## 4. Install Android command line tools

Termux tidak menyediakan Android SDK lewat `pkg`. Kita unduh "cmdline-tools"
resmi dari Google lalu simpan di dalam $HOME Termux.

```
mkdir -p $HOME/android-sdk/cmdline-tools
cd $HOME/android-sdk/cmdline-tools
```

Unduh cmdline-tools (butuh koneksi internet; cek versi terbaru di
https://developer.android.com/studio#command-tools jika link di bawah sudah usang):

```
pkg install -y wget unzip
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O cmdline-tools.zip
unzip cmdline-tools.zip
rm cmdline-tools.zip
mv cmdline-tools latest
```

Struktur akhirnya harus:
`$HOME/android-sdk/cmdline-tools/latest/bin/sdkmanager`

---

## 5. Set ANDROID_HOME

Tambahkan ke `$HOME/.bashrc` (atau `.zshrc` jika pakai zsh):

```
export ANDROID_HOME=$HOME/android-sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
```

Lalu muat ulang:

```
source $HOME/.bashrc
```

---

## 6. Set PATH

Tambahkan juga ke `$HOME/.bashrc`:

```
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/build-tools/34.0.0
```

```
source $HOME/.bashrc
```

---

## 7. Install Android SDK platform yang diperlukan

```
yes | sdkmanager --sdk_root=$ANDROID_HOME "platforms;android-34"
```

## 8. Install build-tools

```
yes | sdkmanager --sdk_root=$ANDROID_HOME "build-tools;34.0.0"
```

## 9. Install platform-tools

```
yes | sdkmanager --sdk_root=$ANDROID_HOME "platform-tools"
```

## 10. Install Gradle

Capacitor Android biasanya menggunakan Gradle Wrapper (`gradlew`) yang otomatis
mengunduh versi Gradle yang benar saat pertama dijalankan, jadi instalasi Gradle
global TIDAK wajib. Tapi jika `gradlew` gagal di Termux (masalah umum di
lingkungan non-Linux-desktop), install Gradle manual sebagai fallback:

```
pkg install -y gradle
```

Terima lisensi SDK:

```
yes | sdkmanager --licenses
```

---

## 11. Clone/salin project lalu install dependency Node

Masuk ke folder project (sesuaikan path jika project disalin ke lokasi lain):

```
cd ~/riyo-shooter
npm install
```

---

## 12. Build Next.js static export

```
npm run build
```

Perintah ini menghasilkan folder `out/` (hasil `next build` dengan
`output: 'export'` di `next.config.js`) — inilah yang nanti dibaca Capacitor.

---

## 13. Tambahkan platform Android & sync

Jika folder `android/` belum ada di project (build pertama kali):

```
npx cap add android
```

Setiap kali `out/` berubah (setelah `npm run build`), sync ulang:

```
npx cap sync android
```

---

## 14. Build APK

```
cd android
chmod +x gradlew
./gradlew assembleDebug
```

Jika `gradlew` gagal karena tidak bisa mengunduh Gradle distribusi di Termux,
edit `android/gradle/wrapper/gradle-wrapper.properties` agar memakai Gradle
yang sudah diinstall lewat `pkg install gradle` di langkah 10, lalu jalankan
`gradle assembleDebug` sebagai gantinya.

Untuk build release (butuh signing key, opsional untuk tahap awal):

```
./gradlew assembleRelease
```

---

## 15. Lokasi APK hasil build

Debug APK:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

Release APK (jika dibuild):

```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

Salin ke folder Download HP agar mudah diinstall (butuh `termux-setup-storage`
di langkah 1 sudah dijalankan):

```
cp android/app/build/outputs/apk/debug/app-debug.apk /sdcard/Download/
```

---

## Script npm yang tersedia (lihat package.json)

- `npm run dev` — jalankan Next.js dev server (untuk preview UI cepat, browser saja)
- `npm run build` — build static export ke `out/`
- `npm run cap:sync` — sync `out/` ke project Android Capacitor
- `npm run android:debug` — build APK debug lewat Gradle
- `npm run build:apk` — jalankan build + sync + build APK debug sekaligus

## Troubleshooting umum di Termux

- **`ENOSPC` / kehabisan ruang saat npm install**: hapus cache npm dengan
  `npm cache clean --force`, pastikan storage HP cukup lega.
- **Gradle daemon OOM / build lambat**: tambahkan `org.gradle.jvmargs=-Xmx2048m`
  di `android/gradle.properties`.
- **`aapt`/`aapt2` gagal jalan**: pastikan arsitektur build-tools sesuai CPU HP
  (biasanya arm64 di Termux) — build-tools resmi Google umumnya sudah
  menyertakan binary yang kompatibel lewat proot/termux patch; jika gagal total,
  cari paket `aapt2` khusus Termux di komunitas Termux:Android-Build.
