const modal = document.getElementById("modal");
const modalText = document.getElementById("modal-text");

function openModal(text = "") {
  modal.style.display = "block";
  modalText.textContent = text;
}

// Function to close the modal
function closeModal() {
  modal.style.display = "none";
}

modal.addEventListener("click", (e) => {
  if (e.target.id === "modal") closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

export { openModal, closeModal };
