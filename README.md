# Veritas

Veritas adalah aplikasi *decision intelligence* untuk membantu pemimpin dan tim menguji keputusan penting sebelum berkomitmen. Aplikasi ini memecah asumsi yang mendasari keputusan, menampilkan pola kegagalan dari kasus pembanding, menguji ketahanan finansial, dan menyusun rencana validasi.

## Fitur

- Menjalankan *stress test* untuk sebuah keputusan bisnis.
- Mengidentifikasi dan menilai asumsi-asumsi kritis.
- Menghitung *contribution margin*, laba operasional, *burn rate*, *runway*, dan titik impas.
- Menampilkan mekanisme kegagalan, perusahaan pembanding, serta sumber pendukung.
- Menyusun eksperimen validasi dan melihat riwayat analisis.

## Teknologi

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Lucide React

## Menjalankan secara lokal

Pastikan Node.js telah terpasang, lalu jalankan:

```bash
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan Vite (biasanya `http://localhost:5173`).

## Perintah yang tersedia

```bash
npm run dev        # Menjalankan development server
npm run build      # Membuat build produksi
npm run preview    # Meninjau build produksi secara lokal
npm run lint       # Menjalankan ESLint
npm run typecheck  # Memeriksa tipe TypeScript
```

## Catatan

Versi saat ini menggunakan data analisis contoh (*mock data*) yang berada di `src/data/mockData.ts`. Input finansial pada aplikasi akan dihitung secara langsung untuk menghasilkan metrik analisis.
