// Example for future Firebase connection

document.querySelectorAll(".accept-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    alert("Request accepted!");
    // update status in Firebase
  });
});

document.querySelectorAll(".reject-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    alert("Request rejected!");
    // update status in Firebase
  });
});
