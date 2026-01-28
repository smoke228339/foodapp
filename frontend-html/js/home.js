async function loadRestaurants() {
  try {
    const result = await getAllRestaurants();
    const grid = document.getElementById("restaurantsGrid");

    if (result.success && result.restaurants) {
      grid.innerHTML = result.restaurants
        .map(
          (restaurant) => `
        <div class="card">
          ${restaurant.imageUrl ? `<img src="${restaurant.imageUrl}" alt="${restaurant.title}" class="card-image">` : '<div class="card-image"></div>'}
          <div class="card-body">
            <h3 class="card-title">${restaurant.title}</h3>
            <p class="card-rating">⭐ ${restaurant.rating || "N/A"} ${restaurant.ratingCount ? `(${restaurant.ratingCount})` : ""}</p>
            <p class="card-status">${restaurant.isOpen ? "✅ Open" : "❌ Closed"}</p>
            ${restaurant.delivery ? '<p class="tag">🚗 Delivery Available</p>' : ""}
            ${restaurant.pickup ? '<p class="tag">🎁 Pickup Available</p>' : ""}
          </div>
        </div>
      `,
        )
        .join("");
    } else {
      grid.innerHTML = "<p>No restaurants available</p>";
    }
  } catch (error) {
    console.error("Error loading restaurants:", error);
    document.getElementById("restaurantsGrid").innerHTML =
      "<p>Error loading restaurants</p>";
  }
}

async function loadFoods() {
  try {
    const result = await getAllFood();
    const grid = document.getElementById("foodsGrid");

    if (result.success && result.foods) {
      grid.innerHTML = result.foods
        .map(
          (food) => `
        <div class="card">
          ${food.imageUrl ? `<img src="${food.imageUrl}" alt="${food.title}" class="card-image">` : '<div class="card-image"></div>'}
          <div class="card-body">
            <h3 class="card-title">${food.title}</h3>
            <p class="card-description">${food.description || ""}</p>
            <p class="card-price">$${food.price}</p>
            ${food.catgeory ? `<span class="tag">${food.catgeory}</span>` : ""}
            <button class="add-to-cart-btn" onclick="addToCart(${JSON.stringify(food).replace(/"/g, "&quot;")})">
              Add to Cart
            </button>
          </div>
        </div>
      `,
        )
        .join("");
    } else {
      grid.innerHTML = "<p>No foods available</p>";
    }
  } catch (error) {
    console.error("Error loading foods:", error);
    document.getElementById("foodsGrid").innerHTML =
      "<p>Error loading foods</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadRestaurants();
  loadFoods();
});
