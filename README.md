# Network QoS Calculator

Aplikasi web modern untuk menghitung dan menganalisis **Quality of Service (QoS)** pada jaringan menggunakan data dari Wireshark. Dilengkapi dengan kategori TIPHON (standar telekomunikasi Indonesia) dan visualisasi hasil dalam bentuk PNG yang siap download.

---

## 🎯 Fitur Utama

### 1. **Perhitungan QoS Terpisah**
- ✅ **Delay** — Rata-rata waktu tempuh paket
- ✅ **Jitter** — Variasi perubahan delay antar paket
- ✅ **Throughput** — Kecepatan data yang terukur (Kbits/s)
- ✅ **Packet Loss** — Persentase paket yang hilang

### 2. **Import Otomatis dari CSV Wireshark**
- Drag & drop file CSV dari Wireshark
- Auto-fill untuk Delay dan Jitter
- Validasi format dan error handling
- Status feedback yang jelas

### 3. **Kategori TIPHON**
Standar telekomunikasi Indonesia dengan 5 level indeks:
- 🟢 **Level 4** — Sangat Bagus/Baik
- 🔵 **Level 3** — Bagus/Cukup
- 🟡 **Level 2** — Sedang/Cukup
- 🟠 **Level 1** — Kurang Baik
- 🔴 **Level 0** — Buruk

### 4. **Visualisasi Proses Perhitungan**
- Step-by-step calculation yang mudah dipahami
- Format angka sesuai locale Indonesia
- Menampilkan kategori TIPHON untuk setiap hasil

### 5. **Download Hasil**
- Download individual hasil sebagai PNG
- Download semua hasil (1-4 kartu) dalam satu file
- Watermark "Network QoS Calculator · Wireshark Analysis"
- Resolusi tinggi (2x scale) untuk kualitas cetak

### 6. **Responsif & Interaktif**
- Popover dengan rumus matematika
- Toggle untuk show/hide kategori TIPHON
- Keyboard shortcuts (Enter untuk calculate)
- Touch-friendly dan mobile responsive

---

## 📋 Rumus Perhitungan

### **Delay (ms)**
```
Delay = (Total Delay) / (Jumlah Paket) × 1000
```
- **Sumber Data**: Total delta time dari CSV Wireshark atau manual
- **Satuan Hasil**: Milidetik (ms)

### **Jitter (ms)**
```
Jitter = (Total Jitter) / (Jumlah Paket − 1) × 1000
```
- **Total Jitter**: Σ dari |ΔT[n] − ΔT[n-1]| (variasi antar delta time)
- **Satuan Hasil**: Milidetik (ms)

### **Throughput (Kbits/s)**
```
Throughput = (Total Bytes / Time Span) × 8 / 1000
```
- **Total Bytes**: Dari Capture File Properties → Bytes (Displayed)
- **Time Span**: Selisih waktu paket pertama dan terakhir (detik)
- **Satuan Hasil**: Kilobit per detik (Kbits/s)

### **Packet Loss (%)**
```
Packet Loss = (Paket Hilang / Paket Terkirim) × 100
```
- **Paket Terkirim**: Total paket captured
- **Paket Hilang**: Gunakan filter `tcp.analysis.lost_segment` di Wireshark
- **Satuan Hasil**: Persen (%)

---

## 🚀 Cara Menggunakan

### **Setup Awal**
1. Letakkan folder di folder `htdocs` (untuk XAMPP)
2. Akses via browser: `http://localhost/QoS%20Calculator`

### **Metode 1: Import CSV dari Wireshark (Otomatis)**
1. **Capture traffic di Wireshark**
2. **Export sebagai CSV**:
   - Menu: File → Export Packet Dissections → As CSV
3. **Upload ke aplikasi**:
   - Drag & drop ke area upload atau klik "Pilih File CSV"
   - Delay & Jitter akan otomatis terisi
   - Klik "Hitung Delay" dan "Hitung Jitter"

### **Metode 2: Input Manual**
1. **Delay Card**:
   - Total Delay: Hitung dari capture atau masukkan manual
   - Jumlah Paket: Dari Statistics → Summary di Wireshark

2. **Jitter Card**:
   - Total Jitter: Hitung variasi delta time
   - Jumlah Paket: Sama dengan Delay

3. **Throughput Card**:
   - Total Bytes: Dari Capture File Properties → Bytes (Displayed)
   - Time Span: Dari Capture File Properties → Time span (detik)

4. **Packet Loss Card**:
   - Paket Terkirim: Total paket diterima
   - Paket Hilang: Filter dengan `tcp.analysis.lost_segment`

### **Download Hasil**
- Klik **"⬇ Download Hasil"** untuk satu kartu
- Klik **"⬇ Download Semua Hasil"** untuk semua kartu sekaligus
- File PNG siap untuk laporan atau presentasi

---

## 📊 Kategori TIPHON

### **Delay (ms)**
| Indeks | Kategori | Range | Status |
|--------|----------|-------|--------|
| 4 | Sangat Bagus | < 150 | 🟢 |
| 3 | Bagus | 150 - 300 | 🔵 |
| 2 | Sedang | 300 - 450 | 🟡 |
| 1 | Buruk | > 450 | 🟠 |

### **Jitter (ms)**
| Indeks | Kategori | Range | Status |
|--------|----------|-------|--------|
| 4 | Sangat Bagus | = 0 | 🟢 |
| 3 | Bagus | 0 - 75 | 🔵 |
| 2 | Sedang | 75 - 125 | 🟡 |
| 1 | Buruk | > 125 | 🟠 |

### **Throughput (Kbits/s)**
| Indeks | Kategori | Range | Status |
|--------|----------|-------|--------|
| 4 | Sangat Baik | > 2100 | 🟢 |
| 3 | Baik | 1200 - 2100 | 🔵 |
| 2 | Cukup | 700 - 1200 | 🟡 |
| 1 | Kurang Baik | 338 - 700 | 🟠 |
| 0 | Buruk | < 338 | 🔴 |

### **Packet Loss (%)**
| Indeks | Kategori | Range | Status |
|--------|----------|-------|--------|
| 4 | Sangat Bagus | ≤ 2% | 🟢 |
| 3 | Bagus | 2 - 14% | 🔵 |
| 2 | Sedang | 14 - 24% | 🟡 |
| 1 | Buruk | > 24% | 🟠 |

---

## 📁 Struktur File

```
QoS Calculator/
├── index.html                      # Struktur HTML utama
├── assets/
│   ├── css/
│   │   └── style.css              # Styling & animasi
│   └── js/
│       ├── main.js                # Popover & download logic
│       ├── calculator.js          # Fungsi perhitungan QoS
│       └── csv-parser.js          # CSV parser Wireshark
├── README.md                       # Dokumentasi ini
└── KODE_LENGKAP.md                # Semua kode dalam satu file
```

---

## 🛠 Teknologi

- **HTML5** — Struktur semantic
- **CSS3** — Grid, Flexbox, Animasi, Custom Properties
- **Vanilla JavaScript** — No external dependencies
- **Canvas API** — Untuk rendering PNG
- **Bootstrap 5** — Icons & utilities
- **Google Fonts** — DM Sans, DM Mono, DM Serif Display

---

## 🎨 Design Features

### **UI/UX**
- Color-coded cards untuk setiap metrik
- Responsive 2-column grid (desktop) → 1-column (mobile)
- Smooth animations & transitions
- Clear typography hierarchy

### **Interaktivity**
- **Info Buttons**: Hover/tap untuk lihat rumus matematika
- **Auto-fill Badge**: Indikasi field terisi dari CSV
- **Error Messages**: Validasi input yang informatif
- **Keyboard Support**: Enter untuk calculate
- **TIPHON Toggle**: Show/hide kategori status

### **Download System**
- Canvas-based rendering untuk PNG
- Individual atau bulk download
- Watermark profesional
- Deskriptif filename (delay.png, jitter.png, dll)

---

## ✅ Validasi Input

| Field | Min | Persyaratan |
|-------|-----|------------|
| Total Delay | 0 | Harus > 0 |
| Jumlah Paket | 1 | Harus ≥ 1 |
| Total Jitter | 0 | ≥ 0, Paket ≥ 2 |
| Total Bytes | 0 | Harus > 0 |
| Time Span | 0 | Harus > 0 |
| Paket Terkirim | 1 | Harus > 0 |
| Paket Hilang | 0 | ≥ 0, ≤ Terkirim |

---

## 📝 Contoh Use Case

### Skenario: Analisis Kualitas Video Call

**Langkah:**
1. Capture traffic video call dengan Wireshark (10 menit)
2. Export sebagai CSV
3. Upload ke aplikasi
4. **Hasil otomatis:**
   - Delay: 45ms (🟢 Level 4 - Sangat Bagus)
   - Jitter: 12ms (🟢 Level 4 - Bagus)
   - Throughput: 2500 Kbits/s (🟢 Level 4 - Sangat Baik)
   - Packet Loss: 0.5% (🟢 Level 4 - Sangat Bagus)
5. Download laporan visual untuk presentasi/dokumentasi

---

## 🐛 Troubleshooting

### **CSV tidak terdeteksi**
- ✓ Pastikan kolom "Time" ada di header
- ✓ Format CSV sesuai export Wireshark
- ✓ Minimal 2 paket dalam data

### **Hasil tidak muncul**
- ✓ Validasi input sudah bernilai > 0
- ✓ Buka console browser (F12) untuk error
- ✓ Reload halaman jika ada issue

### **Download PNG gagal**
- ✓ Pastikan hasil sudah dihitung
- ✓ Gunakan browser modern (Chrome, Firefox, Safari, Edge)
- ✓ Clear cache browser jika perlu

---

## 💡 Tips & Best Practices

- 📊 Capture minimal 100+ paket untuk hasil akurat
- 🔍 Gunakan filter Wireshark untuk traffic spesifik
- 📱 Responsive design cocok untuk laptop & tablet
- 🌐 Bisa run offline setelah di-load (no internet needed)
- 📈 TIPHON categories mengikuti standar industri telekomunikasi Indonesia

---

## 📄 License

Open Source - Bebas digunakan untuk keperluan pendidikan, riset, dan bisnis.

---

**Version**: 1.0.0  
**Last Updated**: 2026-04-13  
**Status**: Production Ready ✅