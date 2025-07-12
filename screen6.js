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

  let allRequests = [];
  let filteredRequests = [];
  const REQUESTS_PER_PAGE = 5;
  let currentPage = 1;

  // Real-time Listener for Requests
  function listenForRequests() {
  auth.onAuthStateChanged(user => {
    if (!user) return;
    db.collection('swap_requests')
      .where('to', '==', user.uid)
      .orderBy('timestamp', 'desc')
      .onSnapshot(async snapshot => {
        const requests = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        const senders = await Promise.all(requests.map(req =>
          db.collection('users').doc(req.from).get().then(senderDoc =>
            senderDoc.exists ? senderDoc.data() : { name: "Unknown", photoURL: "avatar.png" }
          )
        ));
        allRequests = requests.map((req, i) => ({ ...req, sender: senders[i] }));
        applyFiltersAndRender();
      });
  });
}


  // Apply Filters and Render
  function applyFiltersAndRender() {
    const statusFilter = document.getElementById('statusFilter').value;
    const searchValue = document.getElementById('searchBox').value.toLowerCase();

    filteredRequests = allRequests.filter(r =>
      (statusFilter === "" || r.status === statusFilter) &&
      (
        (r.sender.name && r.sender.name.toLowerCase().includes(searchValue)) ||
        (r.offeredSkill && r.offeredSkill.toLowerCase().includes(searchValue)) ||
        (r.wantedSkill && r.wantedSkill.toLowerCase().includes(searchValue))
      )
    );

    renderRequests(currentPage);
    renderPagination();
  }

  // Render Requests
  function renderRequests(page) {
    const list = document.getElementById('requests-list');
    list.innerHTML = "";

    const start = (page - 1) * REQUESTS_PER_PAGE;
    const end = start + REQUESTS_PER_PAGE;
    const pageRequests = filteredRequests.slice(start, end);

    pageRequests.forEach(req => {
      const card = document.createElement('div');
      card.className = 'request-card';
      card.innerHTML = `
        <div class="card-left">
          <div class="profile-pic">
            <img src="${req.sender.photoURL || 'avatar.png'}" alt="${req.sender.name}" style="width:60px;height:60px;border-radius:50%;">
          </div>
          <div class="user-info">
            <h3>${req.sender.name}</h3>
            <p><span class="label">Skills Offered</span> <button class="tag">${req.offeredSkill}</button></p>
            <p><span class="label">Skills Wanted</span> <button class="tag blue">${req.wantedSkill}</button></p>
          </div>
        </div>
        <div class="card-right">
          <p class="status">Status: <span class="${req.status.toLowerCase()}">${req.status}</span></p>
          ${req.status === "Pending" ? `
          <div class="actions">
            <button class="accept-btn">Accept</button>
            <button class="reject-btn">Reject</button>
          </div>` : ''}
        </div>
      `;
      list.appendChild(card);

      // Accept/Reject handlers
      if (req.status === "Pending") {
        card.querySelector('.accept-btn').addEventListener('click', () => updateStatus(req.id, "Accepted"));
        card.querySelector('.reject-btn').addEventListener('click', () => updateStatus(req.id, "Rejected"));
      }
    });

    if (pageRequests.length === 0) {
      list.innerHTML = "<p>No requests found.</p>";
    }
  }

  // Update Request Status
  function updateStatus(requestId, status) {
    db.collection('swap_requests').doc(requestId).update({ status })
      .catch(() => alert("Failed to update request status."));
  }

  // Pagination
  function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = "";
    const totalPages = Math.ceil(filteredRequests.length / REQUESTS_PER_PAGE);

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = 'page-btn page-number' + (i === currentPage ? ' active' : '');
      btn.textContent = i;
      btn.addEventListener('click', () => {
        currentPage = i;
        renderRequests(currentPage);
        renderPagination();
      });
      pagination.appendChild(btn);
    }
  }

  // Filters & Search Event Listeners
  document.getElementById('statusFilter').addEventListener('change', () => {
    currentPage = 1;
    applyFiltersAndRender();
  });
  document.querySelector('.search-btn').addEventListener('click', () => {
    currentPage = 1;
    applyFiltersAndRender();
  });

  // Initialize
  listenForRequests();
});