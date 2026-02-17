function searchRecipes(searchTerm) {
    const searchContainer = document.getElementById("search-container");
    const resultsContainer = document.getElementById("results-container");
    const resultsGrid = document.getElementById("results-grid");
    const noResults = document.getElementById("no-results");

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`)
        .then(response => response.json())
        .then(data => {
            searchContainer.classList.add("hidden");
            resultsContainer.classList.remove("hidden");

            resultsGrid.innerHTML = "";
            noResults.classList.add("hidden");

            if (!data.meals || data.meals.length === 0) {
                noResults.classList.remove("hidden");
                return;
            }

            for (let i = 0; i < data.meals.length; i++) {
                const meal = data.meals[i];
                const card = document.createElement("article");
                card.className = "meal-card";
                card.innerHTML = `
                    <div class="meal-card-image-wrap">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy">
                    </div>
                    <h3 class="meal-card-title">${meal.strMeal}</h3>
                `;
                resultsGrid.appendChild(card);
            }
        })
        .catch(error => {
            console.error("Error fetching recipes:", error);
            resultsGrid.innerHTML = "";
            noResults.textContent = "Something went wrong. Please try again.";
            noResults.classList.remove("hidden");
        });
}

function showSearch() {
    document.getElementById("search-container").classList.remove("hidden");
    document.getElementById("results-container").classList.add("hidden");
    // Only clear the grid and no-results, so the "Search again" header stays in the DOM
    const resultsGrid = document.getElementById("results-grid");
    const noResults = document.getElementById("no-results");
    if (resultsGrid) resultsGrid.innerHTML = "";
    if (noResults) {
        noResults.classList.add("hidden");
        noResults.textContent = "No meals found. Try another search.";
    }
}
