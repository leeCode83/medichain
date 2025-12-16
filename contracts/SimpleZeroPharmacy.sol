// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; // Adjusted path for common OZ versions, or utils if newer
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

// Contract mewarisi ERC1155, Ownable, ERC1155Holder, dan ReentrancyGuard
// ERC1155Holder dibutuhkan agar kontrak bisa menerima token (saat restock/mint ke diri sendiri)
contract SimpleZeroPharmacy is
    ERC1155,
    Ownable,
    ERC1155Holder,
    ReentrancyGuard
{
    // --- ENUM UNTUK ROLE (Peran) ---
    enum Role {
        None, // Default
        Factory, // Restock & Manajemen Dokter
        Doctor // Resep & Dispense
    }

    // --- MAPPING PERAN & MODIFIER OTORISASI ---
    mapping(address => Role) private userRoles;

    modifier onlyRole(Role requiredRole) {
        require(
            userRoles[msg.sender] == requiredRole,
            "Bukan peran yang dibutuhkan"
        );
        _;
    }

    // --- STRUKTUR DATA ---
    struct MedicineType {
        string name;
        string activeIngredient;
        uint256 totalBatchesMinted;
    }

    struct Prescription {
        uint256 medicineId; // Menggantikan tokenId (sekarang ID Jenis Obat)
        address patient;
        address doctor;
        string diagnosisIPFSHash;
        uint256 timestamp;
    }

    // --- PENYIMPANAN DATA ---
    // ID Token ERC-1155 = Index di array medicineTypes
    MedicineType[] public medicineTypes;
    Prescription[] public prescriptions;

    // Nama dan Simbol (ERC-1155 tidak memiliki ini secara native di standar core, tapi sering ditambahkan untuk UI)
    string public name = "SimplePharma";
    string public symbol = "SPH";

    // --- EVENT ---
    event RoleGranted(address indexed user, Role newRole);
    event MedicineCreated(uint256 indexed medicineId, string name);
    event MedicineRestocked(uint256 indexed medicineId, uint256 quantity);
    event PrescriptionIssued(
        uint256 indexed medicineId,
        address indexed patient,
        address indexed doctor,
        uint256 timestamp
    );

    // --- KONSTRUKTOR ---
    // ERC-1155 constructor menerima URI metadata (contoh: ipfs://...)
    // Kita set kosong dulu atau pointing ke sentralized API jika ada
    constructor() ERC1155("") Ownable(msg.sender) {
        userRoles[msg.sender] = Role.Factory;
        emit RoleGranted(msg.sender, Role.Factory);
    }

    // Fungsi wajib override untuk ERC1155Holder (supportsInterface sudah dihandle oleh ERC1155Holder/ERC1155)
    // Note: ERC1155 dan ERC1155Holder keduanya mengimplementasikan supportsInterface.
    // Kita perlu override untuk menyelesaikan konflik inheritance.
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155, ERC1155Holder) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // =============================================================
    // BAGIAN 1: MANAJEMEN PERAN (HANYA OWNER)
    // =============================================================

    function grantRole(address _user, Role _newRole) public onlyOwner {
        require(_user != address(0), "Invalid address");
        userRoles[_user] = _newRole;
        emit RoleGranted(_user, _newRole);
    }

    function revokeRole(address _user) public onlyOwner {
        userRoles[_user] = Role.None;
        emit RoleGranted(_user, Role.None);
    }

    function getUserRole(address _user) public view returns (Role) {
        return userRoles[_user];
    }

    // =============================================================
    // BAGIAN 2: PABRIK (FACTORY)
    // =============================================================

    // 1. Membuat Jenis Obat Baru (Master Data) -> ID Baru
    function createNewMedicineType(
        string memory _name,
        string memory _activeIngredient
    ) public onlyRole(Role.Factory) returns (uint256) {
        uint256 newId = medicineTypes.length;
        medicineTypes.push(MedicineType(_name, _activeIngredient, 0));
        emit MedicineCreated(newId, _name);
        return newId;
    }

    // 2. Restock / Produksi Obat
    // MINTING BATCH (Jauh lebih hemat gas daripada loop ERC-721)
    function restockMedicineBatch(
        uint256 _medicineId,
        uint256 _quantity
    ) public onlyRole(Role.Factory) {
        require(_medicineId < medicineTypes.length, "Invalid medicine ID");
        require(_quantity > 0, "Quantity must be > 0");

        // Update statistik
        medicineTypes[_medicineId].totalBatchesMinted += _quantity;

        // Mint sejumlah _quantity token dengan ID _medicineId ke kontrak ini
        _mint(address(this), _medicineId, _quantity, "");

        emit MedicineRestocked(_medicineId, _quantity);
    }

    // =============================================================
    // BAGIAN 3: DOKTER (DOCTOR) - INTI SISTEM
    // =============================================================

    // --- MAPPING TAMBAHAN UNTUK FRONTEND (TANPA INDEXER) ---
    // Menyimpan indeks resep di array 'prescriptions' untuk setiap user
    mapping(address => uint256[]) private patientPrescriptions;
    mapping(address => uint256[]) private doctorPrescriptions;

    function dispenseMedicine(
        uint256 _medicineId,
        address _patient,
        string memory _diagnosisIPFSHash
    ) public onlyRole(Role.Doctor) nonReentrant {
        require(_patient != address(0), "Invalid patient");
        require(bytes(_diagnosisIPFSHash).length > 0, "IPFS Hash required");
        require(_medicineId < medicineTypes.length, "Invalid medicine ID");

        // 1. CEK STOK (Balance kontrak)
        // ERC-1155 memiliki balanceOf built-in
        uint256 stock = balanceOf(address(this), _medicineId);
        require(stock > 0, "Stok obat habis (Out of Stock)");

        // 2. CATAT DIAGNOSIS & RESEP (Off-chain metadata reference on-chain)
        uint256 prescriptionIndex = prescriptions.length;
        prescriptions.push(
            Prescription(
                _medicineId,
                _patient,
                msg.sender,
                _diagnosisIPFSHash,
                block.timestamp
            )
        );

        // Update Mapping Frontend
        patientPrescriptions[_patient].push(prescriptionIndex);
        doctorPrescriptions[msg.sender].push(prescriptionIndex);

        // 3. TRANSFER TOKEN (Dari Kontrak ke Pasien)
        // Mengirim 1 unit obat
        _safeTransferFrom(address(this), _patient, _medicineId, 1, "");

        emit PrescriptionIssued(
            _medicineId,
            _patient,
            msg.sender,
            block.timestamp
        );
    }

    // =============================================================
    // BAGIAN 4: VIEW / READ-ONLY (UPDATE)
    // =============================================================

    // Ambil semua jenis obat (untuk Factory Dashboard & Dropdown)
    function getAllMedicineTypes() public view returns (MedicineType[] memory) {
        return medicineTypes;
    }

    // Ambil semua resep milik pasien tertentu
    function getPatientPrescriptions(
        address _patient
    ) public view returns (Prescription[] memory) {
        uint256[] memory indexes = patientPrescriptions[_patient];
        Prescription[] memory results = new Prescription[](indexes.length);

        for (uint256 i = 0; i < indexes.length; i++) {
            results[i] = prescriptions[indexes[i]];
        }
        return results;
    }

    // Ambil semua resep yang dikeluarkan oleh dokter tertentu
    function getDoctorPrescriptions(
        address _doctor
    ) public view returns (Prescription[] memory) {
        uint256[] memory indexes = doctorPrescriptions[_doctor];
        Prescription[] memory results = new Prescription[](indexes.length);

        for (uint256 i = 0; i < indexes.length; i++) {
            results[i] = prescriptions[indexes[i]];
        }
        return results;
    }

    // =============================================================
    // BAGIAN 5: VIEW / READ-ONLY (ORIGINAL)
    // =============================================================

    // Cek stok tersedia di kontrak
    function getAvailableStock(
        uint256 _medicineId
    ) public view returns (uint256) {
        return balanceOf(address(this), _medicineId);
    }

    function getMedicineTypeDetails(
        uint256 _medicineId
    ) public view returns (MedicineType memory) {
        require(_medicineId < medicineTypes.length, "Invalid index");
        return medicineTypes[_medicineId];
    }

    // Fungsi untuk mengubah URI metadata (hanya owner)
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }
}
