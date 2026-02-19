function searchRecipes(searchTerm) {
    const searchContainer = document.getElementById("search-container");
    const resultsContainer = document.getElementById("results-container");
    const resultsGrid = document.getElementById("results-grid");
    const noResults = document.getElementById("no-results");
    const loadingState = document.getElementById("loading-state");

    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm) return;

    searchContainer.classList.add("hidden");
    resultsContainer.classList.remove("hidden");
    resultsGrid.innerHTML = "";
    noResults.classList.add("hidden");
    loadingState.classList.remove("hidden");

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(trimmedTerm)}`)
        .then(response => response.json())
        .then(data => {
            loadingState.classList.add("hidden");

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
                    <p class="meal-card-category">${meal.strCategory || "Uncategorized"}</p>
                `;
                card.addEventListener("click", () => openMealDetails(meal));
                resultsGrid.appendChild(card);
            }
        })
        .catch(error => {
            console.error("Error fetching recipes:", error);
            loadingState.classList.add("hidden");
            resultsGrid.innerHTML = "";
            noResults.textContent = "Something went wrong. Please try again.";
            noResults.classList.remove("hidden");
        });
}

function showSearch() {
    document.getElementById("search-container").classList.remove("hidden");
    document.getElementById("results-container").classList.add("hidden");
    document.getElementById("loading-state").classList.add("hidden");
    closeMealDetails();
    // Only clear the grid and no-results, so the "Search again" header stays in the DOM
    const resultsGrid = document.getElementById("results-grid");
    const noResults = document.getElementById("no-results");
    if (resultsGrid) resultsGrid.innerHTML = "";
    if (noResults) {
        noResults.classList.add("hidden");
        noResults.textContent = "No meals found. Try another search.";
    }
}

function getIngredients(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            const formatted = `${measure ? measure.trim() : ""} ${ingredient.trim()}`.trim();
            ingredients.push(formatted);
        }
    }
    return ingredients;
}

function openMealDetails(meal) {
    const modal = document.getElementById("meal-modal");
    const image = document.getElementById("modal-image");
    const category = document.getElementById("modal-category");
    const title = document.getElementById("meal-modal-title");
    const ingredientsList = document.getElementById("modal-ingredients");
    const instructions = document.getElementById("modal-instructions");
    const youtubeLink = document.getElementById("modal-youtube");

    image.src = meal.strMealThumb || "";
    image.alt = meal.strMeal || "Meal image";
    category.textContent = `Category: ${meal.strCategory || "Uncategorized"}`;
    title.textContent = meal.strMeal || "Meal Details";
    instructions.textContent = meal.strInstructions || "No instructions available.";

    const ingredients = getIngredients(meal);
    ingredientsList.innerHTML = "";
    for (let i = 0; i < ingredients.length; i++) {
        const item = document.createElement("li");
        item.textContent = ingredients[i];
        ingredientsList.appendChild(item);
    }

    if (meal.strYoutube && meal.strYoutube.trim()) {
        youtubeLink.href = meal.strYoutube;
        youtubeLink.classList.remove("hidden");
    } else {
        youtubeLink.href = "#";
        youtubeLink.classList.add("hidden");
    }

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

function closeMealDetails() {
    const modal = document.getElementById("meal-modal");
    modal.classList.add("hidden");
    document.body.style.overflow = "";
}

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeMealDetails();
    }
});
