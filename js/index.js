import { encrypt, decrypt } from "./encrypt.js";

//Global variables
const eventStack = [];
const storage = { front: "", back: "" };

//- HTML Elements
const [mainCard, ...rest] = document.getElementsByClassName("main-card");
const display = document.getElementById("display");
const mainBtn = document.getElementById("main-btn");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");
const copyBtn = document.getElementById("display-copy-btn");

//- State machine
const modes = { idle: "idle", encrypt: "front", decrypt: "back" };
let currentMode = modes.idle;
const MODE_EVENT = "modeChanged";

document.addEventListener(MODE_EVENT, (e) => {
  currentMode = e.detail;
  switch (currentMode) {
    case modes.idle:
      break;
    case modes.encrypt:
      encryptState();
      break;
    case modes.decrypt:
      decryptState();
      break;
    default:
      break;
  }
});

// Init state
changeMode(modes.encrypt);

rightBtn.addEventListener("click", () => {
  storage.front = display.value;
  changeMode(modes.decrypt);
});

leftBtn.addEventListener("click", () => {
  storage.back = display.value;
  changeMode(modes.encrypt);
});

function encryptState() {
  mainCard.setAttribute("mode", modes.encrypt);
  leftBtn.setAttribute("disabled", "");
  rightBtn.removeAttribute("disabled");
  display.value = storage.front;
  display.placeholder = "Escribe aquí el mensaje a encriptar";
  mainBtn.textContent = "Encriptar";
  document.title = "Encriptador | By Kevin";

  clearMainBtnEvents();
  const encryptEvent = () => {
    storage.front = display.value;
    const encryptedText = encrypt(display.value);
    storage.back = encryptedText;
    changeMode(modes.decrypt);
  };

  addMainBtnEvent(encryptEvent);
}

function decryptState() {
  mainCard.setAttribute("mode", modes.decrypt);
  leftBtn.removeAttribute("disabled");
  rightBtn.setAttribute("disabled", "");
  display.value = storage.back;
  display.placeholder = "Introduzca aquí el mensaje a descifrar";
  mainBtn.textContent = "Desencriptar";
  document.title = "Desencriptador | By Kevin";

  clearMainBtnEvents();
  const decryptEvent = () => {
    storage.back = display.value;
    const text = decrypt(display.value);
    storage.front = text;
    changeMode(modes.encrypt);
  };

  addMainBtnEvent(decryptEvent);
}

function changeMode(newMode) {
  if (currentMode === newMode) return;

  const customEvent = new CustomEvent(MODE_EVENT, { detail: newMode });
  document.dispatchEvent(customEvent);
}

function addMainBtnEvent(event) {
  eventStack.push(event);
  mainBtn.addEventListener("click", event);
}

function clearMainBtnEvents() {
  eventStack.forEach((event) => mainBtn.removeEventListener("click", event));
}

async function handleCopyBtn() {
  if (display.value.trim() === "") return;

  await writeToClipboard(display.value);
}

async function writeToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error(error.message);
  }
}

copyBtn.addEventListener("pointerup", handleCopyBtn);
