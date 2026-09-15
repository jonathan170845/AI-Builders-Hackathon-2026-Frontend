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
pnpm install --frozen-lockfile
pnpm run dev
```

Buka alamat lokal yang ditampilkan Vite (biasanya `http://localhost:5173`).

## Perintah yang tersedia

```bash
pnpm run dev        # Menjalankan development server
pnpm run build      # Membuat build produksi
pnpm run preview    # Meninjau build produksi secara lokal
pnpm run lint       # Menjalankan ESLint
pnpm run typecheck  # Memeriksa tipe TypeScript
```

## Catatan

Analisis baru dan history menggunakan FastAPI. Jalankan backend pada `http://127.0.0.1:8000`;
Vite mem-proxy `/api` ke backend. `.env.example` menyediakan `VITE_API_BASE_URL=/api/v1`.
Jangan menaruh API key provider di frontend atau variable `VITE_*`.

`/new` mengirim decision, `/analyses/:id` memulihkan progress/report setelah refresh, dan
`/history` mengambil riwayat persisten dengan pagination. Polling berhenti ketika selesai/gagal,
menggunakan satu request aktif, dan dibatalkan ketika halaman ditinggalkan. Jika koneksi putus,
job mungkin tetap berjalan; buka history sebelum submit ulang.

Financial inputs benar-benar opsional melalui checkbox. Hasil finansial nyata dihitung backend,
memakai unit uang yang sama dengan input tanpa mengasumsikan mata uang. `null` ditampilkan `N/A`.
Mode `/demo` saja memakai mock statis, dengan label jelas. Detail decision dan evidence dapat
terkirim ke provider AI eksternal; disclosure tersedia pada halaman input.

## Verifikasi

```bash
pnpm run api:check
pnpm run typecheck
pnpm run lint
pnpm run test
pnpm run build
```

`contracts/openapi.json` diekspor dari backend. Setelah perubahan kontrak yang disengaja:

```bash
# Di backend:
uv run python scripts/export_contract.py
# Di frontend:
node scripts/generate-api-types.mjs ../AI-Builders-Hackathon-2026-Backend/contracts/openapi.json
```

Tipe client di `src/api/types.generated.ts` dihasilkan deterministik dari OpenAPI. CI memeriksa
pergeseran tipe. Test UI memakai respons terkontrol untuk queued ? processing ? completed,
failed, reconnect, nullable financials, dan pagination history. Test fixture tidak membuktikan
ketersediaan provider eksternal.

Untuk kedua container, gunakan `compose.yaml` di repo backend. Konfigurasi nginx frontend
memiliki SPA fallback supaya deep link dapat dibuka langsung. Dockerfile tidak memuat `.env`.
Ikuti README backend untuk model, prepared data, migration, dan provider.
