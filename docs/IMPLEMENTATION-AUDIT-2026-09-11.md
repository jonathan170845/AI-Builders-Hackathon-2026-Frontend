# Audit rencana Veritas — 11 September 2026

Audit menggunakan `000-issue-plans.zip` sebagai daftar target, kemudian memeriksa implementasi,
test, notebook sumber, dan artifact lokal. Dokumen ZIP bukan bukti bahwa pekerjaan sudah selesai.

## Lokasi yang diperiksa

- Backend aplikasi: `C:/Users/LENOVO/Documents/GitHub/AI-Builders-Hackathon-2026-Backend`.
- Frontend: repo ini.
- Notebook/model sumber: `E:/BINUS_CODING/Ai Builders Hackhaton/AI-Builders-Hackhaton-2026-Backend`.
- Artifact sumber: `E:/BINUS_CODING/Ai Builders Hackhaton/Data Final`.
- ZIP: `C:/Users/LENOVO/Downloads/000-issue-plans.zip`.

Path `E:/BINUS/_CODING/...` pada pesan awal berbeda dari folder nyata `E:/BINUS_CODING/...`.
Repo E: merupakan eksperimen notebook, bukan aplikasi FastAPI yang terlihat di IDE.
Notebook/data sumber dan perubahan lokal yang sudah ada di repo E: tidak diubah.
Dataset IDX mentah sekitar 100 GB tidak perlu dibaca untuk audit integrasi ini; yang diperiksa
adalah CSV benchmark hasil olahan dan penggunaannya dalam aplikasi.

## Status berdasarkan issue

| Rencana | Temuan awal | Perbaikan/verifikasi |
| --- | --- | --- |
| 001 — Bootstrap/API | FastAPI dan schema sudah ada; pembatasan body bergantung pada Content-Length; request ID belum dibatasi | Body streaming dibatasi 64 KiB, request ID disaring, error publik tetap generik, OpenAPI diekspor dan diperiksa drift-nya |
| 002 — Data/retrieval | Loader dan search sudah ada, dependency model masih v3, runtime belum disiapkan | Dependency v6 dikunci, model dimuat offline, seluruh vector diperiksa finite/norm, 32 sampel di-encode ulang saat preparation, checksum model diverifikasi saat startup |
| 003 — Finansial | Service Decimal sudah ada; input maksimum sah dapat gagal saat pembulatan | Presisi internal ditambah dan output maksimum diuji; nilai nullable ditangani UI; warning/benchmark nyata datang dari backend |
| 004 — LLM/pipeline | Pipeline sudah ada, tetapi provider tidak diberi schema lengkap; cache bisa bertabrakan; batas respons baru diperiksa setelah dibaca | Schema/instruksi data disertakan, mode teks untuk provider tanpa JSON mode, pembacaan dibatasi saat streaming, timeout wall-clock, cache SQLite diserialisasi, validasi referensi reviewer diperketat |
| 005 — Jobs/persistence | Job `queued` dapat tertinggal setelah restart; metadata model/prompt tidak disimpan; list mengambil payload report besar | Rekonsiliasi queued/processing, migration metadata pipeline, proyeksi kolom history, timeout job, kesiapan data diperiksa saat create |
| 006 — Frontend | Analisis baru masih mock, progress timer, history statis dan View mengabaikan ID | Client API terpusat, tipe dihasilkan dari OpenAPI, URL job yang bisa dipulihkan, polling dengan abort/backoff, history/pagination/error, submit guard, input finansial opsional, demo berlabel |
| 007 — Quality/deployment | Belum ada container/CI/kontrak snapshot | CI, Dockerfile, Compose dengan migration terpisah, SPA fallback, structured log, test UI/regresi, dokumentasi setup dan benchmark ditambahkan; Docker Engine lokal belum aktif sehingga container belum diuji jalan |

Tabel ini tidak menyatakan seluruh MUST sudah terbukti di semua environment. Validasi container,
izin redistribusi dataset, dan ketahanan provider pada beragam decision tetap memerlukan pemeriksaan.
Backend static type checking adalah SHOULD yang ditunda secara eksplisit.

## Koreksi handoff embedding

CSV sumber berisi **115.798 record**, bukan 1.157.980. Matrix embedding memiliki bentuk
**(115798, 384)**, dtype float32, dan metadata memiliki **115.798 ID unik**. Banyak teks CSV
memiliki newline di dalam field; jumlah baris fisik bukan jumlah record CSV. File memiliki
**1.157.981 baris fisik termasuk header**, menjelaskan angka 1.157.980 yang tercantum pada handoff.

Notebook mengekspor metadata dan embedding dari dataframe kandidat yang sama, dalam urutan yang
sama, dengan `normalize_embeddings=True`. Dua belas sampel merata dihitung ulang untuk audit awal;
cosine similarity terhadap vector tersimpan sekitar 1,0. Preparation kemudian memeriksa 32 sampel.
Tidak diperlukan pembuatan ulang seluruh company embedding untuk salinan ini.

Artifact siap pakai di backend `prepared-data/`:

| Artifact | Record |
| --- | ---: |
| Company metadata/embedding | 115.798 |
| Historical failure/source/document/embedding | 143 |
| IDX overall | 4 |
| IDX per period | 84 |
| IDX ratio benchmark | 14.753 |

Model lokal: `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`, dimensi 384.
Folder menggunakan format Sentence Transformers v6. Upstream Hub revision tidak tersedia;
manifest menyimpan identity berdasarkan isi file lokal, bukan revision yang ditebak:

`local-sha256:11103fdb2f4bebd478c0870ebd386e854161f42e3bcc2c259aa3a7011c5ca81e`

Identity mencakup weights, tokenizer, dan konfigurasi. Manifest mengikat artifact, urutan ID,
dimensi, dtype, metric dot product, dan normalisasi L2. Artifact/model tetap lokal dan di-ignore Git.

## Temuan dari provider nyata

Model notebook `inclusionai/ling-3.0-flash-fin:free` menolak `response_format=json_object`
dengan HTTP 400: provider Novita menyatakan `structured-outputs` tidak didukung.
Konfigurasi lokal memakai `LLM_RESPONSE_FORMAT=text`; schema validation tetap wajib.

Uji nyata juga menemukan respons gzip yang sempat didekompresi dua kali. Header encoding dan
panjang terkompresi kini dibuang setelah body dibaca dalam bentuk decoded; regression test mencakupnya.
Model pernah mengulang schema sebelum JSON data. Prompt kini tegas meminta satu objek data saja;
parser tetap menolak respons ganda/tidak valid, dan versi prompt diperbarui.

Evaluator juga menghabiskan batas 1.200 token dengan `finish_reason=length`. Konfigurasi lokal
menggunakan 4.096 token; keluaran terpotong menghasilkan `LLM_OUTPUT_TRUNCATED` dan tidak diterima
sebagai laporan. Reasoning tidak digunakan sebagai pengganti jawaban akhir.
[Dokumentasi token reasoning OpenRouter](https://openrouter.ai/docs/guides/best-practices/reasoning-tokens).

Job verifikasi memakai decision sintetis berawalan `Technical smoke test` dan tersimpan di history.
Kegagalan provider ditampilkan sebagai job gagal, tidak diganti dengan hasil mock.

Dua analisis nyata berhasil selesai menggunakan model yang sama:

- Tanpa finansial: `e741353a-6549-467c-b5ea-0fa373b94a66`, sekitar 22,2 detik,
  menghasilkan 5 asumsi dan 18 sumber; `financialResults` bernilai null.
- Dengan finansial: `0130dd32-8c99-4859-9401-92cfb80ca715`, sekitar 2,1 detik dengan
  penggunaan cache. Contribution 600, margin 60%, profit 100, burn 0,
  runway null, dan break-even 84 sesuai input sintetis yang diuji.

## Pengukuran lokal

Windows 11, Intel64 Family 6 Model 154; 115.798 vector × 384, top-k 5, tiga query sintetis:

- Inisialisasi artifact/model/validasi: **14,865 detik** pada run benchmark yang tercatat.
- Query gabungan company + historical failure: **0,4662 / 0,0607 / 0,0544 detik**.
- Sampel proses API setelah startup: working set sekitar **0,90 GiB**, peak sekitar **1,18 GiB**.

Angka ini bukan jaminan cold start pada mesin lain. Query pertama mencakup inisialisasi tambahan;
durasi penuh analisis juga bergantung pada provider. Jalankan `scripts/benchmark_retrieval.py`
di backend untuk mengukur ulang. Target awal ZIP (startup ≤30 detik, retrieval ≤2 detik)
terpenuhi pada run ini.

## Cara mencoba

Backend lokal sudah memiliki `.venv`, `.env` yang di-ignore, prepared data, dan migration database.
Key berasal dari konfigurasi notebook yang sudah ada; tidak dicetak atau dimasukkan ke frontend.

```powershell
# Backend
.\.venv\Scripts\uv.exe run --frozen veritas-api
# Frontend
pnpm run dev
```

Frontend: `http://localhost:5173`; backend docs: `http://127.0.0.1:8000/docs`.
`/health/ready` harus menjawab 200 sebelum analisis baru. Buka `/history` untuk job yang sudah ada.
Untuk Docker/backup/migration/kontrak, lihat README masing-masing repo.


## Pemeriksaan yang sudah lulus

- Backend: **71 test lulus**, satu test data opt-in dilewati pada suite offline; coverage service/API **87,28%**.
- Test data opt-in dijalankan terpisah pada prepared data asli: **1 test lulus**.
- Frontend: **10 test lulus**, mencakup API client, polling, failure/reconnect, history, deep link, abort, dan null/source rendering.
- Typecheck, lint, build frontend, generasi tipe API, ekspor kontrak backend, dan lint backend lulus.
- HTTP lokal: liveness 200, readiness 200, history 200. Vite menyajikan `/history`, `/analyses/:id`, dan proxy `/api/v1/analyses` dengan 200.
- Setelah backend dijalankan kembali, kedua laporan nyata di atas tetap berstatus `completed`
  melalui proxy frontend; readiness kembali 200. Startup ulang pada sesi ini lebih lambat
  daripada run benchmark, sehingga angka benchmark bukan batas maksimum startup.
- Validasi `docker compose config --quiet` lulus. Docker Engine tidak aktif; build/run container belum diverifikasi lokal. CI container yang ditambahkan belum dijalankan di GitHub.
- Ada dua deprecation warning dari dependency test FastAPI/Starlette; tidak menyebabkan kegagalan test.
