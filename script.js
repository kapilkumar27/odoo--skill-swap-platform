// ==== Firebase Initialization ====
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
const db = firebase.firestore();

let isLoggedIn = false;

// ==== DOM Elements ====
const loginBtn = document.getElementById("login-btn");
const avatar = document.getElementById("user-avatar");
const dropdown = document.getElementById("user-dropdown");
const profileBtn = document.getElementById("profile-btn");
const dropdownLogoutBtn = document.getElementById("dropdown-logout-btn");

// ==== Auth State & Avatar/Dropdown Logic ====
auth.onAuthStateChanged(async user => {
  isLoggedIn = !!user;
  if (user) {
    // Fetch user photoURL from Firestore
    const doc = await db.collection('users').doc(user.uid).get();
    let photoURL = 'avatar.png';
    if (doc.exists && doc.data().photoURL) {
      photoURL = doc.data().photoURL;
    }
    avatar.src = photoURL;
    avatar.style.display = "inline-block";
    if (loginBtn) loginBtn.style.display = "none";
  } else {
    avatar.style.display = "none";
    dropdown.style.display = "none";
    if (loginBtn) loginBtn.style.display = "inline-block";
  }
});

// Toggle dropdown on avatar click
avatar.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
});

// Hide dropdown when clicking outside
document.addEventListener("click", () => {
  dropdown.style.display = "none";
});

// Profile button: Go to profile page
profileBtn.addEventListener("click", () => {
  window.location.href = "screen3.html"; // Change if your profile page is named differently
});

// Logout button: Sign out and reload
dropdownLogoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    window.location.reload();
  });
});

// Login button event
loginBtn.addEventListener("click", () => {
  window.location.href = "screen2.html"; // Your login page
});

let profiles = [];
const PROFILES_PER_PAGE = 4;
let currentPage = 1;

// Fetch profiles from Firestore, excluding the current user
async function fetchProfiles() {
  const user = auth.currentUser;
  const snapshot = await db.collection('users').get();
  profiles = [];
  snapshot.forEach(doc => {
    // Exclude the logged-in user's own profile
    if (!user || doc.id !== user.uid) {
      profiles.push(doc.data());
    }
  });
  renderProfiles(currentPage);
  renderPagination();
}

// Call fetchProfiles after auth state is known
auth.onAuthStateChanged(user => {
  isLoggedIn = !!user;
  // ... avatar/dropdown logic as before ...
  fetchProfiles(); // Fetch profiles now that we know the current user
});

function renderProfiles(page) {
  const container = document.getElementById("profiles-container");
  container.innerHTML = "";

  const start = (page - 1) * PROFILES_PER_PAGE;
  const end = start + PROFILES_PER_PAGE;
  const currentProfiles = profiles.slice(start, end);

  currentProfiles.forEach(profile => {
    const profileCard = document.createElement("div");
    profileCard.className = "profile-card";

    profileCard.innerHTML = `
      <div class="profile-left">
        <div class="profile-photo">
          <img src="${profile.photoURL || 'https://via.placeholder.com/80'}" alt="${profile.name}">
        </div>
        <div>
          <h2>${profile.name}</h2>
          <div class="skills">
            <span class="label">Skills Offered =></span>
            ${profile.skillsOffered.map(skill => `<span class="skill">${skill}</span>`).join('')}
          </div>
          <div class="skills">
            <span class="label">Skill Wanted =></span>
            ${profile.skillsWanted.map(skill => `<span class="skill">${skill}</span>`).join('')}
          </div>
        </div>
      </div>
      <div class="profile-right">
        <button class="request-btn">Request</button>
        <div class="rating">Rating: ${profile.rating}/5</div>
      </div>
    `;
    container.appendChild(profileCard);
  });

  attachRequestListeners();
}

function renderPagination() {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(profiles.length / PROFILES_PER_PAGE);

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("span");
    pageBtn.textContent = i;
    pageBtn.classList.add("page-btn");
    if (i === currentPage) pageBtn.classList.add("active");

    pageBtn.addEventListener("click", () => {
      currentPage = i;
      renderProfiles(currentPage);
      renderPagination();
    });

    paginationContainer.appendChild(pageBtn);
  }
}

function attachRequestListeners() {
  document.querySelectorAll('.request-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!isLoggedIn) {
        alert("Please login to send a request.");
      } else {
        alert("Request sent!");
      }
    });
  });
}

// Initial Render
renderProfiles(currentPage);
renderPagination();
