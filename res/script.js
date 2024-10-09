function getReward() {
    history.back(true); // Kembali ke halaman sebelumnya
    var language = navigator.language || navigator.userLanguage; // Mendapatkan bahasa pengguna
    var alert_txt = "Reward has been successfully added!";

    // Cek bahasa dan sesuaikan pesan
    if (language === "id-ID") {
        alert_txt = "Reward berhasil di tambahkan";
    }

    alert(alert_txt); // Tampilkan pesan

    // Ambil nilai $totalBot dari localStorage atau inisialisasi jika belum ada
    var $totalBot = parseInt(localStorage.getItem("$totalBot")) || 0;

    // Tambahkan 5 ke nilai $totalBot
    $totalBot += 5;

    // Simpan kembali nilai $totalBot ke localStorage
    localStorage.setItem("$totalBot", $totalBot);

    // Tampilkan nilai $totalBot yang baru di elemen dengan id "total"
    document.getElementById("total").innerText = $totalBot;

    // Log perubahan nilai $totalBot
    console.log("Nilai $totalBot diubah menjadi:", $totalBot);
}