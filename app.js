const form = document.querySelector("#chat-form");
const input = document.querySelector("#message-input");
const messages = document.querySelector("#messages");
const welcome = document.querySelector("#welcome");
const send = document.querySelector("#send");
const historyBox = document.querySelector("#history");
const sidebar = document.querySelector(".sidebar");
let chats = [];
let activeChat = [];

function renderHistory() {
  historyBox.innerHTML = "";
  chats.forEach((chat, index) => {
    const button = document.createElement("button");
    button.textContent = chat.title || "New chat";
    button.title = button.textContent;
    button.addEventListener("click", () => loadChat(index));
    historyBox.appendChild(button);
  });
}
function addMessage(role, content, save = true) {
  welcome?.remove();
  const row = document.createElement("div");
  row.className = `message ${role}`;
  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = role === "user" ? "You" : "B";
  const body = document.createElement("div");
  body.className = "message-content";
  body.textContent = content;
  row.append(avatar, body);
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
  if (save) activeChat.push({ role, content });
  return body;
}
function newChat() {
  if (activeChat.length) {
    chats.unshift({ title: activeChat.find(m => m.role === "user")?.content.slice(0, 36) || "New chat", messages: activeChat });
  }
  activeChat = [];
  messages.innerHTML = "";
  const intro = document.createElement("div");
  intro.className = "welcome";
  intro.id = "welcome";
  intro.innerHTML = '<div class="welcome-logo">B</div><h1>How can I help you today?</h1><p>Ask a question, explore an idea, or get help with a task.</p><div class="suggestions"><button data-prompt="Help me make a simple study plan">Help me make a study plan</button><button data-prompt="Explain a difficult topic in simple words">Explain something simply</button><button data-prompt="Give me ideas for a small business">Brainstorm ideas</button></div>';
  messages.appendChild(intro);
  renderHistory();
  sidebar.classList.remove("open");
}
function loadChat(index) {
  const chat = chats[index];
  activeChat = chat.messages.slice();
  messages.innerHTML = "";
  activeChat.forEach(m => addMessage(m.role, m.content, false));
  sidebar.classList.remove("open");
}
async function sendMessage(text) {
  const message = text.trim();
  if (!message || send.disabled) return;
  addMessage("user", message);
  input.value = "";
  input.style.height = "auto";
  send.disabled = true;
  const typing = addMessage("assistant", "Thinking…", false);
  typing.classList.add("typing");
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "The request failed.");
    typing.textContent = data.reply;
    typing.classList.remove("typing");
    activeChat.push({ role: "assistant", content: data.reply });
  } catch (error) {
    typing.textContent = `Sorry, I couldn't answer: ${error.message}`;
    typing.classList.remove("typing");
    activeChat.push({ role: "assistant", content: typing.textContent });
  } finally {
    send.disabled = false;
    input.focus();
  }
}
form.addEventListener("submit", event => {
  event.preventDefault();
  sendMessage(input.value);
});
input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 180)}px`;
});
document.addEventListener("click", event => {
  const prompt = event.target.closest("[data-prompt]");
  if (prompt) sendMessage(prompt.dataset.prompt);
});
document.querySelector("#new-chat").addEventListener("click", newChat);
document.querySelector("#menu").addEventListener("click", () => sidebar.classList.toggle("open"));
