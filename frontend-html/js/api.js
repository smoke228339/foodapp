const API_URL = "http://localhost:5000/api/v1";

// Helper function to show messages
function showMessage(elementId, message, type) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.className = type + " show";
    setTimeout(() => {
      element.classList.remove("show");
    }, 5000);
  }
}

// Get auth token from localStorage
function getToken() {
  return localStorage.getItem("token");
}

// Set auth token
function setToken(token) {
  localStorage.setItem("token", token);
}

// Get current user
function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

// Set current user
function setCurrentUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

// Fetch with auth
async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response.json();
}

// Auth API calls
async function registerUser(userData) {
  return fetchWithAuth(`${API_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

async function loginUser(email, password) {
  return fetchWithAuth(`${API_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

async function logoutUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("cart");
}

// Restaurant API calls
async function getAllRestaurants() {
  return fetch(`${API_URL}/resturant/getall`).then((r) => r.json());
}

async function getRestaurant(id) {
  return fetch(`${API_URL}/resturant/get/${id}`).then((r) => r.json());
}

// Food API calls
async function getAllFood() {
  return fetch(`${API_URL}/food/getall`).then((r) => r.json());
}

async function getFoodByRestaurant(restId) {
  return fetch(`${API_URL}/food/get-by-restaurant/${restId}`).then((r) =>
    r.json(),
  );
}

async function getFoodByCategory(catId) {
  return fetch(`${API_URL}/food/get-by-category/${catId}`).then((r) =>
    r.json(),
  );
}

// Category API calls
async function getAllCategories() {
  return fetch(`${API_URL}/category/getall`).then((r) => r.json());
}

// Order API calls
async function createOrder(orderData) {
  return fetchWithAuth(`${API_URL}/orders/create`, {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

async function getUserOrders() {
  return fetchWithAuth(`${API_URL}/orders/user-orders`, {
    method: "GET",
  });
}

async function getOrder(id) {
  return fetchWithAuth(`${API_URL}/orders/get/${id}`, {
    method: "GET",
  });
}

// Cart functions
function getCart() {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(food) {
  const cart = getCart();
  const existingItem = cart.find((item) => item._id === food._id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...food, quantity: 1 });
  }

  saveCart(cart);
  alert("Item added to cart!");
}

function removeFromCart(foodId) {
  let cart = getCart();
  cart = cart.filter((item) => item._id !== foodId);
  saveCart(cart);
}

function updateQuantity(foodId, newQuantity) {
  const cart = getCart();
  const item = cart.find((item) => item._id === foodId);

  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(foodId);
    } else {
      item.quantity = newQuantity;
      saveCart(cart);
    }
  }
}

function updateCartCount() {
  const cart = getCart();
  const cartLink = document.querySelector(".cart-link");
  if (cartLink) {
    cartLink.textContent = `Cart (${cart.length})`;
  }
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Update navbar based on user status
function updateNavbar() {
  const user = getCurrentUser();
  const navContainer = document.querySelector("nav");

  if (!navContainer) return;

  if (user) {
    const existingLogout = document.querySelector(".logout-btn");
    if (!existingLogout) {
      navContainer.innerHTML = `
        <a href="index.html">Home</a>
        <span class="user-info">Hi, ${user.userName}</span>
        <a href="pages/orders.html">Orders</a>
        <a href="pages/cart.html" class="cart-link">Cart (0)</a>
        <button class="logout-btn" onclick="handleLogout()">Logout</button>
      `;
    }
  } else {
    navContainer.innerHTML = `
      <a href="index.html">Home</a>
      <a href="pages/login.html">Login</a>
      <a href="pages/register.html">Register</a>
    `;
  }

  updateCartCount();
}

function handleLogout() {
  logoutUser();
  updateNavbar();
  window.location.href = "index.html";
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", updateNavbar);
