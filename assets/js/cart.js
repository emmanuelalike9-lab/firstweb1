// Cart Page Functionality

// Load and display cart items from localStorage
function loadCart() {
    const cartItems = getCartItems();
    const cartTableBody = document.getElementById('cartItems');
    
    // Clear existing rows
    cartTableBody.innerHTML = '';
    
    if (cartItems.length === 0) {
        checkEmptyCart();
        return;
    }
    
    // Create rows for each item
    cartItems.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'cart-item';
        row.setAttribute('data-product-id', item.id);
        
        row.innerHTML = `
            <td class="product-name">${item.name}</td>
            <td class="price">₦${item.price.toLocaleString()}</td>
            <td class="quantity">
                <button class="qty-btn minus" onclick="updateQuantity('${item.id}', -1)">-</button>
                <input type="number" class="qty-input" value="${item.quantity}" min="1">
                <button class="qty-btn plus" onclick="updateQuantity('${item.id}', 1)">+</button>
            </td>
            <td class="item-total">₦${(item.price * item.quantity).toLocaleString()}</td>
            <td class="action">
                <button class="remove-btn" onclick="removeItem('${item.id}')">Remove</button>
            </td>
        `;
        
        cartTableBody.appendChild(row);
    });
    
    // Update totals and check if empty
    updateCartTotals();
    checkEmptyCart();
}

// Update quantity
function updateQuantity(productId, change) {
    let cart = getCartItems();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

// Remove item from cart
function removeItem(productId) {
    let cart = getCartItems();
    const item = cart.find(item => item.id === productId);
    const itemName = item ? item.name : 'Item';
    
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification(`${itemName} removed from cart`);
    loadCart();
}

// Update cart totals
function updateCartTotals() {
    let subtotal = 0;
    const cartItems = getCartItems();

    cartItems.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    // Calculate totals
    const shipping = 10;
    const Delivery_fee = subtotal * 0.026; // 2.6% Delivery_fee
    const total = subtotal + shipping + Delivery_fee;

    // Update display
    document.getElementById('subtotal').textContent = `₦${subtotal.toLocaleString()}`;
    document.getElementById('shipping').textContent = `₦${shipping.toLocaleString()}`;
    document.getElementById('Delivery_fee').textContent = `₦${Delivery_fee.toLocaleString()}`;
    document.getElementById('total').textContent = `₦${total.toLocaleString()}`;
}

// Check if cart is empty
function checkEmptyCart() {
    const cartItems = getCartItems();
    const emptyMessage = document.getElementById('emptyMessage');
    const tableElement = document.querySelector('.items-table');
    
    if (cartItems.length === 0) {
        if (tableElement) tableElement.style.display = 'none';
        emptyMessage.style.display = 'block';
    } else {
        if (tableElement) tableElement.style.display = 'table';
        emptyMessage.style.display = 'none';
    }
}

// Checkout button functionality
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cartItems = getCartItems();
            if (cartItems.length === 0) {
                alert('Your cart is empty. Please add items before checking out.');
            } else {
                alert('Thank you for your purchase! Proceeding to payment...');
                // In a real application, this would redirect to checkout page
                // clearCart();
                // loadCart();
            }
        });
    }
});

// Allow quantity input to update totals
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('qty-input')) {
        updateCartTotals();
    }
});

// Initial setup - load cart when page loads
window.addEventListener('load', function() {
    loadCart();
});
