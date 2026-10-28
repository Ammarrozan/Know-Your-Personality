// scenarios.js - 12 skenario aktif (cocok dengan 12 zona engine lama). Domain Dev 2.
// STATUS SEMENTARA: kantin_01 dan perpustakaan_01 sudah bertema SEKOLAH (batch 1).
// 10 skenario lain masih bertema kampus dan akan diganti di batch berikutnya.
// `skenarioMenunggu` BELUM dipakai: ID-nya belum punya zona di engine lama. Gabungkan
// ke `scenarios` saat engine baru Dev 1 sudah masuk (jangan sebelumnya, game bisa macet).
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
    title: "Antrean Kantin",
    narrative:
      "Bel istirahat berbunyi dan kantin langsung penuh. Antrean di depan stan mi ayam mengular sampai dekat pintu, dan aroma kuah panas memenuhi udara. Di belakangmu, seorang teman sekelas yang jarang mengobrol denganmu ikut mengantre. Dia melirik ke arahmu sambil tersenyum tipis.",
    options: [
      { text: "Aku menyapanya dan mengajaknya mengobrol selama kami mengantre.", type: "E" },
      { text: "Aku membalas senyumnya, lalu menunggu giliran sambil memandang menu.", type: "I" },
      { text: "Aku mengobrol sebentar kalau dia membuka percakapan lebih dulu.", type: "A" },
    ],
  },
  {
    id: "perpustakaan_01",
    title: "Rak Buku",
    narrative:
      "Kamu mencari buku referensi untuk tugas sejarah di rak paling ujung perpustakaan. Udara terasa sejuk dan hanya terdengar dengung kipas serta halaman yang dibalik. Di rak yang sama, seorang teman satu angkatan sedang mencari buku dan menoleh padamu sambil tersenyum. Sepertinya topik yang dia cari mirip dengan topikmu.",
    options: [
      { text: "Aku membalas senyumnya lalu kembali fokus mencari bukuku.", type: "I" },
      { text: "Aku mengajaknya berdiskusi tentang topik yang kami cari.", type: "E" },
      { text: "Aku menyapa dulu, lalu mengobrol bila dia melanjutkan percakapan.", type: "A" },
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

// Skenario sekolah yang menunggu engine baru Dev 1 (interior gedung). Belum diimpor di mana pun.
export const skenarioMenunggu = [
  {
    id: "kantin_02",
    title: "Meja Makan",
    narrative:
      "Jam istirahat siang, kantin penuh oleh obrolan dan bunyi sendok beradu dengan piring. Kamu membawa nampan berisi nasi dan es teh sambil mencari tempat duduk. Di meja panjang, teman-teman sekelas sedang tertawa sambil berbagi gorengan. Di dekat jendela, ada satu bangku kosong yang diterangi sinar matahari.",
    options: [
      { text: "Aku duduk di bangku dekat jendela dan makan dengan tenang.", type: "I" },
      { text: "Aku memilih sesuai suasana hatiku, meja panjang atau dekat jendela.", type: "A" },
      { text: "Aku bergabung di meja panjang dan ikut bercerita ramai.", type: "E" },
    ],
  },
  {
    id: "kantin_03",
    title: "Stan Minuman",
    narrative:
      "Kamu sampai di stan minuman saat ibu penjual sedang menyiapkan pesanan. Dia mengenal hampir semua siswa dan sering bercerita tentang hal-hal kecil di sekolah. Hari ini dia menyapamu dan bertanya bagaimana harimu. Antrean di belakangmu hanya tinggal dua orang.",
    options: [
      { text: "Aku menyesuaikan lamanya obrolan dengan suasana di stan itu.", type: "A" },
      { text: "Aku menjawab singkat, tersenyum, lalu membawa pesananku ke meja.", type: "I" },
      { text: "Aku bercerita panjang tentang hariku dan balik bertanya kabarnya.", type: "E" },
    ],
  },
  {
    id: "perpustakaan_02",
    title: "Meja Baca Bersama",
    narrative:
      "Di meja baca besar di tengah ruangan, sekelompok teman sedang berdiskusi pelan untuk persiapan ulangan. Salah satu dari mereka melihatmu dan menggeser kursi, mengisyaratkan tempat kosong di sebelahnya. Kamu juga perlu belajar untuk ulangan yang sama. Suasana perpustakaan sore itu hangat dan tenang.",
    options: [
      { text: "Aku bergabung sebentar untuk bertukar catatan, lalu belajar sendiri.", type: "A" },
      { text: "Aku duduk bersama mereka dan ikut membahas soal bersama-sama.", type: "E" },
      { text: "Aku berterima kasih lalu belajar di meja kecil di sudut.", type: "I" },
    ],
  },
  {
    id: "perpustakaan_03",
    title: "Meja Petugas",
    narrative:
      "Kamu ingin meminjam dua buku di meja petugas perpustakaan. Petugas tampak sibuk menyusun kartu, tetapi tersenyum begitu melihatmu datang. Dia bertanya buku itu untuk keperluan apa dan menawarkan rekomendasi buku lain yang mungkin kamu suka. Di belakangmu tidak ada siswa lain yang mengantre.",
    options: [
      { text: "Aku bercerita tentang tugasku dan bertanya rekomendasi buku lainnya.", type: "E" },
      { text: "Aku menjawab singkat, mencatat rekomendasinya, lalu meminjam bukuku.", type: "I" },
      { text: "Aku mengobrol sebentar, lalu menyesuaikan dengan kesibukan petugas.", type: "A" },
    ],
  },
];
