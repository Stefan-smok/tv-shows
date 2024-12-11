async function getPopularShows() {
  const response = await fetch(`https://api.tvmaze.com/shows`);
  const shows = await response.json();
  return shows.slice(0, 30); 
}

const showsContainer = document.getElementById("shows");
const noResultsContainer = document.getElementById("no-results");

function populateShows(shows) {
  showsContainer.innerHTML = "";
  noResultsContainer.style.display = "none";

  if (shows.length === 0) {
      noResultsContainer.innerHTML = `
          <img src="./images/no-results.png" alt="No Results" />
          <h2>No Results</h2>
          <p>Please change your search keyword</p>
      `;
      noResultsContainer.style.display = "flex";
  } else {
      shows.forEach((show) => {
          const showDivElement = document.createElement("div");
          showDivElement.classList.add("show");
          showDivElement.innerHTML = `
              <img class="show-img" src="${show.image ? show.image.medium : "./images/no-image.png"}" alt="${show.name} Poster" />
             <div class="rating">
                      <i class="fa-solid fa-star"></i> ${show.rating ? show.rating.average : "N/A"}
                  </div>
             
              <div class="show-data">
                  <h2>${show.name}</h2>
                  
                  <div class="genres">
                      ${show.genres.map((genre) => `<span class="genre">${genre}</span>`).join("")}
                  </div>
                  <div class="links">
                      <a href="${show.url}" target="_blank">Learn More</a>
                  </div>
              </div>`;

          showDivElement.addEventListener("click", () => {
              window.location.href = `episodes.html?id=${show.id}`;
          });

          showsContainer.appendChild(showDivElement);
      });
  }
}

async function getShows(searchTerm) {
  const response = await fetch(`https://api.tvmaze.com/search/shows?q=${searchTerm}`);
  const data = await response.json();
  return data.map(item => item.show); 
}

getPopularShows().then((shows) => {
  populateShows(shows);
});

const searchInput = document.getElementById("search-input");

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
      const later = () => {
          clearTimeout(timeout);
          func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
  };
};

function getData() {
  const searchValue = searchInput.value.trim();
  if (searchValue) {
      getShows(searchValue).then((shows) => {
          populateShows(shows);
      });
  } else {
      showsContainer.innerHTML = "";
      noResultsContainer.style.display = "none";
  }
}

let isLoggedIn = false;

document.getElementById('sign-in-btn').addEventListener('click', function() {
    window.location.href = 'login.html';
});

document.getElementById('sign-up-btn').addEventListener('click', function() {
    window.location.href = 'login.html';
});

document.getElementById('log-out-btn').addEventListener('click', function() {
    isLoggedIn = false;
    updateAuthButtons();
});

function updateAuthButtons() {
    const logOutButton = document.getElementById('log-out-btn');
    if (isLoggedIn) {
        logOutButton.style.display = 'block';
    } else {
        logOutButton.style.display = 'none';
    }
}

updateAuthButtons();

document.getElementById('sign-in-btn').addEventListener('click', function() {
    window.location.href = 'login.html'; 
});

document.getElementById('sign-up-btn').addEventListener('click', function() {
    window.location.href = 'login.html'; 
});

searchInput.addEventListener("input", debounce(getData, 500));