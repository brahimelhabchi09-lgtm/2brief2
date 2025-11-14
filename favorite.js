const favoritesContainer = document.getElementById("favoritesContainer");
    const modal = document.getElementById("modal");
    const closeModal = document.getElementById("closeModal");
    const modalContent = document.getElementById("modalContent");
    const modalTitle = document.getElementById("modalTitle");
    const modalGenre = document.getElementById("modalGenre");
    const modalDesc = document.getElementById("modalDesc");
    const modalPlatforms = document.getElementById("modalPlatforms");
    const modalStores = document.getElementById("modalStores");

   
    function loadFavorites() {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      favoritesContainer.innerHTML = "";

      if (favorites.length === 0) {
        favoritesContainer.innerHTML = "<p class='text-gray-400 text-center col-span-full'>No favorite games yet ❤️</p>";
        return;
      }

      favorites.forEach(game => {
        const card = document.createElement("div");
        card.className =
          "bg-gray-800 rounded-xl p-4 hover:scale-105 hover:shadow-xl hover:shadow-red-600/30 transition duration-200 cursor-pointer";

        card.innerHTML = `
          <img src="${game.background_image || "https://via.placeholder.com/400x200"}" class="rounded-lg mb-3 w-full h-40 object-cover">
          <h3 class="text-lg font-semibold mb-1">${game.name}</h3>
          <p class="text-gray-400 text-sm mb-1">${(game.genres || []).map(g => g.name).join(", ") || "Unknown"}</p>
          <button class="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md mt-2 remove-btn">Remove</button>
        `;
        card.addEventListener("click", async (e) => {
          if (e.target.classList.contains("remove-btn")) return;
          await openModal(game.id);
        });

       
        card.querySelector(".remove-btn").addEventListener("click", () => {
          removeFavorite(game.id);
        });

        favoritesContainer.appendChild(card);
      });

     
      gsap.fromTo(
        favoritesContainer.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" }
      );
    }
async function openModal(id) {
      try {
        const res = await fetch(`https://debuggers-games-api.duckdns.org/api/games/${id}`);
        const game = await res.json();

        modalContent.style.backgroundImage = `url(${game.background_image || "https://via.placeholder.com/400x200"})`;
        modalTitle.textContent = game.name;
        modalGenre.textContent = (game.genres || []).map(g => g.name).join(", ") || "Unknown";
        modalDesc.textContent = game.description_raw || game.description || "No description available.";

        modalPlatforms.innerHTML = `<strong class="text-red-400">Platforms:</strong> ${(game.platforms || [])
          .map(p => p.platform.name)
          .join(", ") || "N/A"}`;

        modalStores.innerHTML = `<strong class="text-red-400">Stores:</strong> ${(game.stores || [])
          .map(s => s.store.name)
          .join(", ") || "N/A"}`;

        modal.classList.remove("hidden");
        modal.classList.add("flex");
        gsap.fromTo("#modalContent", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
      } catch (err) {
        console.error("Error fetching game details:", err);
      }
    }
closeModal.addEventListener("click", () => {
      gsap.to("#modalContent", {
        scale: 0.8,
        opacity: 0,
        duration: 0.2,
        ease: "power1.in",
        onComplete: () => modal.classList.add("hidden"),
      });
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        gsap.to("#modalContent", {
          scale: 0.8,
          opacity: 0,
          duration: 0.2,
          ease: "power1.in",
          onComplete: () => modal.classList.add("hidden"),
        });
      }
    });
    loadFavorites();