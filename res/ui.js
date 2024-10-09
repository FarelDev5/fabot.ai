function translate() {
    // Mendapatkan elemen sidebar
    const sidebar = document.querySelector(".sidebar");
    const creditContainer = document.querySelector(".credit--container");
    const loadingContainer = document.querySelector(".loading--container");
    const lockGround = document.querySelector(".lock--ground");
    const xMark = document.querySelector(".x-mark");

    // Cek apakah elemen sidebar dan elemen lainnya ada di halaman
    if (
        !sidebar ||
        !creditContainer ||
        !loadingContainer ||
        !lockGround ||
        !xMark
    ) {
        console.error("Elemen yang diperlukan tidak ditemukan di halaman.");
        return;
    }

    var lang = navigator.language || navigator.userLanguage;

    // Default teks tombol
    var b1 = "Credit";
    var b2 = "Share";
    var b3 = "About Developer";
    var b4 = "Follow Me";
    var b5 = "Support";
    var v6 = "You Profile";

    // Jika bahasa Indonesia, ganti teks tombol
    if (lang == "id-ID") {
        b1 = "Kredit";
        b2 = "Bagikan";
        b3 = "Tentang Developer";
        b4 = "Ikuti Saya";
        b5 = "Dukungan";
        b6 = "Profil Anda"
    }

    // Daftar UI tombol
    var ui = [{
            getButton: b1
        },
        {
            getButton: b2
        },
        {
            getButton: b3
        },
        {
            getButton: b4
        },
        {
            getButton: b5
        },
        {
            getButton: b6
        },
    ];

    // Loop untuk membuat tombol dan menambahkan event listener
    ui.forEach((data, index) => {
        var button = document.createElement("button");
        button.textContent = data.getButton;
        sidebar.append(button);

        // Event listener untuk masing-masing tombol
        button.addEventListener("click", function() {
            switch (index) {
                case 0:
                    lockGround.classList.toggle("add");
                    sidebar.classList.remove("show");
                    setTimeout(function() {
                        document.body.style.overflow = "hidden";
                        creditContainer.style.display = "flex";
                    }, 100);
                    break;
                case 1:
                    lockGround.classList.toggle("show");
                    window.scrollTo(0, 0);
                    setTimeout(function() {
                        document.querySelector(".share-container").style.bottom = "0";
                        sidebar.classList.remove("show");
                        lockGround.classList.remove("add");
                        document.body.style.overflow = "hidden";
                    }, 100);
                    break;
                case 2:
                    window.scrollTo(0, 0);
                    document.body.style.overflow = "hidden";
                    loadingContainer.style.display = "flex";
                    sidebar.classList.remove("show");
                    lockGround.classList.remove("add");
                    setTimeout(function() {
                        document.body.style.overflow = "auto";
                        document.querySelector(".loading--container").style.display =
                            "none";
                        window.location.href = "./pages/developer_contact.html";
                        document.body.classList.remove("lock");
                        document.body.style.overflow = "auto";
                    }, 2000);
                    break;
                case 3:
                    window.scrollTo(0, 0);
                    lockGround.classList.remove("add");
                    sidebar.classList.remove("show");
                    document.body.style.overflow = "hidden";
                    loadingContainer.style.display = "flex";
                    setTimeout(function() {
                        document.body.style.overflow = "auto";
                        document.querySelector(".loading--container").style.display =
                            "none";
                        window.location.href = "./pages/me_md.html";
                        document.body.classList.remove("lock");
                        document.body.style.overflow = "auto";
                    }, 2000);
                    break;
                case 4:
                    sidebar.classList.remove("show");
                    lockGround.classList.remove("add");
                    window.scrollTo(0, 0);
                    document.body.style.overflow = "hidden";
                    loadingContainer.style.display = "flex";
                    setTimeout(function() {
                        document.body.style.overflow = "auto";
                        document.querySelector(".loading--container").style.display =
                            "none";
                        window.location.href = "https://saweria.co/FarelAlfareza";
                        document.body.classList.remove("lock");
                        document.body.style.overflow = "auto";
                    }, 2000);
                    break;
                case 5:
                    sidebar.classList.remove("show");
                    lockGround.classList.remove("add");
                    window.scrollTo(0, 0);
                    document.body.style.overflow = "hidden";
                    loadingContainer.style.display = "flex";
                    setTimeout(function() {
                        document.body.style.overflow = "auto";
                        document.querySelector(".loading--container").style.display =
                            "none";
                        window.location.href = "./pages/acc.html";
                        document.body.classList.remove("lock");
                        document.body.style.overflow = "auto";
                    }, 2000);
                    break;
                    // Tambahkan case untuk tombol lainnya jika diperlukan
                default:
                    console.log("Button " + index + " clicked");
            }
        });
    });

    // Event untuk menutup sidebar
    xMark.addEventListener("click", function() {
        sidebar.classList.toggle("show");
        lockGround.classList.toggle("add");
        document.body.classList.toggle("lock");
        document.body.style.overflow = sidebar.classList.contains("show") ?
            "hidden" :
            "auto";
    });

    

    // Event untuk menutup overlay (area di luar sidebar)
    lockGround.addEventListener("click", function() {
        sidebar.classList.remove("show");
        lockGround.classList.remove("add");
        document.body.classList.remove("lock");
        document.body.style.overflow = "auto";
    });

    // Event untuk menutup credit container
    creditContainer.addEventListener("click", function() {
        creditContainer.style.display = "none";
        lockGround.classList.remove("add");
        document.body.classList.remove("lock");
        document.body.style.overflow = "auto";
    });

}

// Panggil fungsi translate setelah seluruh elemen halaman termuat
document.addEventListener("DOMContentLoaded", translate);