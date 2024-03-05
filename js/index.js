import EventHandler from "./EventHandler.js";
import { encrypt, decrypt } from "./encrypt.js";
import { openModal } from "./modal.js";

//Global variables
const storage = { front: "", back: "" };

//- HTML Elements
const title = document.getElementById("title");
const mainCard = document.getElementById("main-card");
const altCard = document.getElementById("alt-card");
const display = document.getElementById("display");
const altDisplay = document.getElementById("alt-display");
const mainBtn = document.getElementById("main-btn");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");
const copyBtn = document.getElementById("display-copy-btn");
const altCopyBtn = document.getElementById("alt-copy-btn");
const swapBtn = document.querySelector(".swap-btn");

// Handler
const mainBtnHandler = new EventHandler(mainBtn, "click");
const inputChangeHandler = new EventHandler(display, "input");

// Messages
const EMPTY_INPUT_ERROR = `\u274C ¡El campo de texto está vacío!

Para usar la función de encriptación o desencriptación, escribe algo en el campo de texto.`;
const COPY_DONE = `\u2705 El texto se ha copiado al portapapeles.`;
const COPY_FAIL = `\u274C Ha ocurrido un error al copiar el texto. Inténtalo de nuevo.`;

// Media screen
const DESKTOP = "(min-width: 768px)";
const mediaQuery = window.matchMedia(DESKTOP);

// Cards states
const cardView = {
  front: "front",
  back: "back",
};

//- State machine
const modes = {
  idle: "idle",
  mobileEncrypt: "mobile encrypt",
  mobileDecrypt: "mobile decrypt",
  pcEncryt: "desktop encrypt",
  pcDecrypt: "dektop decrypt",
};
let currentMode = modes.idle;
const MODE_EVENT = "modeChanged";

document.addEventListener(MODE_EVENT, (e) => {
  currentMode = e.detail;
  switch (currentMode) {
    case modes.idle:
      break;
    case modes.mobileEncrypt:
      mobileEncryptState();
      break;
    case modes.mobileDecrypt:
      mobileDecryptState();
      break;
    case modes.pcEncryt:
      desktopEncryptState();
      break;
    case modes.pcDecrypt:
      desktopDecryptState();
      break;
    default:
      throw Error(`State ${e.detail} doesn't exist`);
  }
});

// Init state
if (mediaQuery.matches) {
  changeMode(modes.pcEncryt);
} else {
  changeMode(modes.mobileEncrypt);
}

mediaQuery.addEventListener("change", (event) => {
  if (event.matches) changeMode(modes.pcEncryt);
  else changeMode(modes.mobileEncrypt);
});

rightBtn.addEventListener("click", () => {
  storage.front = display.value;
  changeMode(modes.mobileDecrypt);
});

leftBtn.addEventListener("click", () => {
  storage.back = display.value;
  changeMode(modes.mobileEncrypt);
});

function mobileEncryptState() {
  mainCard.setAttribute("mode", cardView.front);
  leftBtn.setAttribute("disabled", "");
  rightBtn.removeAttribute("disabled");
  display.value = storage.front;
  display.placeholder = "Escribe aquí el mensaje a encriptar";
  mainBtn.textContent = "Encriptar";
  document.title = "Encriptador | By Kevin";

  const encryptEvent = () => {
    const inputText = display.value.trim();

    if (inputText === "") return openModal(EMPTY_INPUT_ERROR);

    storage.front = inputText;
    const encryptedText = encrypt(inputText);
    storage.back = encryptedText;
    changeMode(modes.mobileDecrypt);
  };

  mainBtnHandler.swap(encryptEvent);
}

function mobileDecryptState() {
  mainCard.setAttribute("mode", cardView.back);
  leftBtn.removeAttribute("disabled");
  rightBtn.setAttribute("disabled", "");
  display.value = storage.back;
  display.placeholder = "Introduzca aquí el mensaje a descifrar";
  mainBtn.textContent = "Desencriptar";
  document.title = "Desencriptador | By Kevin";

  const decryptEvent = () => {
    const inputText = display.value.trim();

    if (inputText === "") return openModal(EMPTY_INPUT_ERROR);

    storage.back = inputText;
    const text = decrypt(inputText);
    storage.front = text;
    changeMode(modes.mobileEncrypt);
  };

  mainBtnHandler.swap(decryptEvent);
}

function desktopEncryptState() {
  mainCard.setAttribute("mode", cardView.back);
  altCard.setAttribute("mode", cardView.back);
  display.value = storage.front;
  altDisplay.value = storage.back;
  display.placeholder = "Escribe aquí el mensaje a encriptar";
  document.title = "Encriptador | By Kevin";
  title.textContent = "Encriptador";

  const encryptEvent = () => {
    const inputText = display.value.trim();
    const text = encrypt(inputText);
    altDisplay.value = text;
    storage.back = text;
    storage.front = inputText;
  };

  encryptEvent();
  inputChangeHandler.swap(encryptEvent);
}

function desktopDecryptState() {
  mainCard.setAttribute("mode", cardView.back);
  altCard.setAttribute("mode", cardView.back);
  display.value = storage.back;
  altDisplay.value = storage.front;
  display.placeholder = "Introduzca aquí el mensaje a descifrar";
  document.title = "Desencriptador | By Kevin";
  title.textContent = "Desencriptador";

  const decryptEvent = () => {
    const inputText = display.value.trim();
    const text = decrypt(inputText);
    altDisplay.value = text;
    storage.front = text;
    storage.back = inputText;
  };

  decryptEvent();
  inputChangeHandler.swap(decryptEvent);
}

swapBtn.addEventListener("click", () => {
  switch (currentMode) {
    case modes.pcEncryt:
      changeMode(modes.pcDecrypt);
      break;
    case modes.pcDecrypt:
      changeMode(modes.pcEncryt);
      break;
  }
});

function changeMode(newMode) {
  if (currentMode === newMode) return;

  const customEvent = new CustomEvent(MODE_EVENT, { detail: newMode });
  document.dispatchEvent(customEvent);
}

async function handleCopyBtn() {
  if (display.value.trim() === "") return;

  await writeToClipboard(display.value);

  openModal(COPY_DONE);
}

async function handleAltCopyBtn() {
  if (altDisplay.value.trim() === "") return;

  await writeToClipboard(altDisplay.value);

  openModal(COPY_DONE);
}

async function writeToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    openModal(`${COPY_FAIL}
    Error: ${error}`);
  }
}

copyBtn.addEventListener("pointerup", handleCopyBtn);
altCopyBtn.addEventListener("pointerup", handleAltCopyBtn);
