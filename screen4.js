document.querySelector(".request-btn").addEventListener("click", () => {
  alert("Swap request sent!");
});

const modal = document.getElementById("swapModal");
const requestBtn = document.querySelector(".request-btn");
const closeBtn = document.getElementById("closeModal");

// Open modal on request click
requestBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// Close modal on cancel
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Optional: close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
