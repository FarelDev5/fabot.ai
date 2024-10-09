const storedProfilePic = localStorage.getItem('profilePic');
var image = storedProfilePic ? storedProfilePic : 'images/user.jpg'
const storedUsername = localStorage.getItem('username');
var getName = storedUsername ? storedUsername : 'USER 7662'
document.getElementById('displayUsername').textContent = '"' + getName + '"';

$lang = navigator.language || navigator.userLanguage;
var msg_model = "I am a language model developed by 'The Far.studio' led by Farel Alfareza."
var error_msg = 'We are sorry, but there seems to have been an error on our server, please refresh the page and resend your message.'
if($lang = 'id-ID'){
  var msg_model = "Saya adalah model bahasa yang di kembangkan oleh 'The Far.studio' di pimpin oleh Farel Alfareza."
  var error_msg = 'Maaf sepertinya telah terjadi kesalahan pada server kami, silahkan restart halaman dan kirim ulang pesan anda.'
}
const typingForm = document.querySelector(".typing-form");
const chatContainer = document.querySelector(".chat-list");
const suggestions = document.querySelectorAll(".suggestion");
const toggleThemeButton = document.querySelector("#theme-toggle-button");
const deleteChatButton = document.querySelector("#delete-chat-button");

// State variables
let userMessage = null;
let isResponseGenerating = false;

// API configuration
const API_KEY = "AIzaSyC7O5yLrTSKBq_bM4zDSnx4enwCGVzjzWo"; // Your API key here
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

// Load theme and chat data from local storage on page load
const loadDataFromLocalstorage = () => {
  const savedChats = localStorage.getItem("saved-chats");
  const isLightMode = (localStorage.getItem("themeColor") === "light_mode");

  // Apply the stored theme
  document.body.classList.toggle("light_mode", isLightMode);
  toggleThemeButton.innerHTML = isLightMode ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M21.7519 15.0019C20.597 15.4839 19.3296 15.75 18 15.75C12.6152 15.75 8.25 11.3848 8.25 5.99999C8.25 4.67039 8.51614 3.40296 8.99806 2.24805C5.47566 3.71785 3 7.19481 3 11.25C3 16.6348 7.36522 21 12.75 21C16.8052 21 20.2821 18.5243 21.7519 15.0019Z" stroke="$" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  </path>
</svg>` : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 3V5.25M18.364 5.63604L16.773 7.22703M21 12H18.75M18.364 18.364L16.773 16.773M12 18.75V21M7.22703 16.773L5.63604 18.364M5.25 12H3M7.22703 7.22703L5.63604 5.63604M15.75 12C15.75 14.0711 14.0711 15.75 12 15.75C9.92893 15.75 8.25 14.0711 8.25 12C8.25 9.92893 9.92893 8.25 12 8.25C14.0711 8.25 15.75 9.92893 15.75 12Z" stroke="#" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  </path>
</svg>`;

  // Restore saved chats or clear the chat container
  chatContainer.innerHTML = savedChats || '';
  document.body.classList.toggle("hide-header", !!savedChats);
  document.querySelector('.action-buttons').classList.toggle("x_scroll", !!savedChats)
  

  chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom
}

// Create a new message element and return it
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
}

// Show typing effect by displaying words one by one
const showTypingEffect = (text, textElement, incomingMessageDiv) => {
  const words = text.split(' ');
  let currentWordIndex = 0;

  const typingInterval = setInterval(() => {
    // Append each word to the text element with a space
    textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
    incomingMessageDiv.querySelector(".icon").classList.add("hide");

    // If all words are displayed
    if (currentWordIndex === words.length) {
      clearInterval(typingInterval);
      isResponseGenerating = false;
      incomingMessageDiv.querySelector(".icon").classList.remove("hide");
      localStorage.setItem("saved-chats", chatContainer.innerHTML); // Save chats to local storage
    }
    chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom
  }, 75);
}

// Fetch response from the API based on user message
// Fetch response from the API based on user message
const generateAPIResponse = async (incomingMessageDiv) => {
  const textElement = incomingMessageDiv.querySelector(".text"); // Mendapatkan elemen teks

  try {
    // Mengirim permintaan POST ke API dengan pesan pengguna
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: userMessage }]
        }]
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    // Mendapatkan respons API
    let apiResponse = data?.candidates[0]?.content?.parts[0]?.text.replace(/\*\*(.*?)\*\*/g, '$1');

    // Cegah respons yang mengandung kata "Google" atau "Gemini"
    const forbiddenPhrases = [
      "model bahasa AI yang dikembangkan oleh Google",
      "dikembangkan oleh Google",
      "Google AI",
      "Google Language Model",
      "model AI multimoda",
      "dilatih oleh Google.",
      "Saya adalah model bahasa",
      "di ciptakan oleh google",
      
"Google AI language model",
"Google-developed",
"Google AI",
"Google Language Model",
"multimodal AI model",
"trained by Google.",
"I am a language model",
"created by Google",

"Google AI language model",
"Google-developed",
"Google AI",
"Google Language Model",
"multimodal AI model",
"trained by Google.",
"I am a language model",
"created by Google",

"Modelo de lenguaje desarrollado por la inteligencia artificial de Google",
"Desarrollado por Google",
"Google AI",
"Google Lenguaje Modelo",
"Modelo de AI multimodal",
"capacitado por Google.",
"Soy un modelo de lenguaje",
"Creado por Google",

"Von Google entwickeltes KI-Sprachmodell",
"Von Google entwickelt",
"Google KI",
"Google-Sprachmodell",
"Multimodales KI-Modell",
"Von Google trainiert.",
"Ich bin ein Sprachmodell",
"Erstellt von Google",

"Modèle de langage d'IA développé par Google",
"Développé par Google",
"Google IA",
"Modèle de langue Google",
"Modèle multimodal d'IA",
"formé par Google.",
"Je suis un modèle de langage",
"Créé par Google",

"Modello linguistico di IA sviluppato da Google",
"Sviluppato da Google",
"Google AI",
"Modello linguistico Google",
"Modello di IA multimodale",
"addestrato da Google.",
"Sono un modello linguistico",
"Creato da Google",

"Google开发的AI语言模型",
"由Google开发",
"Google AI",
"Google语言模型",
"多模态AI模型",
"经过Google训练。",
"我是一个语言模型",
"由Google创建",

"Модель искусственного интеллекта и языка, разработанная Google",
"Разработано Google",
"Google AI",
"Языковая модель Google",
"Мультимодальная модель ИИ",
"Обучена Google.",
"Я языковая модель.",
"Создано Google",

"Googleが開発したAI言語モデル",
"Googleが開発",
"Google AI",
"Google言語モデル",
"マルチモーダルAIモデル",
"Googleによってトレーニングされました。",
"私は言語モデルです。",
"Googleによって作成されました。",

"Google에서 개발한 AI 언어 모델",
"Google에서 개발",
"Google AI",
"Google 언어 모델",
"멀티모달 AI 모델",
"Google에서 훈련함.",
"저는 언어 모델입니다.",
"Google에서 생성함.",
"نموذج لغة الذكاء الاصطناعي الذي طورته جوجل",
"طورته جوجل",
"جوجل الذكاء الاصطناعي",
"نموذج لغة جوجل",
"نموذج الذكاء الاصطناعي متعدد الوسائط",
"تم تدريبه بواسطة جوجل.",
"أنا نموذج لغوي",
"تم إنشاؤه بواسطة جوجل",
    ];

    // Cek apakah respons mengandung informasi identitas yang tidak diinginkan
    const containsForbiddenPhrase = forbiddenPhrases.some(phrase => apiResponse.includes(phrase));

   if (containsForbiddenPhrase) {
      apiResponse = msg_model;
    }
    showTypingEffect(apiResponse, textElement, incomingMessageDiv); // Tampilkan efek mengetik
  } catch (error) { // Tangani error
    isResponseGenerating = false;
    textElement.innerText = error_msg;
    textElement.parentElement.closest(".message").classList.add("error");
  } finally {
    incomingMessageDiv.classList.remove("loading");
  }
};


// Show a loading animation while waiting for the API response
const showLoadingAnimation = () => {
  const html = `<div class="message-content">
                  <img class="avatar" src="./images/ic/ic_app.png" alt="Fabot avatar">
                  <p class="text"></p>
                  <div class="loading-indicator">
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                  </div>
                </div>
                <span onClick="copyMessage(this)" class="icon material-symbols-rounded"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9 12H12.75M9 15H12.75M9 18H12.75M15.75 18.75H18C19.2426 18.75 20.25 17.7426 20.25 16.5V6.10822C20.25 4.97324 19.405 4.01015 18.2739 3.91627C17.9006 3.88529 17.5261 3.85858 17.1505 3.83619M11.3495 3.83619C11.2848 4.04602 11.25 4.26894 11.25 4.5C11.25 4.91421 11.5858 5.25 12 5.25H16.5C16.9142 5.25 17.25 4.91421 17.25 4.5C17.25 4.26894 17.2152 4.04602 17.1505 3.83619M11.3495 3.83619C11.6328 2.91757 12.4884 2.25 13.5 2.25H15C16.0116 2.25 16.8672 2.91757 17.1505 3.83619M11.3495 3.83619C10.9739 3.85858 10.5994 3.88529 10.2261 3.91627C9.09499 4.01015 8.25 4.97324 8.25 6.10822V8.25M8.25 8.25H4.875C4.25368 8.25 3.75 8.75368 3.75 9.375V20.625C3.75 21.2463 4.25368 21.75 4.875 21.75H14.625C15.2463 21.75 15.75 21.2463 15.75 20.625V9.375C15.75 8.75368 15.2463 8.25 14.625 8.25H8.25ZM6.75 12H6.7575V12.0075H6.75V12ZM6.75 15H6.7575V15.0075H6.75V15ZM6.75 18H6.7575V18.0075H6.75V18Z" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  </path>
</svg></span>`;

  const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
  chatContainer.appendChild(incomingMessageDiv);

  chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom
  generateAPIResponse(incomingMessageDiv);
}

// Copy message text to the clipboard
const copyMessage = (copyButton) => {
  const messageText = copyButton.parentElement.querySelector(".text").innerText;

  navigator.clipboard.writeText(messageText);
  copyButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M11.3495 3.83619C11.2848 4.04602 11.25 4.26894 11.25 4.5C11.25 4.91421 11.5858 5.25 12 5.25H16.5C16.9142 5.25 17.25 4.91421 17.25 4.5C17.25 4.26894 17.2152 4.04602 17.1505 3.83619M11.3495 3.83619C11.6328 2.91757 12.4884 2.25 13.5 2.25H15C16.0116 2.25 16.8672 2.91757 17.1505 3.83619M11.3495 3.83619C10.9739 3.85858 10.5994 3.88529 10.2261 3.91627C9.09499 4.01015 8.25 4.97324 8.25 6.10822V8.25M17.1505 3.83619C17.5261 3.85858 17.9006 3.88529 18.2739 3.91627C19.405 4.01015 20.25 4.97324 20.25 6.10822V16.5C20.25 17.7426 19.2426 18.75 18 18.75H15.75M8.25 8.25H4.875C4.25368 8.25 3.75 8.75368 3.75 9.375V20.625C3.75 21.2463 4.25368 21.75 4.875 21.75H14.625C15.2463 21.75 15.75 21.2463 15.75 20.625V18.75M8.25 8.25H14.625C15.2463 8.25 15.75 8.75368 15.75 9.375V18.75M7.5 15.75L9 17.25L12 13.5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  </path>
</svg>`; // Show confirmation icon
  setTimeout(() => copyButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9 12H12.75M9 15H12.75M9 18H12.75M15.75 18.75H18C19.2426 18.75 20.25 17.7426 20.25 16.5V6.10822C20.25 4.97324 19.405 4.01015 18.2739 3.91627C17.9006 3.88529 17.5261 3.85858 17.1505 3.83619M11.3495 3.83619C11.2848 4.04602 11.25 4.26894 11.25 4.5C11.25 4.91421 11.5858 5.25 12 5.25H16.5C16.9142 5.25 17.25 4.91421 17.25 4.5C17.25 4.26894 17.2152 4.04602 17.1505 3.83619M11.3495 3.83619C11.6328 2.91757 12.4884 2.25 13.5 2.25H15C16.0116 2.25 16.8672 2.91757 17.1505 3.83619M11.3495 3.83619C10.9739 3.85858 10.5994 3.88529 10.2261 3.91627C9.09499 4.01015 8.25 4.97324 8.25 6.10822V8.25M8.25 8.25H4.875C4.25368 8.25 3.75 8.75368 3.75 9.375V20.625C3.75 21.2463 4.25368 21.75 4.875 21.75H14.625C15.2463 21.75 15.75 21.2463 15.75 20.625V9.375C15.75 8.75368 15.2463 8.25 14.625 8.25H8.25ZM6.75 12H6.7575V12.0075H6.75V12ZM6.75 15H6.7575V15.0075H6.75V15ZM6.75 18H6.7575V18.0075H6.75V18Z" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  </path>
</svg>`, 1000); // Revert icon after 1 second
}

// Handle sending outgoing chat messages
const handleOutgoingChat = () => {
  // Ambil teks input dari form
  userMessage = typingForm.querySelector(".typing-input").value.trim() || userMessage;
  if (!userMessage || isResponseGenerating) return; // Jika pesan kosong atau respons sedang diproses, hentikan
  setTimeout(function(){
    checkInternetConnection()
  },1000)
  // Tampilkan pesan dari pengguna
  const userMessageHtml = `<div class="message-content">
                             <img class="avatar" id="profile" src="${image}" alt="User avatar">
                             <p class="text"></p>
                           </div>`;

  const outgoingMessageDiv = createMessageElement(userMessageHtml, "outgoing");
  outgoingMessageDiv.querySelector(".text").innerText = userMessage;
  chatContainer.appendChild(outgoingMessageDiv);
  
  chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll ke bawah
  typingForm.reset(); // Kosongkan input field
  document.body.classList.add("hide-header");
  document.querySelector('.action-buttons').classList.toggle("x_scroll");
    // Tampilkan animasi mengetik dari bot
    setTimeout(showLoadingAnimation, 500); // Tampilkan animasi loading setelah jeda
  }

// Toggle between light and dark themes
toggleThemeButton.addEventListener("click", () => {
  const isLightMode = document.body.classList.toggle("light_mode");
  localStorage.setItem("themeColor", isLightMode ? "light_mode" : "dark_mode");
  toggleThemeButton.innerHTML = isLightMode ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M21.7519 15.0019C20.597 15.4839 19.3296 15.75 18 15.75C12.6152 15.75 8.25 11.3848 8.25 5.99999C8.25 4.67039 8.51614 3.40296 8.99806 2.24805C5.47566 3.71785 3 7.19481 3 11.25C3 16.6348 7.36522 21 12.75 21C16.8052 21 20.2821 18.5243 21.7519 15.0019Z" stroke="$" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  </path>
</svg>` : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 3V5.25M18.364 5.63604L16.773 7.22703M21 12H18.75M18.364 18.364L16.773 16.773M12 18.75V21M7.22703 16.773L5.63604 18.364M5.25 12H3M7.22703 7.22703L5.63604 5.63604M15.75 12C15.75 14.0711 14.0711 15.75 12 15.75C9.92893 15.75 8.25 14.0711 8.25 12C8.25 9.92893 9.92893 8.25 12 8.25C14.0711 8.25 15.75 9.92893 15.75 12Z" stroke="#" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  </path>
</svg>`;
});

// Delete all chats from local storage when button is clicked
deleteChatButton.addEventListener("click", () => {
  var lang = navigator.language || navigator.userLanguage;
  if(lang == 'id-ID'){
   var popup = 'Menghapus Semua Obrolan'
  }else{
    var popup = 'Delete all the chats';
  }
 
  alert(popup);
  localStorage.removeItem("saved-chats");
  loadDataFromLocalstorage();
  location.reload(true);
});

// Set userMessage and handle outgoing chat when a suggestion is clicked
suggestions.forEach(suggestion => {
  suggestion.addEventListener("click", () => {
    userMessage = suggestion.querySelector(".text").innerText;
    handleOutgoingChat();
  });
});

// Prevent default form submission and handle outgoing chat
typingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleOutgoingChat();
});
function checkInternetConnection() {
  $lang = navigator.language || navigator.userLanguage;
  if($lang = 'id-ID'){
    var msg = 'Tidak Ada Koneksi Internet'
  }else{
    var msg = 'No Internet Connection'
  }
  // Memeriksa apakah browser mendukung fitur deteksi koneksi internet
  if (!navigator.onLine) {
    // Jika koneksi tidak aktif, tampilkan pesan
    document.body.style.overflow = 'hidden'
    document.querySelector('.loading--container').style.display = 'flex'
    setTimeout(function(){
      alert(msg)
      location.reload(true)
    },2000)
  } else {
    document.body.style.overflow = 'auto'
    document.querySelector('.loading--container').style.display = 'none'
  }
}
loadDataFromLocalstorage();