async function loadOrders() {
  const user = getCurrentUser();
  const container = document.getElementById("ordersContent");

  if (!user) {
    container.innerHTML = `
      <p class="no-orders">Please <a href="login.html">login</a> to view your orders.</p>
    `;
    return;
  }

  try {
    container.innerHTML = '<p class="loading">Loading orders...</p>';

    const result = await getUserOrders();

    if (result.success && result.orders && result.orders.length > 0) {
      container.innerHTML = `
        <div class="orders-list">
          ${result.orders
            .map(
              (order) => `
            <div class="order-card">
              <div class="order-header">
                <div>
                  <h3>Order #${order._id.slice(-6).toUpperCase()}</h3>
                  <p class="order-date">${new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="status ${order.status}">
                  ${order.status}
                </div>
              </div>
              <div class="order-items">
                <h4>Items (${order.foods?.length || 0})</h4>
                <ul>
                  ${
                    order.foods && order.foods.length > 0
                      ? order.foods
                          .map(
                            (food, idx) =>
                              `<li>${food.title || `Item ${idx + 1}`}</li>`,
                          )
                          .join("")
                      : "<li>No items in this order</li>"
                  }
                </ul>
              </div>
              <div class="order-footer">
                <p class="order-total">Total: $${order.payment?.amount || "N/A"}</p>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="no-orders">
          <p>No orders yet. Start ordering now!</p>
          <button class="shop-btn" onclick="window.location.href='../index.html'">Start Shopping</button>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error loading orders:", error);
    container.innerHTML =
      '<p class="error show">Error loading orders. Please try again.</p>';
  }
}

document.addEventListener("DOMContentLoaded", loadOrders);
