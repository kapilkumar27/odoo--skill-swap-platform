let isLoggedIn = false;

// Mock profile data
const profiles = [
  {
    name: "Marc Demo",
    photoURL: "https://i.pravatar.cc/150?img=1",
    skillsOffered: ["JavaScript", "Python"],
    skillsWanted: ["Graphic Designer"],
    rating: 3.9
  },
  {
    name: "Michell",
    photoURL: "https://i.pravatar.cc/150?img=2",
    skillsOffered: ["Python", "Graphic Designer"],
    skillsWanted: ["UI/UX"],
    rating: 2.5
  },
  {
    name: "Joe Wills",
    photoURL: "https://i.pravatar.cc/150?img=3",
    skillsOffered: ["NodeJS", "Graphic Designer"],
    skillsWanted: ["Python"],
    rating: 4.0
  },
  {
    name: "Anna Smith",
    photoURL: "https://i.pravatar.cc/150?img=4",
    skillsOffered: ["C++", "Java"],
    skillsWanted: ["Web Design"],
    rating: 3.7
  },
  {
    name: "Ravi Kumar",
    photoURL: "https://i.pravatar.cc/150?img=5",
    skillsOffered: ["Java", "SQL"],
    skillsWanted: ["App Design"],
    rating: 4.2
  },
  {
    name: "Sara Lee",
    photoURL: "https://i.pravatar.cc/150?img=6",
    skillsOffered: ["UI Design"],
    skillsWanted: ["Python"],
    rating: 3.5
  },
  {
    name: "David Kim",
    photoURL: "https://i.pravatar.cc/150?img=7",
    skillsOffered: ["JavaScript"],
    skillsWanted: ["Graphic Designer"],
    rating: 4.3
  },
  {
    name: "Lina Gomez",
    photoURL: "https://i.pravatar.cc/150?img=8",
    skillsOffered: ["HTML", "CSS"],
    skillsWanted: ["JavaScript"],
    rating: 3.8
  },
  {
    name: "Tom Holland",
    photoURL: "https://i.pravatar.cc/150?img=9",
    skillsOffered: ["Python"],
    skillsWanted: ["C++"],
    rating: 4.1
  },
  {
    name: "Akira Tanaka",
    photoURL: "https://i.pravatar.cc/150?img=10",
    skillsOffered: ["React", "NodeJS"],
    skillsWanted: ["UI Design"],
    rating: 4.4
  },
  {
    name: "Emily White",
    photoURL: "https://i.pravatar.cc/150?img=11",
    skillsOffered: ["Java"],
    skillsWanted: ["Graphic Designer"],
    rating: 3.6
  },
  {
    name: "Nina Patel",
    photoURL: "https://i.pravatar.cc/150?img=12",
    skillsOffered: ["C#", "ASP.NET"],
    skillsWanted: ["JavaScript"],
    rating: 3.9
  },
  {
    name: "Chris Evans",
    photoURL: "https://i.pravatar.cc/150?img=13",
    skillsOffered: ["VueJS", "HTML"],
    skillsWanted: ["NodeJS"],
    rating: 4.0
  },
  {
    name: "Liam James",
    photoURL: "https://i.pravatar.cc/150?img=14",
    skillsOffered: ["Django", "Python"],
    skillsWanted: ["UI Design"],
    rating: 3.7
  },
  {
    name: "Eva Green",
    photoURL: "https://i.pravatar.cc/150?img=15",
    skillsOffered: ["Java", "Spring"],
    skillsWanted: ["Python"],
    rating: 4.2
  },
  {
    name: "Zara Ali",
    photoURL: "https://i.pravatar.cc/150?img=16",
    skillsOffered: ["Android", "Kotlin"],
    skillsWanted: ["iOS"],
    rating: 3.5
  },
  {
    name: "Samir Roy",
    photoURL: "https://i.pravatar.cc/150?img=17",
    skillsOffered: ["MongoDB", "NodeJS"],
    skillsWanted: ["React"],
    rating: 4.1
  },
  {
    name: "Olivia Lee",
    photoURL: "https://i.pravatar.cc/150?img=18",
    skillsOffered: ["HTML", "Bootstrap"],
    skillsWanted: ["UX"],
    rating: 3.9
  },
  {
    name: "Harshit Mehta",
    photoURL: "https://i.pravatar.cc/150?img=19",
    skillsOffered: ["PHP", "MySQL"],
    skillsWanted: ["JavaScript"],
    rating: 3.6
  },
  {
    name: "Jenny Clarke",
    photoURL: "https://i.pravatar.cc/150?img=20",
    skillsOffered: ["Swift", "iOS"],
    skillsWanted: ["Android"],
    rating: 4.3
  },
  {
    name: "Victor Hugo",
    photoURL: "https://i.pravatar.cc/150?img=21",
    skillsOffered: ["Python", "Flask"],
    skillsWanted: ["React"],
    rating: 4.0
  }
];

const PROFILES_PER_PAGE = 4;
let currentPage = 1;

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

document.getElementById("login-btn").addEventListener("click", () => {
  isLoggedIn = true;
  alert("You are now logged in!");
});

// Initial Render
renderProfiles(currentPage);
renderPagination();
