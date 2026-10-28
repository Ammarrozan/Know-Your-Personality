// scenarios.js - 20 skenario bertema sekolah (SMA/SMK), satu per Titik Interaksi (TI). Domain Dev 2.
// Skema: { id, title, narrative, options: [{ text, type }] }, dengan type "I" | "E" | "A".
// id HARUS identik dengan TI_IDS di src/game/mapData.js (hasil generate Dev 1).
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
    id: "perpustakaan_02",
    title: "Meja Baca Bersama",
    narrative:
      "Di meja baca besar di tengah ruangan, sekelompok teman sedang berdiskusi pelan untuk persiapan ulangan. Seorang dari mereka melihatmu dan menggeser kursi, mengisyaratkan tempat kosong di sebelahnya. Kamu juga perlu belajar untuk ulangan yang sama. Suasana perpustakaan sore itu hangat dan tenang.",
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
  {
    id: "kelas_01",
    title: "Memilih Bangku",
    narrative:
      "Pagi ini guru mengumumkan bahwa kalian boleh memilih tempat duduk sendiri untuk sebulan ke depan. Ruang kelas masih setengah kosong, dengan sinar matahari masuk dari jendela dan bau spidol papan tulis. Bangku depan dan bangku belakang sama-sama masih tersedia. Beberapa teman sudah duduk berkelompok di tengah ruangan.",
    options: [
      { text: "Aku memilih bangku sudut dekat jendela yang jauh dari keramaian.", type: "I" },
      { text: "Aku memilih tempat yang pas dengan suasana hatiku hari itu.", type: "A" },
      { text: "Aku duduk di tengah dekat teman-teman supaya mudah mengobrol.", type: "E" },
    ],
  },
  {
    id: "kelas_02",
    title: "Papan Tulis",
    narrative:
      "Guru menulis satu soal di papan tulis dan bertanya siapa yang mau menjelaskan jawabannya di depan. Kelas hening sejenak, hanya terdengar kipas angin dan pensil yang diketuk pelan. Kamu sudah punya gambaran jawabannya, dan guru menoleh ke arah barisanmu.",
    options: [
      { text: "Aku maju bila yakin jawabanku, atau menunggu teman lain mencoba dulu.", type: "A" },
      { text: "Aku mengangkat tangan dan maju sambil mengajak teman ikut berdiskusi.", type: "E" },
      { text: "Aku menyusun jawaban di buku dulu, lalu maju menjelaskan runtut.", type: "I" },
    ],
  },
  {
    id: "kelas_03",
    title: "Meja Kelompok",
    narrative:
      "Guru membagi kelas menjadi kelompok berempat untuk membuat poster presentasi. Di mejamu, spidol dan kertas karton sudah dibagikan, tetapi belum ada yang memulai. Semua anggota saling pandang sambil menunggu seseorang mengambil keputusan pertama.",
    options: [
      { text: "Aku menawarkan diri mengerjakan bagian desain yang bisa kukerjakan sendiri.", type: "I" },
      { text: "Aku langsung membagi tugas dan memimpin jalannya diskusi kelompok.", type: "E" },
      { text: "Aku mulai dengan satu usul, lalu mengikuti arah diskusi kelompok.", type: "A" },
    ],
  },
  {
    id: "laboratorium_01",
    title: "Komputer Lab",
    narrative:
      "Lab komputer penuh dengan dengung kipas dan ketukan keyboard. Program yang kamu tulis untuk tugas praktik tiba-tiba menampilkan pesan error yang belum pernah kamu lihat. Teman-teman di sebelahmu masih sibuk dengan layar masing-masing.",
    options: [
      { text: "Aku langsung bertanya ke teman sekitar dan mencari solusi bersama.", type: "E" },
      { text: "Aku menelusuri pesan error itu sendiri dengan fokus penuh.", type: "I" },
      { text: "Aku bertanya pada satu teman yang paling kukenal di sebelahku.", type: "A" },
    ],
  },
  {
    id: "laboratorium_02",
    title: "Meja Praktik",
    narrative:
      "Guru meminta kalian berpasangan untuk praktik memasang komponen pada satu unit komputer. Meja praktik penuh kabel dan obeng kecil yang tertata rapi. Teman satu pasanganmu adalah seseorang yang belum begitu kamu kenal. Di sekeliling kalian, pasangan lain sudah mulai bekerja sambil berbincang.",
    options: [
      { text: "Aku mengikuti irama pasanganku: banyak bicara atau fokus bekerja.", type: "A" },
      { text: "Aku mengerjakan bagianku dengan fokus dan berbicara seperlunya saja.", type: "I" },
      { text: "Aku membuka obrolan dulu, lalu kami membagi pekerjaan sambil bercanda.", type: "E" },
    ],
  },
  {
    id: "laboratorium_03",
    title: "Papan Peran Tim",
    narrative:
      "Di dinding lab tertempel papan berisi daftar peran untuk proyek tim: pemimpin tim, penyaji presentasi, penulis kode, dan penguji. Guru meminta setiap tim menentukan pembagian peran sebelum bel berbunyi. Anggota timmu mulai melirik daftar itu satu per satu.",
    options: [
      { text: "Aku mengambil peran penulis kode dan bekerja di balik layar.", type: "I" },
      { text: "Aku mengambil peran yang masih kosong setelah teman lain memilih.", type: "A" },
      { text: "Aku mengambil peran penyaji presentasi dan berbicara di depan kelas.", type: "E" },
    ],
  },
  {
    id: "lapangan_01",
    title: "Lapangan",
    narrative:
      "Jam pelajaran terakhir sudah usai dan cahaya matahari di lapangan mulai melembut. Sekelompok teman sedang bermain voli sambil sesekali berseru riang. Seorang dari mereka melambai ke arahmu dan menawarkan tempat untuk satu pemain lagi.",
    options: [
      { text: "Aku menolak dengan ramah dan berlari santai sendiri di pinggir lapangan.", type: "I" },
      { text: "Aku bermain beberapa menit, lalu menonton sambil mengobrol santai.", type: "A" },
      { text: "Aku langsung bergabung dan ikut bersorak riang bersama satu tim.", type: "E" },
    ],
  },
  {
    id: "taman_01",
    title: "Bangku Taman",
    narrative:
      "Istirahat kedua masih tersisa tiga puluh menit. Taman sekolah terasa teduh, dengan angin pelan dan kicau burung di antara pepohonan. Beberapa kelompok kecil duduk di rumput, dan sebagian bangku masih kosong.",
    options: [
      { text: "Aku santai saja: mengobrol kalau ada kenalan, menyendiri kalau tidak.", type: "A" },
      { text: "Aku mencari bangku teduh dan menikmati waktu sendirian.", type: "I" },
      { text: "Aku menghampiri kelompok yang sedang tertawa dan ikut mengobrol.", type: "E" },
    ],
  },
  {
    id: "gerbang_01",
    title: "Gerbang Sekolah",
    narrative:
      "Bel pulang sudah berbunyi dan siswa mengalir keluar melewati gerbang. Temanmu yang biasa pulang bersamamu mengabari bahwa dia masih piket kelas dan baru selesai sekitar dua puluh menit lagi. Langit mulai jingga dan angin sore terasa sejuk. Beberapa siswa lain juga menunggu jemputan di dekat gerbang.",
    options: [
      { text: "Aku mengobrol dengan siswa lain yang juga sedang menunggu.", type: "E" },
      { text: "Aku mulai dengan musik, lalu mengobrol bila ada yang menyapaku.", type: "A" },
      { text: "Aku menunggu sendiri sambil mendengarkan musik atau membaca.", type: "I" },
    ],
  },
  {
    id: "parkiran_01",
    title: "Parkiran",
    narrative:
      "Bel pulang baru saja berbunyi dan kamu berjalan ke parkiran untuk mengambil sepedamu. Sekelompok teman sekelas berkumpul di dekat deretan motor sambil membahas rencana nongkrong di warung dekat sekolah. Seorang dari mereka menoleh dan mengajakmu ikut. Hari ini kamu sudah melewati dua ulangan dan satu presentasi.",
    options: [
      { text: "Aku pamit pulang dan memakai sore itu untuk beristirahat.", type: "I" },
      { text: "Aku ikut nongkrong dan menutup hari bersama teman-teman.", type: "E" },
      { text: "Aku ikut kalau tenagaku masih cukup, kalau tidak aku pulang.", type: "A" },
    ],
  },
  {
    id: "papan_pengumuman_01",
    title: "Mading",
    narrative:
      "Mading sekolah penuh kertas warna-warni yang ditempel bertumpuk. Satu poster baru menarik perhatianmu: pendaftaran panitia pentas seni sekolah, terbuka untuk siapa saja. Dua siswa dari kelas lain berdiri di sampingmu dan ikut membacanya sambil berbincang pelan.",
    options: [
      { text: "Aku memotret poster itu dan memikirkannya dengan tenang nanti.", type: "I" },
      { text: "Aku ikut mengobrol dengan mereka dan mengajak mendaftar bersama.", type: "E" },
      { text: "Aku ikut menanggapi obrolan mereka, lalu menimbangnya sendiri nanti.", type: "A" },
    ],
  },
  {
    id: "npc_teman_01",
    title: "Teman Sekelas",
    narrative:
      "Di tengah halaman sekolah, seorang teman sekelas menghampirimu dengan langkah cepat. Dia bercerita bahwa besok dia harus tampil di depan seluruh sekolah dan terus memikirkannya sejak pagi. Jam istirahat masih tersisa lima belas menit. Dia tampak ingin ditemani, tetapi belum meminta apa pun.",
    options: [
      { text: "Aku menanyakan apa yang dia butuhkan, lalu membantu sesuai itu.", type: "A" },
      { text: "Aku menemaninya berlatih dan menyemangatinya sambil bercerita panjang.", type: "E" },
      { text: "Aku mendengarkan dengan seksama lalu memberi satu saran singkat.", type: "I" },
    ],
  },
  {
    id: "npc_kakak_kelas_01",
    title: "Kakak Kelas",
    narrative:
      "Seorang kakak kelas menyapamu di dekat lorong kelas sambil membawa setumpuk brosur. Dia sedang membuka pendaftaran anggota baru untuk ekskul yang rutin tampil di acara sekolah. Dia menjelaskan bahwa anggotanya berkumpul beberapa kali seminggu setelah jam pelajaran. Di dekatmu, beberapa siswa lain ikut mendengarkan.",
    options: [
      { text: "Aku mengambil brosurnya dan membacanya di rumah dengan tenang.", type: "I" },
      { text: "Aku ikut satu pertemuan percobaan dulu, lalu memutuskan setelahnya.", type: "A" },
      { text: "Aku langsung mendaftar dan menanyakan jadwal kumpul pertama.", type: "E" },
    ],
  },
  {
    id: "npc_guru_01",
    title: "Guru",
    narrative:
      "Seorang guru menghentikan langkahmu di lorong dan meminta kamu mewakili kelas dalam lomba cerdas cermat antar sekolah bulan depan. Ada latihan bersama setiap sore, dan kamu akan bertemu banyak siswa dari kelas lain. Guru itu menegaskan bahwa keputusan sepenuhnya ada di tanganmu.",
    options: [
      { text: "Aku meminta waktu untuk berpikir dan menjawab setelah menyusun pertimbangan.", type: "I" },
      { text: "Aku menerima bila jadwalnya cocok dan ada teman yang kukenal.", type: "A" },
      { text: "Aku menerima dengan antusias karena ingin bertemu banyak orang baru.", type: "E" },
    ],
  },
];
