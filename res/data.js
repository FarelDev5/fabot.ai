$totalBot = localStorage.getItem('$totalBot') || 0;
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
  toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";

  // Restore saved chats or clear the chat container
  chatContainer.innerHTML = savedChats || '';
  document.body.classList.toggle("hide-header", !!savedChats);

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
    ];

    // Cek apakah respons mengandung informasi identitas yang tidak diinginkan
    const containsForbiddenPhrase = forbiddenPhrases.some(phrase => apiResponse.includes(phrase));

    if (containsForbiddenPhrase) {
      apiResponse = "Saya adalah model bahasa yang di kembangkan oleh 'The Far.studio' di pimpin oleh farel alfareza.";
    }
    showTypingEffect(apiResponse, textElement, incomingMessageDiv); // Tampilkan efek mengetik
  } catch (error) { // Tangani error
    isResponseGenerating = false;
    textElement.innerText = 'Maaf sepertinya telah terjadi kesalahan pada server kami, silahkan kirim ulang pesan anda.';
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
                <span onClick="copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>`;

  const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
  chatContainer.appendChild(incomingMessageDiv);

  chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom
  generateAPIResponse(incomingMessageDiv);
}

// Copy message text to the clipboard
const copyMessage = (copyButton) => {
  const messageText = copyButton.parentElement.querySelector(".text").innerText;

  navigator.clipboard.writeText(messageText);
  copyButton.innerText = "done"; // Show confirmation icon
  setTimeout(() => copyButton.innerText = "content_copy", 1000); // Revert icon after 1 second
}

// Handle sending outgoing chat messages
const handleOutgoingChat = () => {
  // Ambil teks input dari form
  userMessage = typingForm.querySelector(".typing-input").value.trim() || userMessage;
  if (!userMessage || isResponseGenerating) return; // Jika pesan kosong atau respons sedang diproses, hentikan

  // Tampilkan pesan dari pengguna
  const userMessageHtml = `<div class="message-content">
                             <img class="avatar" src="images/user.jpg" alt="User avatar">
                             <p class="text"></p>
                           </div>`;

  const outgoingMessageDiv = createMessageElement(userMessageHtml, "outgoing");
  outgoingMessageDiv.querySelector(".text").innerText = userMessage;
  chatContainer.appendChild(outgoingMessageDiv);
  
  chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll ke bawah
  typingForm.reset(); // Kosongkan input field
  document.body.classList.add("hide-header");

  // Cek apakah user menanyakan pembuat bot
    // Tampilkan animasi mengetik dari bot
    setTimeout(showLoadingAnimation, 500); // Tampilkan animasi loading setelah jeda
  }

// Toggle between light and dark themes
toggleThemeButton.addEventListener("click", () => {
  const isLightMode = document.body.classList.toggle("light_mode");
  localStorage.setItem("themeColor", isLightMode ? "light_mode" : "dark_mode");
  toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";
});

// Delete all chats from local storage when button is clicked
deleteChatButton.addEventListener("click", () => {
  const popup = 'Delete all the chats';
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

loadDataFromLocalstorage();
