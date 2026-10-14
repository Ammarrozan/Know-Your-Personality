// results.js - teks edukasi layar hasil (REQ-F10). Domain Dev 2.
// Kunci HARUS sama dengan nilai kembalian getResult() di utils/gameLogic.js.
//
// Pedoman penulisan (SRS 5.2: netral, tidak ada tipe yang lebih baik):
// - strengths: satu paragraf kekuatan; myth + fact: satu paragraf mitos dan faktanya.
// - Setiap paragraf sekitar 60-80 kata. Pakai kata "cenderung", jangan klaim mutlak.
// - Jangan menambahkan angka, statistik, atau kutipan tanpa sumber yang sudah diverifikasi.

export const resultContent = {
  Introvert: {
    strengths:
      "Kecenderungan introvert sering tampak sebagai kemampuan memberi perhatian yang dalam. Kamu cenderung nyaman memikirkan sesuatu dengan matang sebelum berbicara, bertahan fokus pada satu hal dalam waktu lama, dan membangun hubungan yang akrab dengan beberapa orang saja. Waktu sendiri membantumu mengisi tenaga, sehingga kamu bisa hadir lebih utuh saat bersama orang lain. Kekuatan ini berguna dalam belajar, menulis, meneliti, dan mendengarkan dengan sungguh-sungguh.",
    myth: "Introvert pasti pemalu dan tidak suka bergaul.",
    fact: "Introvert dan pemalu bukan hal yang sama. Introvert menyangkut dari mana seseorang mendapatkan tenaga: lebih banyak dari waktu sendiri atau suasana yang tenang. Seorang introvert bisa menikmati bergaul dan pandai berbicara di depan orang, hanya saja ia butuh jeda setelah keramaian. Rasa malu berbeda lagi, karena berkaitan dengan rasa cemas akan penilaian orang lain.",
  },
  Ekstrovert: {
    strengths:
      "Kecenderungan ekstrovert sering tampak sebagai tenaga yang besar dalam berinteraksi. Kamu cenderung mudah memulai percakapan, cepat akrab dengan orang baru, dan terbantu berpikir ketika membicarakannya bersama orang lain. Suasana ramai sering menambah semangatmu. Kekuatan ini berguna dalam kerja kelompok, membangun relasi, memimpin diskusi, dan menghidupkan suasana ketika tim membutuhkan dorongan. Dengan tenaga itu, kamu juga bisa menjadi penghubung yang mempertemukan orang-orang yang belum saling kenal.",
    myth: "Ekstrovert selalu ingin ramai dan tidak pernah butuh waktu sendiri.",
    fact: "Ekstrovert hanya cenderung mendapat tenaga dari interaksi, bukan berarti tidak pernah butuh jeda. Ekstrovert juga bisa menjadi pendengar yang baik, bisa merasa lelah setelah hari yang padat, dan bisa menikmati waktu tenang. Banyak bicara pun tidak otomatis berarti ekstrovert, dan menjadi ekstrovert tidak otomatis membuat seseorang lebih pandai bergaul atau lebih cocok memimpin.",
  },
  Ambivert: {
    strengths:
      "Kecenderungan ambivert menunjukkan fleksibilitas: kamu cenderung menyesuaikan diri dengan situasi. Di satu waktu kamu nyaman berada di tengah keramaian, di waktu lain kamu lebih butuh ketenangan. Kemampuan membaca situasi dan mengatur tenaga ini berguna saat bekerja dengan beragam orang, berganti antara tugas mandiri dan kelompok, serta memahami sudut pandang orang yang lebih tenang maupun yang lebih ramai.",
    myth: "Ambivert itu plin-plan dan tidak punya pendirian.",
    fact: "Ambivert bukan setengah introvert dan setengah ekstrovert yang ragu-ragu. Kepribadian sosial lebih tepat dipahami sebagai rentang, bukan kotak yang kaku. Ambivert tetap punya preferensi, hanya saja preferensinya bergeser mengikuti situasi, suasana hati, atau siapa yang ada. Hasil Ambivert di game ini juga tidak berarti kamu tipe yang paling seimbang atau paling baik.",
  },
};
