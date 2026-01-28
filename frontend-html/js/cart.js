function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cartContent");

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Start adding delicious items to your cart!</p>
        <button class="continue-btn" onclick="window.location.href='../index.html'">Continue Shopping</button>
      </div>
    `;
    return;
  }

  const total = getCartTotal();
  const deliveryFee = total > 0 ? 5 : 0;
  const grandTotal = total + deliveryFee;

  container.innerHTML = `
    <div class="cart-content">
      <div class="cart-items">
        ${cart
          .map(
            (item) => `
          <div class="cart-item">
            ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.title}" class="item-image">` : '<div class="item-image"></div>'}
            <div class="item-details">
              <h3>${item.title}</h3>
              <p>${item.description || ""}</p>
              <p class="item-price">$${item.price}</p>
            </div>
            <div class="item-quantity">
              <button onclick="updateQuantity('${item._id}', ${item.quantity - 1})">-</button>
              <span>${item.quantity}</span>
              <button onclick="updateQuantity('${item._id}', ${item.quantity + 1})">+</button>
            </div>
            <div class="item-total">$${(item.price * item.quantity).toFixed(2)}</div>
            <button class="remove-btn" onclick="removeItem('${item._id}')">✕</button>
          </div>
        `,
          )
          .join("")}
      </div>
      <div class="cart-summary">
        <h3>Order Summary</h3>
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>$${total.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span>Delivery Fee:</span>
          <span>$${deliveryFee.toFixed(2)}</span>
        </div>
        <div class="summary-row total">
          <span>Total:</span>
          <span>$${grandTotal.toFixed(2)}</span>
        </div>
        <button class="checkout-btn" onclick="handleCheckout()">Proceed to Checkout</button>
        <button class="continue-btn" onclick="window.location.href='../index.html'">Continue Shopping</button>
      </div>
    </div>
  `;
}

function removeItem(foodId) {
  removeFromCart(foodId);
  renderCart();
}

function updateItem(foodId, newQuantity) {
  updateQuantity(foodId, newQuantity);
  renderCart();
}

function handleCheckout() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  alert("Checkout coming soon!");
}

document.addEventListener("DOMContentLoaded", renderCart);
