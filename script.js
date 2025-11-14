    const apiUrl = "https://debuggers-games-api.duckdns.org/api/games";
    const gamesContainer = document.getElementById("gamesContainer");
    const pagination = document.getElementById("pagination");
    const searchInput = document.getElementById("searchInput");
    const genreFilter = document.getElementById("genreFilter");
    const modal = document.getElementById("modal");
    const closeModal = document.getElementById("closeModal");
    const modalImg = document.getElementById("modalImg");
    const modalTitle = document.getElementById("modalTitle");
    const modalGenre = document.getElementById("modalGenre");
    const modalDesc = document.getElementById("modalDesc");

    let games = [];
    let filteredGames = [];
    let currentPage = 1;
    const itemsPerPage = 20;

    async function fetchGames() {
      try {
        const res = await fetch('https://debuggers-games-api.duckdns.org/api/games?limit=4002');
        games = await res.json();
        filteredGames = games.results;
        displayGames();
        setupPagination();
      } catch (err) {
        gamesContainer.innerHTML = `<p class='text-red-400'>⚠️ Error loading games.</p>`;
      }
    }
    async function filterGames() {
      const searchText = searchInput.value.toLowerCase();
     const res = await fetch(`https://debuggers-games-api.duckdns.org/api/games?limit=100&search=${searchText}`);
        games = await res.json();
        filteredGames = games.results;
        currentPage = 1;
        displayGames();
        setupPagination();
    }
    async function filterGamesByGenre() {
      const Genre = genreFilter.value.toLowerCase();
      console.log(Genre);
      
     const res = await fetch(`https://debuggers-games-api.duckdns.org/api/games?limit=100&genre=${Genre}`);
        games = await res.json();
        filteredGames = games.results;
        currentPage = 1;
        displayGames();
        setupPagination();
    }