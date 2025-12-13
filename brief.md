# Brief Project: Medichain (SimpleZeroPharmacy)

## 1. Tentang Platform
Platform ini adalah sistem manajemen rantai pasok farmasi sederhana berbasis Blockchain (Ethereum/EVM compatible). Sistem ini menggunakan teknologi **NFT (ERC721)** untuk merepresentasikan setiap unit obat secara unik, memastikan keaslian, dan melacak pergerakan obat dari pabrik hingga ke tangan pasien.

Tujuan utama platform ini adalah:
- **Transparansi Stok**: Memastikan stok obat tercatat secara immutable di blockchain.
- **Otoritas Terkontrol**: Hanya pihak berwenang (Pabrik & Dokter) yang dapat melakukan aksi kritis.
- **Rekam Medis Terdesentralisasi**: Setiap pemberian obat tercatat sebagai resep yang menghubungkan Dokter, Pasien, dan Obat secara permanen.

## 2. Fitur Utama

### A. Role-Based Access Control (RBAC)
Sistem membedakan pengguna berdasarkan peran mereka:
- **Owner (Admin)**: Mengelola peran user lain (memberikan/mencabut akses). 
- **Factory (Pabrik)**: Berwenang membuat jenis obat baru dan memproduksi (minting) stok obat.
- **Doctor (Dokter)**: Berwenang mendiagnosa pasien dan mengeluarkan obat (dispensing).

### B. Manajemen Inventaris Obat (Factory Role)
- **Master Data Obat**: Factory dapat mendaftarkan jenis obat baru (nama, bahan aktif).
- **Restock / Minting**: Factory dapat memproduksi batch obat baru. Setiap unit obat adalah NFT unik yang disimpan sementara di dalam "Gudang Smart Contract" sebelum diberikan ke pasien.

### C. Dispensing & Resep (Doctor Role)
Ini adalah fitur inti. Dokter dapat melakukan satu transaksi atomik yang mencakup:
1. **Cek Stok**: Memastikan obat tersedia di gudang kontrak.
2. **Transfer NFT**: Memindahkan kepemilikan token Obat dari Smart Contract ke Wallet Pasien.
3. **Pencatatan Resep**: Menyimpan data diagnosa (via IPFS Hash), waktu, dokter peresep, dan pasien penerima secara permanen di blockchain.

## 3. Alur Penggunaan (User Flow)

1. **Deployment & Setup**:
   - Contract dideploy. Deployer otomatis menjadi **Owner** dan **Factory**.
   - Owner mendaftarkan alamat wallet lain sebagai **Doctor** atau tambahan **Factory**.

2. **Produksi (Factory)**:
   - Factory membuat jenis obat (misal: ID 0 = "Paracetamol").
   - Factory melakukan *restock* 100 unit untuk ID 0.
   - 100 NFT dicetak dan disimpan di alamat Contract (Gudang).

3. **Pelayanan Medis (Dokter & Pasien)**:
   - Pasien datang berobat dan memberikan alamat wallet mereka.
   - Dokter melakukan diagnosa dan menentukan obat yang dibutuhkan.
   - Dokter memanggil fungsi `dispenseMedicine` dengan parameter:
     - ID Jenis Obat
     - Alamat Wallet Pasien
     - Hash Diagnosa (dari IPFS)
   - **Hasil**: Pasien menerima NFT Obat di wallet mereka sebagai bukti kepemilikan obat asli, dan resep tercatat di blockchain.

4. **Verifikasi**:
   - Pasien atau pihak ketiga dapat memverifikasi kepemilikan obat dan sejarah resep langsung dari blockchain.
