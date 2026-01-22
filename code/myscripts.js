const addToCartButtons = document.querySelectorAll(".add-to-cart");
const cart = document.querySelector(".cart");
let cartItems = [];

// Function to create quantity control + and - 
function createQuantityControl(productType, initialQuantity) {
  const quantityControl = document.createElement("div");
  quantityControl.className = "quantity-control";
  quantityControl.innerHTML = `
    <button class="decrease"><img src="/assets/images/decrease.svg" alt="icon"></button>
    <span class="quantity">${initialQuantity}</span>
    <button class="increase"><img src="/assets/images/increase.svg" alt="icon"></button>
  `;

  const decreaseButton = quantityControl.querySelector(".decrease");
  const increaseButton = quantityControl.querySelector(".increase");
  const quantitySpan = quantityControl.querySelector(".quantity");

  decreaseButton.addEventListener("click", () => updateQuantity(-1));
  increaseButton.addEventListener("click", () => updateQuantity(1));

  // function to update the number of the quantitySpan
  function updateQuantity(change) {
    let quantity = parseInt(quantitySpan.textContent);
    quantity = Math.max(1, quantity + change);
    quantitySpan.textContent = quantity;

    const item = cartItems.findIndex((item) => item.name === productType.querySelector("h5").textContent);
    if (item !== -1) {
      cartItems[item].quantity = quantity;
      updateCart();
    }
  }
  
  return quantityControl;
}

// Function to add an item to the cart
function addToCart(productType) {
  const name = productType.querySelector("h5").textContent;
  const price = parseFloat(productType.querySelector("h3").textContent.replace("$", ""));

  const addToCartButton = productType.querySelector(".add-to-cart");
  addToCartButton.style.display = "none";

  const quantityControl = createQuantityControl(productType, 1);
  productType.appendChild(quantityControl);

  cartItems.push({ name, price, quantity: 1 });
  updateCart();

  productType.querySelector("img").style.border = "2px solid #C73B0F";
}

// Function to update the cart with items
function updateCart() {
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  cart.innerHTML = `<h2>Your Cart (${totalQuantity})</h2>`;

  if (cartItems.length === 0) {
    // Header for an empty cart
    cart.innerHTML += `
      <div class="cart-empty">
        <img src="/assets/images/illustration-empty-cart.svg" alt="icon" />
        <p>Your added items will appear here</p>
      </div>
    `;
  } else {
    let cartContent = "";
    let total = 0;

    cartItems.forEach((item, index) => {
      // First part of your section
      cartContent += `
        <div class="cart-item">
          <span id="name-product">${item.name}</span>
          <div class="cart-item-quantity">
            <span id="quantity-product"><p>${item.quantity}x</p> @$${item.price.toFixed(2)}</span>
            <span id="total-quantity">$ ${(item.price * item.quantity).toFixed(2)}</span>
            <button class="btn-delete" data-index="${index}"><img src="/assets/images/x-circle.svg" alt="icon"></button>
          </div>
        </div>
      `;

      total += item.price * item.quantity;
    });

    // Second part of your cart section 
    cartContent += `
      <div class="cart-total"><span>Order Total:</span> $${total.toFixed(2)}</div>
      <div class="carbon-neutral">
        <p><img class="img-carbon-neutral" src="/assets/images/icon-carbon-neutral.svg" alt="icon"> This is a <span>carbon-neutral</span> delivery</p>
      </div>
      <div class="cart-btn">
        <button id="confirmBtn">Confirm Order</button>
      </div>
      <div id="popup">
        <img src="/assets/images/icon-order-confirmed.svg" alt="icon">
        <h2>Order Confirmed</h2>
        <p>Your order has been confirmed!</p>
        <div class="order-details">
          ${cartItems.map(item => `
            <div class="order-item">
              <img src="/assets/images/${item.name.toLowerCase().replace(/ /g, '-')}.jpg" alt="${item.name}">
              <div class="item-details">
                <span id="prodcut-name">${item.name}</span>
                <span id="product-qnt"><span>${item.quantity}x</span> @$${item.price.toFixed(2)}</span>
              </div>
              <span id="product-total">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
          <div class="order-total">
            <span>Order Total</span>
            <span>$${total.toFixed(2)}</span>
          </div>
        </div>
        <div class="order-total">
          <button id="closeBtn">Start New Order</button>
        </div>
      </div>
    `;

    cart.innerHTML += cartContent;

    // Show the popup
    const confirmBtn = cart.querySelector("#confirmBtn");
    confirmBtn.addEventListener("click", function () {
      const popup = document.getElementById("popup");
      popup.style.display = "block";
    });

    // Start New Order button functionality
    const closeBtn = document.getElementById("closeBtn");
    closeBtn.addEventListener("click", function () {
      const popup = document.getElementById("popup");
      popup.style.display = "none";
      
      // Reset cart and UI
      cartItems = [];
      updateCart();
      
      // Reset all product buttons to "Add to Cart" state
      const productTypes = document.querySelectorAll(".product-type");
      productTypes.forEach(productType => {
        const quantityControl = productType.querySelector(".quantity-control");
        if (quantityControl) {
          quantityControl.remove();
        }
        
        const addToCartButton = productType.querySelector(".add-to-cart");
        addToCartButton.style.display = "block";
        
        const img = productType.querySelector("img");
        if (img) img.style.border = "none";
      });
    });

    // Delete button functionality
    const deleteButtons = cart.querySelectorAll(".btn-delete");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        removeFromCart(index);
      });
    });
  }
}

// Function to remove an item from the cart
function removeFromCart(index) {
  const removedItem = cartItems[index];
  cartItems.splice(index, 1);
  updateCart();

  const productTypes = document.querySelectorAll(".product-type");
  productTypes.forEach((productType) => {
    const name = productType.querySelector("h5").textContent;
    if (name === removedItem.name) {
      const quantityControl = productType.querySelector(".quantity-control");
      if (quantityControl) {
        quantityControl.remove(); 
      }

      const addToCartButton = productType.querySelector(".add-to-cart");
      addToCartButton.style.display = "block"; 

      productType.querySelector("img").style.border = "none"; 
    }
  });
}

// Event listeners for adding products to the cart
addToCartButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const productType = this.closest(".product-type");
    addToCart(productType);
  });
});

updateCart();
