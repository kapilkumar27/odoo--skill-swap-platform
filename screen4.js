document.addEventListener("DOMContentLoaded", () => {
  // Firebase Initialization
  const firebaseConfig = {
    apiKey: "AIzaSyAGHahrN5eAzzcIp3lb0wyjqWe-AxRDtyU",
    authDomain: "skill-swap-plat.firebaseapp.com",
    projectId: "skill-swap-plat",
    storageBucket: "skill-swap-plat.firebasestorage.app",
    messagingSenderId: "322475779127",
    appId: "1:322475779127:web:9880aeadb6bc675abe4bb2"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const auth = firebase.auth();

  // Utility: Get Query Parameter
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  const selectedUid = getQueryParam('uid');

  // Fetch and Render Selected User Profile
  async function loadProfile() {
    if (!selectedUid) {
      document.getElementById('profile-name').textContent = "User not found.";
      return;
    }
    const doc = await db.collection('users').doc(selectedUid).get();
    if (!doc.exists) {
      document.getElementById('profile-name').textContent = "User not found.";
      return;
    }
    const data = doc.data();
    document.getElementById('profile-name').textContent = data.name || "No Name";
    document.getElementById('skills-offered').textContent = (data.skillsOffered || []).join(', ');
    document.getElementById('skills-wanted').textContent = (data.skillsWanted || []).join(', ');
    document.getElementById('rating-feedback').textContent =
      `⭐ ${data.rating || '-'} /5 — “${data.feedback || ''}”`;
    document.getElementById('profile-photo').innerHTML =
      `<img src="${data.photoURL || 'avatar.png'}" alt="${data.name}" style="width:100px;height:100px;border-radius:50%;">`;

    // Populate modal selects
    const offeredSelect = document.getElementById('offeredSkill');
    const wantedSelect = document.getElementById('wantedSkill');
    offeredSelect.innerHTML = '<option disabled selected>Select your skill</option>';
    wantedSelect.innerHTML = '<option disabled selected>Select their skill</option>';

    auth.onAuthStateChanged(async user => {
      if (user) {
        const userDoc = await db.collection('users').doc(user.uid).get();
        const userData = userDoc.data() || {};
        (userData.skillsOffered || []).forEach(skill => {
          const opt = document.createElement('option');
          opt.value = opt.textContent = skill;
          offeredSelect.appendChild(opt);
        });
      }
      (data.skillsWanted || []).forEach(skill => {
        const opt = document.createElement('option');
        opt.value = opt.textContent = skill;
        wantedSelect.appendChild(opt);
      });
    });
  }
  loadProfile();

  // Modal Logic
  const modal = document.getElementById("swapModal");
  const requestBtn = document.querySelector(".request-btn");
  const closeBtn = document.getElementById("closeModal");

  requestBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
  window.addEventListener("click", e => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Send Swap Request
  document.querySelector(".submit-btn").addEventListener("click", async () => {
    const offeredSkill = document.getElementById('offeredSkill').value;
    const wantedSkill = document.getElementById('wantedSkill').value;
    const message = document.getElementById('message').value;
    const toUid = selectedUid;

    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in.");
      return;
    }
    if (!offeredSkill || !wantedSkill) {
      alert("Please select both skills.");
      return;
    }

    await db.collection('swap_requests').add({
      from: user.uid,
      to: toUid,
      offeredSkill,
      wantedSkill,
      message,
      status: "Pending",
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Swap request sent!");
    modal.style.display = "none";
  });
});
