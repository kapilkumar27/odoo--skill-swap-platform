// Mock login status
let isLoggedIn = false;

document.querySelectorAll('.request-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!isLoggedIn) {
      alert("Please login to send a request.");
      // Optionally, trigger login modal here
    } else {
      alert("Request sent!");
    }
  });
});

document.getElementById("login-btn").addEventListener("click", () => {
  // Simple login mock toggle
  isLoggedIn = true;
  alert("You are now logged in!");
});
