const firebaseConfig = {
  apiKey: "AIzaSyAGHahrN5eAzzcIp3lb0wyjqWe-AxRDtyU",
  authDomain: "skill-swap-plat.firebaseapp.com",
  projectId: "skill-swap-plat",
  storageBucket: "skill-swap-plat.firebasestorage.app",
  messagingSenderId: "322475779127",
  appId: "1:322475779127:web:9880aeadb6bc675abe4bb2"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      // Login successful
      alert('Login successful! Redirecting...');
      window.location.href = "index.html"; // Redirect to home or dashboard
    })
    .catch(error => {
      alert('Login failed: ' + error.message);
    });
});

