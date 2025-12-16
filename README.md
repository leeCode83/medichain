# Medichain (SimpleZeroPharmacy)

**Sistem Manajemen Rantai Pasok Farmasi Berbasis Blockchain (Lisk Sepolia Testnet).**

## 📋 Tentang Projek

**Medichain** adalah aplikasi terdesentralisasi (DApp) yang dirancang untuk meningkatkan transparansi, keamanan, dan efisiensi dalam distribusi obat-obatan. Dengan memanfaatkan teknologi blockchain, sistem ini memastikan setiap unit obat dapat dilacak dari pabrik hingga ke tangan pasien, mencegah peredaran obat palsu.

Projek ini dibangun di atas jaringan **Lisk Sepolia Testnet** dan menggunakan standar **ERC-1155** untuk pengelolaan token obat yang efisien (Batch Minting), serta integrasi **IPFS (Pinata)** untuk penyimpanan data resep yang aman dan terdesentralisasi.

## 🚀 Fitur Utama

### 🏭 Factory (Pabrik)
- **Registrasi Obat**: Mendaftarkan jenis obat baru ke dalam Smart Contract.
- **Produksi (Minting)**: Mencetak stok obat baru sebagai token ERC-1155.
- **Monitoring Stok**: Dasbor real-time untuk memantau ketersediaan obat on-chain.

### 👨‍⚕️ Doctor (Dokter)
- **Dispensing Obat**: Memberikan obat kepada pasien melalui transaksi blockchain yang transparan.
- **Resep Digital**: Mencatat diagnosa dan resep yang tersimpan permanen (Hash IPFS tercatat di on-chain).
- **Verifikasi Pasien**: Memastikan obat sampai ke pasien yang tepat.

### 🏥 Patient (Pasien)
- **Kepemilikan Sah**: Menerima token obat di wallet sebagai bukti kepemilikan.
- **Verifikasi Keaslian**: Cek orisinalitas obat langsung dari history blockchain.
- **Akses Riwayat**: Melihat riwayat resep dan pengobatan.

### 🔗 Integrasi Blockchain
- **Connect Wallet**: Dukungan multi-wallet menggunakan **RainbowKit** & **Wagmi**.
- **Smart Contract Interactive**: Seluruh logika bisnis dijalankan oleh kontrak cerdas `SimpleZeroPharmacy.sol`.
- **Decentralized Storage**: Metadata resep disimpan di IPFS via Pinata.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router), React 19, TypeScript.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/).
- **Blockchain Client**:
  - `wagmi`: React Hooks untuk Ethereum.
  - `viem`: Interface EVM low-level.
  - `@rainbow-me/rainbowkit`: UI Wallet Connection.
- **Smart Contract**: Solidity (ERC-1155 Standard).
- **Storage**: Pinata SDK (IPFS).

---

## 💻 Cara Menjalankan Projek

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di lingkungan lokal:

### 1. Clone Repository
```bash
git clone https://github.com/leeCode83/medichain.git
cd medichain
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Konfigurasi Environment Variable
Buat file `.env` di root direktori projek untuk konfigurasi Pinata (IPFS):

```env
PINATA_JWT=your_pinata_jwt_key
NEXT_PUBLIC_GATEWAY_URL=your_pinata_gateway_url
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka browser dan kunjungi [http://localhost:3000](http://localhost:3000).

---

## 📝 Status Pengembangan

Projek ini sedang dalam tahap pengembangan aktif untuk tujuan edukasi/kuliah.
- **Jaringan Target**: Lisk Sepolia Testnet.
- **Kontrak Cerdas**: Lokasi di `contracts/SimpleZeroPharmacy.sol`.
- **Catatan**: Pastikan Anda memiliki saldo Testnet ETH (Lisk Sepolia) di wallet Anda untuk berinteraksi dengan fitur-fitur transaksi (seperti Restock atau Dispense).

---

Dibuat dengan ❤️ oleh Tim Medichain.
