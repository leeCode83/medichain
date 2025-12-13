# Medichain (SimpleZeroPharmacy)
A Blockchain-based Pharmaceutical Supply Chain Management System.

## 📋 Tentang Projek

**Medichain** adalah platform manajemen rantai pasok farmasi sederhana yang dibangun di atas teknologi Blockchain (EVM Compatible). Sistem ini bertujuan untuk meningkatkan transparansi, keamanan, dan efisiensi dalam distribusi obat-obatan.

Dengan memanfaatkan standar **ERC-1155 Interface**, setiap jenis obat direpresentasikan sebagai token unik yang dapat dilacak pergerakannya dari pabrik (Factory) hingga ke tangan pasien (Patient), memastikan keaslian obat dan mencegah pemalsuan.

### Tujuan Utama
- **Transparansi Stok**: Pencatatan stok yang immutable di blockchain.
- **Keamanan Rantai Pasok**: Mencegah obat palsu masuk ke dalam sistem.
- **Rekam Medis Terdesentralisasi**: Integrasi resep digital yang menghubungkan Dokter, Pasien, dan Obat.

---

## 🚀 Fitur Utama

### 🏭 Factory (Pabrik)
- **Registrasi Obat**: Mendaftarkan jenis obat baru ke dalam smart contract.
- **Manajemen Produksi**: Melakukan *minting* (produksi) batch obat baru.
- **Monitoring Stok**: Memantau stok global yang tersedia di gudang smart contract.

### 👨‍⚕️ Doctor (Dokter)
- **Dispensing Obat**: Memberikan obat kepada pasien melalui transaksi blockchain.
- **Pencatatan Resep**: Membuat resep digital yang mencakup diagnosa (IPFS) dan data obat.
- **Riwayat Pasien**: Melihat histori pengambilan obat pasien.

### 🏥 Patient (Pasien)
- **Kepemilikan Obat**: Menerima token obat sebagai bukti kepemilikan yang sah.
- **Verifikasi**: Memverifikasi keaslian obat dan melihat riwayat resep mereka sendiri.

---

## 📄 Halaman Aplikasi

Berikut adalah struktur halaman yang tersedia dalam aplikasi ini:

| Halaman | Rute URL | Deskripsi |
| :--- | :--- | :--- |
| **Home** | `/` | Halaman landing page yang menjelaskan platform. |
| **Factory Dashboard** | `/dashboard/factory` | Pusat kontrol untuk pabrik (Produksi & manajemen stok). |
| **Doctor Dashboard** | `/dashboard/doctor` | Antarmuka dokter untuk diagnosa & dispensing obat. |
| **Patient Dashboard** | `/dashboard/patient` | Halaman pasien untuk melihat obat dan resep mereka. |
| **Medicines Catalog** | `/medicines` | Katalog publik obat-obatan yang terdaftar. |

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), React, TypeScript.
- **UI Framework**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/).
- **Blockchain**: Solidity (Smart Contract), Ethereum/Polygon (Target Network).
- **Libraries**: `lucide-react` (Icons), `recharts` (Charts), `sonner` (Notifications).

---

## 💻 Cara Menjalankan Projek

Ikuti langkah-langkah berikut untuk menjalankan projek di komputer lokal Anda:

### Prasyarat
- Node.js (Versi 18 atau terbaru)
- npm / yarn / pnpm

### Langkah Instalasi

1.  **Clone Repository**
    ```bash
    git clone https://github.com/leeCode83/medichain.git
    cd medichain-wkwk
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # atau
    yarn install
    ```

3.  **Jalankan Development Server**
    ```bash
    npm run dev
    ```

4.  **Buka Aplikasi**
    Buka browser dan kunjungi [http://localhost:3000](http://localhost:3000).

---

## 📝 Catatan Penting
- Saat ini, interaksi blockchain pada frontend masih menggunakan **Mock Data** (Simulasi) untuk keperluan UI/UX Prototyping.
- Logika Smart Contract (`contracts/SimpleZeroPharmacy.sol`) sudah siap untuk di-deploy ke jaringan testnet.

---

Dibuat dengan ❤️ oleh Tim Medichain.
