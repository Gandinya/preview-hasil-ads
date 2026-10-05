# preview-hasil-ads

Dashboard presentasi performa Shopee Ads untuk Collabsportstyle. HTML, CSS, dan JavaScript statis, tanpa dependensi runtime eksternal.

## Menjalankan

```sh
python -m http.server 8000 --directory dist
```

Buka http://localhost:8000. Situs juga bisa dihosting sebagai aset statis dari folder `dist`.

## Fitur

- Delapan metrik ringkasan, perbandingan periode tanggal 1–5 dan grafik ROAS, penjualan, serta klik.
- Best seller dengan foto ilustrasi, rincian produk, pencarian, dan pengurutan.
- Pergerakan produk, perubahan pemimpin penjualan, rekomendasi, dan cetak laporan.
- Mode data foto asli: seluruh nilai nol pada 29 September–5 Oktober 2026; data produk/pembanding tidak tersedia.
- Panduan CSV dan katalog foto, beserta template header yang dapat diunduh.

## Status data

**Data dan tiga gambar jersey adalah simulasi/ilustrasi, bukan data atau foto toko asli.** API Shopee belum terhubung. Website belum memiliki upload CSV, penyimpanan laporan, atau sinkronisasi otomatis. Data asli dikirim melalui percakapan untuk diproses dan diterbitkan sebagai perubahan berikutnya.

`dist/catalog.js` memetakan ID produk stabil ke `imageUrl`, `imageAlt`, dan penanda ilustrasi. URL gambar mendukung HTTPS atau aset lokal di `assets/`. Foto yang belum tersedia atau gagal dimuat mendapat keterangan, bukan diganti dengan foto produk lain.

## Format data yang diminta

Template angka: `dist/templates/laporan-iklan.csv`.

- `period_start`, `period_end`: tanggal ISO YYYY-MM-DD, periode sebanding.
- `product_id`: ID produk sebagai teks (jangan hilangkan nol awal).
- `product_name`, `impressions`, `clicks`, `orders`, `units_sold`.
- `ad_revenue`, `ad_spend`: angka rupiah utuh tanpa Rp atau pemisah ribuan.
- Penjualan aktual wajib berasal dari laporan atribusi iklan, bukan estimasi harga × unit.

Template foto: `dist/templates/katalog-produk.csv`.

- `product_id`, `sku`, `product_name`, `image_url`, `product_url`.
- `image_url` adalah URL gambar langsung; URL halaman produk tidak otomatis menjadi gambar.
- Alternatif: kirim berkas foto bernama sesuai ID produk/SKU. Pencocokan ID dilakukan secara tepat, bukan berdasarkan kemiripan nama.
- CSV Shopee asli boleh dikirim tanpa konversi dulu; pemetaan header dilakukan berdasarkan berkas yang benar-benar diterima.

## Batas implementasi simulasi

Grafik harian simulasi dibentuk dari bobot tetap. Penjualan simulasi dihitung dari harga contoh × unit. Keduanya harus diganti dengan data laporan asli sebelum dipakai untuk keputusan bisnis. Bulan/periode demo saat ini tetap Agustus–Oktober 2026; belum ada parser impor otomatis.

## Integrasi API di tahap berikutnya

Verifikasi dokumentasi resmi, akses aplikasi, otorisasi toko, dan izin endpoint produk/iklan sebelum implementasi. Tempatkan kredensial hanya di secret server. Jangan menyimpan token atau data laporan bisnis asli dalam repository publik. Integrasi memerlukan backend terautentikasi, penyimpanan data privat, penanganan refresh token, deduplikasi, serta pencatatan waktu sinkronisasi; semuanya belum diaktifkan di versi ini.

## Aset

Tiga foto jersey di `dist/assets/` dihasilkan dengan imagegen sebagai ilustrasi: retro marun/ivory, away hitam, dan training hijau. Bukan foto katalog Collabsportstyle. Ganti dengan foto produk asli menggunakan ID yang sama setelah berkas tersedia.

## Validasi

```sh
node --check dist/app.js
node --check dist/catalog.js
node tests/smoke.cjs
```

Smoke check menguji rendering dua periode, katalog foto, pencarian, dan mode sumber foto. Pemeriksaan ini bukan pengganti QA visual browser.
