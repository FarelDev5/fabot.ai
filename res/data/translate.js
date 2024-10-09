function translate() {
    $lang = navigator.language || navigator.userLanguage;

    console.log("Bahasa yang digunakan pada perangkat: " + $lang);
    if ($lang == 'id-ID') {
        document.querySelector('.subtitle').innerText = 'Apa yang bisa saya bantu hari ini?'
        document.getElementById('ai-tool').innerText = 'Selamat Datang.'
        document.getElementById('app-des').innerText = 'Alat ini dirancang untuk analisis data yang lebih akurat, dan pengambilan keputusan cepat berbasis AI, Juga Dapat Membantu Anda Dalam Menyelesaikan Masalah Atau Tugas Rumit.'
        document.getElementById('title-feature').innerText = 'Fabot Menawarkan:'
        document.getElementById('f1').innerText = 'Membuat konten berkualitas tinggi secara otomatis: Fabot.ai dapat membantu Anda membuat konten yang menarik dan informatif secara otomatis, sehingga menghemat waktu dan tenaga Anda.'
        document.getElementById('f2').innerText = 'Menjawab pertanyaan pelanggan dengan akurat: Fabot.ai dapat memberikan jawaban yang akurat dan cepat untuk pertanyaan pelanggan, meningkatkan pengalaman pelanggan dan mengurangi beban kerja tim dukungan Anda.'
        document.getElementById('f3').innerText = 'Memberikan informasi yang dipersonalisasi kepada pengguna: Fabot.ai dapat mengumpulkan dan menganalisis data pengguna untuk memberikan pengalaman yang dipersonalisasi, meningkatkan keterlibatan dan kepuasan pelanggan.'
        document.getElementById('f4').innerText = 'Menulis dan menerjemahkan teks dalam berbagai bahasa: Fabot.ai dapat membantu Anda membuat dan menerjemahkan teks dalam lebih dari 100 bahasa, memfasilitasi komunikasi global dan menjangkau audiens yang lebih luas.'
        document.getElementById('f5').innerText = 'Dibuat dengan mempertimbangkan skalabilitas dan fleksibilitas, alat ini ideal untuk bisnis dengan segala ukuran, mulai dari startup hingga perusahaan besar.'
        document.getElementById('about_developer').innerText = 'Tentang Pengembang'
        document.querySelector('.disclaimer-text').innerText = 'alat bantuan AI yang dikembangkan oleh farel developer'
        document.getElementById('textbox').placeholder = 'Masukkan pesan di sini'
    }

}
translate()

function setLanguage() {
    const userLang = navigator.language || navigator.userLanguage;

    const translations = {
        en: {
            head_share: "Share AI tools that are willing to help you anytime for free.",
            whatsapp: "Share on Whatsaap",
            telegram: "Share on Telegram",
            back: "Back",
            facebook: "Share on Facebook",
            twitter: "Share on Twitter",
        },
        id: {
            head_share: "Bagikan Alat bantu Ai, Yang bersedia membantu anda kapan saja Secara Gratis.",
            whatsapp: "Bagikan di Whatsaap",
            Telegram: "Bagikan di Instagram",
            back: "Kembali",
            twitter: "Bagikan di Twitter",
            facebook: "Bagikan Di Facebook"
        }
    };

    let lang = translations[userLang.substring(0, 2)] || translations.en;

    document.querySelector('.description').textContent = lang.head_share;
    document.querySelector('.facebook').textContent = lang.facebook;
    document.querySelector('.telegram').textContent = lang.Telegram;
    document.querySelector('.twitter').textContent = lang.twitter;
    document.querySelector('.whatsapp').textContent = lang.whatsapp;
    document.querySelector('.back').textContent = lang.back;
}

// Panggil fungsi setLanguage saat halaman dimuat
window.onload = setLanguage;