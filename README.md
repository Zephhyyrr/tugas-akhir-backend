# Tugas Akhir Sistem Informasi Surau Zam-Zam (Zam - Zam Financial Intellgince System) - Backend

Repositori ini berisi source code Backend untuk **Sistem Informasi Surau Zam-Zam (Zam - Zam Financial Intellgince System)**, yang dibangun sebagai bagian dari Tugas Akhir. Sistem ini dirancang menggunakan arsitektur **MVC / Layered Architecture** untuk agar struktur kode mudah dikelola, dan modular.

## 🚀 Teknologi yang Digunakan

Sistem ini dikembangkan menggunakan teknologi berikut:
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) **[Node.js](https://nodejs.org/)**
- ![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white) **[Express.js](https://expressjs.com/)**
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) **TypeScript**
- ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white) **[Prisma ORM](https://www.prisma.io/)**
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white) **[PostgreSQL](https://www.postgresql.org/)**
- ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=JSON%20web%20tokens&logoColor=white) **JSON Web Tokens**
- ![Nodemailer](https://img.shields.io/badge/Nodemailer-1890FF?style=flat) **Nodemailer**
- ![Multer](https://img.shields.io/badge/Multer-F24E1E?style=flat) **Multer**

## 📂 Struktur Direktori

Struktur folder proyek ini menggunakan pendekatan Layered Architecture yang memisahkan antara rute, logika bisnis, dan interaksi dengan database.

```text
backend/
├── prisma/            # Konfigurasi ORM dan Database
│   ├── schema.prisma  # Skema database Prisma
│   ├── migrations/    # Riwayat migrasi database
│   └── seed/          # Data seeder awal untuk database
└── src/
    ├── config         # Konfigurasi aplikasi dan database
    ├── controllers    # Logika penanganan request dan response HTTP
    ├── errors         # Penanganan error (Error Handler)
    ├── middlewares    # Middleware Express (Auth, rate limiter dll)
    ├── routes         # Definisi rute/endpoint API
    ├── services       # Business Logic layer
    ├── templates      # Template (misalnya untuk email html)
    ├── types          # Definisi tipe dan interface TypeScript
    ├── utils          # Fungsi utilitas bantuan (Helper functions)
    ├── validator      # Skema validasi request API (ExpressValidator)
    ├── app.ts         # Inisialisasi express apps
    └── server.ts      # Entry point untuk menjalankan server
```

## ✨ Fitur Utama

- **RESTful API**: Menyediakan endpoint API yang komprehensif untuk dikonsumsi oleh aplikasi Frontend.
- **Autentikasi & Otorisasi**: Mengamankan endpoint menggunakan JWT (JSON Web Tokens) dan pembagian role akses (Administrator & Superadmin).
- **Manajemen Keuangan**: Endpoint untuk mencatat uang masuk, uang keluar, serta menghasilkan laporan.
- **Prediksi Keuangan (Integration)**: Menyediakan data histori keuangan untuk proses peramalan (forecasting).
- **Manajemen Kurban**: Endpoint untuk mengelola kelompok kurban dan tipe kurban.
- **Validasi Data**: Menggunakan Express Validator untuk memastikan integritas data yang masuk.
- **Manajemen File**: Mengelola upload file gambar (contoh: profil) menggunakan Multer.
- **Notifikasi Email**: Mengirimkan pemberitahuan sistem melalui email menggunakan Nodemailer.

## 🛠️ Cara Instalasi & Menjalankan

Ikuti langkah-langkah di bawah ini untuk menjalankan project Backend di komputer Anda:

### 1. Persyaratan Sistem
Pastikan Anda sudah menginstal:
- **Node.js** (Disarankan versi 18 ke atas)
- **PostgreSQL** (Database lokal atau menggunakan layanan cloud database)

### 2. Clone Repositori
*(Jika digabung dalam satu repo, cukup buka folder Backend)*
```bash
git clone https://github.com/Zephhyyrr/zamfis-backend
cd zamfis-backend
```

### 3. Install Dependensi
```bash
npm install
```

### 4. Konfigurasi Environment
Buat file `.env` di folder utama backend berdasarkan template yang tersedia.
```bash
cp .env.example .env
```
Sesuaikan isi file `.env` khususnya untuk `DATABASE_URL` agar terhubung dengan PostgreSQL Anda.

### 5. Setup Database & Prisma
Jalankan perintah berikut untuk mensinkronisasi skema database dan membuat tipe Prisma Client.
```bash
npx prisma db push
npx prisma migrate dev
```
Opsional: Jalankan seeder untuk mengisi data awal (role, admin, dll).
```bash
npm run prisma:seed # atau sesuaikan perintah seed jika tersedia
```

### 6. Jalankan Mode Development
```bash
npm run dev
```
Server backend akan berjalan, secara default pada port `3000` atau sesuai konfigurasi di `.env`.
