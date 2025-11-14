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
    function displayGames() {
            gamesContainer.innerHTML = "";
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const paginatedGames = filteredGames.slice(start, end);

        paginatedGames.forEach(game => {
            const card = document.createElement("div");
            card.className = "bg-gray-800 rounded-xl p-4 hover:scale-105 hover:shadow-xl hover:shadow-red-600/30 transition duration-200 cursor-pointer";
            const platforms = game.platforms ? game.platforms.map(p => p.platform.name).join(", ") : "Unknown";
            const stores = game.stores ? game.stores.map(s => s.store.name).join(", ") : "Unknown";

            card.innerHTML = `
            <div class="relative">
                <img src="${game.background_image || 'https://via.placeholder.com/400x200'}" class="rounded-lg mb-3 w-full h-40 object-cover">
                <button class="absolute bottom-2 right-2 bg-black/60 p-1 rounded-full hover:bg-red-600 transition" title="Add to favorites">
                <span class="text-white text-lg">💗</span>
                </button>
            </div>
            <h3 class="text-lg font-semibold mb-1">${game.name}</h3>
            <p class="text-gray-400 text-sm mb-1">${game.genres.map(g => g.name).join(", ") || 'Unknown'}</p>
            `;
            const favBtn = card.querySelector("button");

            let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
            const isFavorite = favorites.some(f => f.id === game.id);
            if (isFavorite) {
            favBtn.classList.add("bg-red-600");
            }

            favBtn.addEventListener("click", (e) => {
            e.stopPropagation(); 

            const gameData = {
                id: game.id,
                name: game.name,
                background_image: game.background_image,
                genres: game.genres,
            };

            let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
            const exists = favorites.some(f => f.id === gameData.id);

            if (!exists) {
                favorites.push(gameData);
                localStorage.setItem("favorites", JSON.stringify(favorites));
                favBtn.classList.add("bg-red-600");

                
                gsap.fromTo(
                favBtn,
                { scale: 1, rotation: 0 },
                {
                    scale: 1.6,
                    rotation: 20,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    ease: "back.out(2)",
                }
                );

                gsap.to(favBtn, {
                backgroundColor: "bg-red", 
                duration: 0.3,
                });

            } else {
                favorites = favorites.filter(f => f.id !== gameData.id);
                localStorage.setItem("favorites", JSON.stringify(favorites));
                favBtn.classList.remove("bg-red-600");

                gsap.fromTo(
                favBtn,
                { scale: 1 },
                {
                    scale: 0.8,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    ease: "power1.inOut",
                }
                );
            }
            });
            card.addEventListener("click", () => {
            const genresText = game.genres.map((g) => g.name).join(", ") || "Unknown";
            const platformsText = game.platforms ? game.platforms.map(p => p.platform.name).join(", ") : "Unknown";
            const storesText = game.stores ? game.stores.map(s => s.store.name).join(", ") : "Unknown";

            document.getElementById("modalContent").style.backgroundImage = `url(${game.background_image || "https://via.placeholder.com/400x200"})`;
            modalTitle.textContent = game.name;
            modalGenre.textContent = `${genresText} • ${platformsText}`;
            modalDesc.innerHTML = `
                <p class="mb-2">${game.description_raw || game.description || "No description available."}</p>
                <p class="text-sm text-gray-300 mt-3">🛒 <strong>Available on:</strong> ${storesText}</p>
            `;

            modal.classList.remove("hidden");
            modal.classList.add("flex");
            });

            gamesContainer.appendChild(card);
        });
        }
        function setupPagination() {
        pagination.innerHTML = "";
        const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
        const maxVisibleButtons = 5; 

        const createButton = (text, page = null, active = false, disabled = false) => {
            const btn = document.createElement("button");
            btn.textContent = text;
            btn.className = `px-3 py-1 rounded-md mx-1 ${
            active ? "bg-red-600 text-white" : "bg-gray-700 hover:bg-gray-600"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;
            if (page && !disabled) {
            btn.addEventListener("click", () => {
                currentPage = page;
                displayGames();
                setupPagination();
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
            }
    pagination.appendChild(btn);
  };

        if (currentPage > 1) {
          createButton("«", 1);
        }

      
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
          createButton("1", 1);
          if (startPage > 2) createButton("...", null, false, true);
        }

        for (let i = startPage; i <= endPage; i++) {
          createButton(i, i, i === currentPage);
        }

        if (endPage < totalPages) {
          if (endPage < totalPages - 1) createButton("...", null, false, true);
          createButton(totalPages, totalPages);
        }

        if (currentPage < totalPages) {
          createButton("»", totalPages);
        }
      }