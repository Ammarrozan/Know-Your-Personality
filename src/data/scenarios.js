// scenarios.js - 12 skenario, satu per zona di peta. Domain Dev 2.
// Skema: { id, title, narrative, options: [{ text, type }] }, dengan type "I" | "E" | "A".
// id HARUS identik dengan id zona di src/game/mapData.js.
//
// Pedoman penulisan (SRS 5.2: konten netral, tidak ada tipe yang lebih baik):
// - Tiap skenario punya tepat 3 opsi: satu I, satu E, satu A.
// - Ketiga opsi sama menarik secara sosial dan sama panjangnya (sekitar 8-11 kata).
// - Opsi A berarti menyesuaikan diri dengan situasi atau energi, bukan ragu-ragu.
// - Hindari kata bernilai (malu, takut, cuek, sok, lebih baik, benar, salah).
// - Urutan opsi di data ini sengaja bervariasi; DialogueBox mengacaknya lagi saat tampil.

export const scenarios = [
  {
    id: "kantin_01",
    title: "Kantin",
    narrative:
      "Jam istirahat siang, kantin ramai oleh obrolan dan bunyi sendok beradu dengan piring. Kamu membawa nampan makan siang sambil mencari tempat duduk. Di meja panjang, teman-teman satu angkatan sedang tertawa. Di dekat jendela, ada satu bangku kosong yang tenang.",
    options: [
      { text: "Aku duduk di bangku pojok dan makan dengan tenang.", type: "I" },
      { text: "Aku bergabung di meja panjang dan ikut bercerita ramai.", type: "E" },
      { text: "Aku memilih sesuai suasana hatiku: meja panjang atau pojok.", type: "A" },
    ],
  },
  {
    id: "perpustakaan_01",
    title: "Perpustakaan",
    narrative:
      "Perpustakaan lantai dua cukup lengang sore ini, hanya terdengar halaman buku dibalik dan dengung kipas. Kamu punya tugas yang harus dikumpulkan lusa. Di meja diskusi dekat rak, beberapa teman sekelas sedang membahas tugas yang sama dan melambaikan tangan padamu.",
    options: [
      { text: "Aku pindah ke meja mereka dan membahas tugas bersama.", type: "E" },
      { text: "Aku belajar sendiri dulu, lalu bergabung setelah punya bahan.", type: "A" },
      { text: "Aku tetap belajar sendiri dan bertanya kepada mereka bila perlu.", type: "I" },
    ],
  },
  {
    id: "kelas_01",
    title: "Ruang Kelas",
    narrative:
      "Dosen menutup slide dan membuka sesi diskusi tentang topik yang baru saja dibahas. Kelas hening sejenak, lalu beberapa orang mulai saling pandang. Kamu sudah punya gambaran kasar jawabannya di kepala.",
    options: [
      { text: "Aku berbicara jika topiknya dekat denganku, selebihnya menyimak.", type: "A" },
      { text: "Aku menyusun pendapatku dulu, lalu bicara setelah merasa siap.", type: "I" },
      { text: "Aku langsung mengangkat tangan dan berpikir sambil berbicara.", type: "E" },
    ],
  },
  {
    id: "laboratorium_01",
    title: "Lab Komputer",
    narrative:
      "Lab komputer penuh dengan dengung kipas dan ketukan keyboard. Program yang kamu tulis untuk praktikum tiba-tiba menampilkan pesan error yang belum pernah kamu lihat. Teman-teman di sebelahmu masih sibuk dengan layar masing-masing.",
    options: [
      { text: "Aku langsung bertanya ke teman sekitar dan mencari solusi bersama.", type: "E" },
      { text: "Aku menelusuri pesan error itu sendiri dengan fokus penuh.", type: "I" },
      { text: "Aku bertanya pada satu teman yang paling kukenal di sebelahku.", type: "A" },
    ],
  },
  {
    id: "papan_pengumuman_01",
    title: "Papan Pengumuman",
    narrative:
      "Papan pengumuman penuh kertas warna-warni yang ditempel bertumpuk. Satu poster baru menarik perhatianmu: pendaftaran panitia acara kampus, terbuka untuk siapa saja. Dua mahasiswa lain berdiri di sampingmu dan ikut membacanya sambil berbincang pelan.",
    options: [
      { text: "Aku ikut mengobrol dengan mereka dan mengajak mendaftar bersama.", type: "E" },
      { text: "Aku memotret poster itu dan memikirkannya dengan tenang nanti.", type: "I" },
      { text: "Aku ikut menanggapi obrolan mereka, lalu menimbangnya sendiri nanti.", type: "A" },
    ],
  },
  {
    id: "taman_01",
    title: "Taman Kampus",
    narrative:
      "Kelas berikutnya baru mulai tiga puluh menit lagi. Taman kampus terasa teduh, dengan angin pelan dan kicau burung di antara pepohonan. Beberapa kelompok kecil duduk di rumput, dan sebagian bangku masih kosong.",
    options: [
      { text: "Aku santai saja: mengobrol kalau ada kenalan, menyendiri kalau tidak.", type: "A" },
      { text: "Aku mencari bangku teduh dan menikmati waktu sendirian.", type: "I" },
      { text: "Aku menghampiri kelompok yang sedang tertawa dan ikut mengobrol.", type: "E" },
    ],
  },
  {
    id: "sekretariat_ukm_01",
    title: "Sekretariat UKM",
    narrative:
      "Sekretariat UKM cukup ramai sore ini; ada yang melipat kertas, ada yang menata kursi, ada yang berbincang tentang acara akhir bulan. Ketua UKM menyapamu dan bilang masih ada beberapa pekerjaan yang bisa dibagi. Kamu boleh memilih bagian yang paling cocok untukmu.",
    options: [
      { text: "Aku mengambil tugas yang dikerjakan berdua atau bertiga.", type: "A" },
      { text: "Aku mengambil tugas yang membuatku berbicara dengan banyak orang.", type: "E" },
      { text: "Aku mengambil tugas yang bisa kukerjakan sendiri dengan tenang.", type: "I" },
    ],
  },
  {
    id: "lapangan_01",
    title: "Lapangan",
    narrative:
      "Sore hari, cahaya matahari di lapangan mulai melembut dan udara terasa hangat. Sekelompok mahasiswa bermain voli sambil sesekali berseru riang. Salah satu dari mereka melambai ke arahmu dan menawarkan tempat untuk satu pemain lagi.",
    options: [
      { text: "Aku menolak dengan ramah dan berolahraga sendiri di pinggir lapangan.", type: "I" },
      { text: "Aku bermain beberapa menit, lalu menonton sambil mengobrol santai.", type: "A" },
      { text: "Aku langsung bergabung dan ikut bersorak riang bersama satu tim.", type: "E" },
    ],
  },
  {
    id: "koridor_01",
    title: "Koridor",
    narrative:
      "Koridor gedung utama dipenuhi mahasiswa yang berpindah kelas, dengan langkah kaki dan obrolan yang bersahutan. Seorang teman lama dari semester lalu menyapamu dari ujung lorong dan tampak senang bertemu. Kelasmu berikutnya baru dimulai sepuluh menit lagi.",
    options: [
      { text: "Aku mengobrol panjang dengannya sampai tiba waktu masuk kelas.", type: "E" },
      { text: "Aku mengobrol sebentar, lalu menyesuaikan dengan energiku.", type: "A" },
      { text: "Aku menyapa sebentar lalu mencari sudut tenang sebelum kelas.", type: "I" },
    ],
  },
  {
    id: "gerbang_01",
    title: "Gerbang",
    narrative:
      "Kuliah hari ini selesai, dan langit di depan gerbang kampus mulai berwarna jingga. Sekelompok teman mengajakmu nongkrong di warung dekat situ sebelum pulang. Motor-motor lewat pelan di sekeliling kalian.",
    options: [
      { text: "Aku ikut kalau badanku masih segar, kalau tidak aku pulang.", type: "A" },
      { text: "Aku ikut nongkrong dan menutup hari bersama teman-teman.", type: "E" },
      { text: "Aku pamit pulang dan memakai sore itu untuk beristirahat.", type: "I" },
    ],
  },
  {
    id: "parkiran_01",
    title: "Parkiran",
    narrative:
      "Hujan turun tiba-tiba saat kamu sampai di parkiran, dan atapnya penuh suara rintik yang deras. Udara terasa sejuk dan motor-motor berjejer rapat. Beberapa teman satu fakultas berteduh di dekat tiang sambil mengobrol santai menunggu hujan reda.",
    options: [
      { text: "Aku berteduh sendiri sambil memakai earphone sampai hujan reda.", type: "I" },
      { text: "Aku menyapa dulu, lalu memilih mengobrol atau mendengarkan musik.", type: "A" },
      { text: "Aku bergabung dengan mereka dan mengobrol sampai hujan reda.", type: "E" },
    ],
  },
  {
    id: "ruang_dosen_01",
    title: "Ruang Dosen",
    narrative:
      "Ruang dosen terasa sunyi, hanya terdengar ketikan keyboard dan suara sendok mengaduk teh dari meja pojok. Kamu punya jadwal bimbingan singkat tentang tugasmu. Dosen mempersilakanmu duduk dan bertanya bagaimana perkembangannya.",
    options: [
      { text: "Aku menyiapkan poin utama, lalu mengembangkannya lewat obrolan.", type: "A" },
      { text: "Aku langsung menjelaskan dengan antusias sambil berdiskusi dua arah.", type: "E" },
      { text: "Aku menyiapkan catatan tertulis dan menjelaskan secara runtut.", type: "I" },
    ],
  },
];
