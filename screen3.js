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

// ==== 2. Tag Input Utility ====
function makeTagInput(containerId) {
  const container = document.getElementById(containerId);
  const input = container.querySelector('input');
  let tags = [];

  function renderTags() {
    container.querySelectorAll('.tag').forEach(tag => tag.remove());
    tags.forEach((tagText, index) => {
      const tagEl = document.createElement('span');
      tagEl.className = 'tag';
      tagEl.textContent = tagText;
      const removeBtn = document.createElement('span');
      removeBtn.textContent = '×';
      removeBtn.className = 'remove-btn';
      removeBtn.onclick = () => {
        tags.splice(index, 1);
        renderTags();
      };
      tagEl.appendChild(removeBtn);
      container.insertBefore(tagEl, input);
    });
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim() !== '') {
      e.preventDefault();
      const newTag = input.value.trim();
      if (!tags.includes(newTag)) {
        tags.push(newTag);
        input.value = '';
        renderTags();
      }
    }
  });

  // Utility functions for getting/setting tags
  return {
    getTags: () => tags,
    setTags: (newTags) => {
      tags = Array.isArray(newTags) ? newTags : [];
      renderTags();
    }
  };
}

// ==== 3. Activate Tag Inputs ====
const skillsOfferedInput = makeTagInput("skills-offered");
const skillsWantedInput = makeTagInput("skills-wanted");

// ==== 4. Profile Data Load and Auth Check ====
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "screen2.html"; // Redirect to login if not logged in
    return;
  }

  // Real-time listener for user profile
  db.collection('users').doc(user.uid).onSnapshot(doc => {
    console.log('Snapshot:', doc.exists, doc.data());
    if (doc.exists) {
      const data = doc.data();
      document.querySelector('input[placeholder="Your name"]').value = data.name || '';
      document.querySelector('input[placeholder="Your city"]').value = data.location || '';
      document.querySelector('input[placeholder="e.g. weekends"]').value = data.availability || '';
      document.querySelector('.nav-avatar').src = data.photoURL || 'avatar.png';
      skillsOfferedInput.setTags(data.skillsOffered || []);
      skillsWantedInput.setTags(data.skillsWanted || []);
      document.querySelector('select').value = data.profileVisibility || 'Public';
    }
  });
});

// ==== 5. Save Profile Data ====
document.querySelector('.btn.save').addEventListener('click', () => {
  const user = auth.currentUser;
  if (!user) return;

  const name = document.querySelector('input[placeholder="Your name"]').value.trim();
  const location = document.querySelector('input[placeholder="Your city"]').value.trim();
  const availability = document.querySelector('input[placeholder="e.g. weekends"]').value.trim();
  const photoURL = document.querySelector('.nav-avatar').src;
  const profileVisibility = document.querySelector('select').value;
  const skillsOffered = skillsOfferedInput.getTags();
  const skillsWanted = skillsWantedInput.getTags();

  db.collection('users').doc(user.uid).set({
    name,
    location,
    availability,
    photoURL,
    profileVisibility,
    skillsOffered,
    skillsWanted
  }, { merge: true }).then(() => {
    alert('Profile updated!');
    // Optionally, reload or redirect
  });
});

// ==== 6. Discard Button (Reload Page) ====
document.querySelector('.btn.discard').addEventListener('click', () => {
  window.location.reload();
});

// ==== 7. Profile Photo Add/Edit (by URL) ====
document.querySelector('.photo-actions button').addEventListener('click', () => {
  const url = prompt("Enter new profile photo URL:");
  if (url) {
    document.querySelector('.nav-avatar').src = url;
  }
});

// ==== 8. Profile Photo Remove ====
document.querySelector('.photo-actions .remove').addEventListener('click', () => {
  document.querySelector('.nav-avatar').src = 'avatar.png';
});

const profileAvatar = document.getElementById("profile-avatar");
const profileDropdown = document.getElementById("profile-dropdown");
const profileLogoutBtn = document.getElementById("profile-logout-btn");

// Show/hide dropdown on avatar click
profileAvatar.addEventListener("click", (e) => {
  e.stopPropagation();
  profileDropdown.style.display = profileDropdown.style.display === "block" ? "none" : "block";
});

// Hide dropdown when clicking outside
document.addEventListener("click", () => {
  profileDropdown.style.display = "none";
});

// Logout button
profileLogoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    window.location.href = "screen2.html"; // Redirect to login page after logout
  });
});

// Optional: Show user's avatar from Firestore
auth.onAuthStateChanged(async user => {
  if (user) {
    const doc = await db.collection('users').doc(user.uid).get();
    let photoURL = 'avatar.png';
    if (doc.exists && doc.data().photoURL) {
      photoURL = doc.data().photoURL;
    }
    profileAvatar.src = photoURL;
  }
});

