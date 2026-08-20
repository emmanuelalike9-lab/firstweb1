const FALLBACK_METHODS = [
  { id: 'card', name: 'Debit/Credit Card', description: 'Pay with Visa, Mastercard, or Verve card' },
  { id: 'bank_transfer', name: 'Bank Transfer', description: 'Pay via direct bank transfer' },
  { id: 'ussd', name: 'USSD', description: 'Pay using your bank USSD code' },
  { id: 'bank', name: 'Pay with Bank', description: 'Pay directly from your bank account' },
];

const grid = document.getElementById('methods-grid');
const statusEl = document.getElementById('status');
const continueBtn = document.getElementById('continue-btn');
const summaryEl = document.getElementById('selected-summary');
const totalEl = document.getElementById('order-total');
const countEl = document.getElementById('order-count');
const backBtn = document.getElementById('back-btn');
const gatewayPanel = document.getElementById('gateway-panel');
const gatewayTitle = document.getElementById('gateway-title');
const gatewayFields = document.getElementById('gateway-fields');
const paymentForm = document.getElementById('payment-form');

let selectedMethod = null;

function getCartTotal() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  return cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
}

function updateOrderSummary() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const itemCount = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const total = getCartTotal();

  if (totalEl) totalEl.textContent = `₦${total.toLocaleString()}`;
  if (countEl) countEl.textContent = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;
}

function partCode(index) {
  return 'PM-' + String(index + 1).padStart(2, '0');
}

function renderMethods(methods) {
  if (!methods || !methods.length) {
    grid.innerHTML = '<p class="loading">No payment methods available right now.</p>';
    return;
  }

  grid.innerHTML = '';

  methods.forEach((method, index) => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'method-tile';
    tile.setAttribute('role', 'radio');
    tile.setAttribute('aria-checked', 'false');
    tile.dataset.id = method.id;
    tile.dataset.name = method.name;
    tile.innerHTML = `
      <span class="method-code">${partCode(index)}</span>
      <span class="valve" aria-hidden="true"><span class="valve-handle"></span></span>
      <span class="method-name">${method.name}</span>
      <span class="method-desc">${method.description}</span>
    `;

    tile.addEventListener('click', () => selectMethod(tile, method));
    grid.appendChild(tile);
  });
}

function selectMethod(tile, method) {
  document.querySelectorAll('.method-tile').forEach((item) => {
    item.setAttribute('aria-checked', 'false');
  });

  tile.setAttribute('aria-checked', 'true');
  selectedMethod = method;
  summaryEl.textContent = `Selected: ${method.name}`;
  continueBtn.disabled = false;
  statusEl.textContent = `${method.name} has been selected.`;
}

function getGatewayFields(methodId) {
  const methodMap = {
    card: [
      { name: 'cardName', label: 'Cardholder name', type: 'text', placeholder: 'Full name on card' },
      { name: 'cardNumber', label: 'Card number', type: 'text', placeholder: '1234 5678 9012 3456' },
      { name: 'expiry', label: 'Expiry date', type: 'text', placeholder: 'MM/YY' },
      { name: 'cvv', label: 'CVV', type: 'password', placeholder: '123' },
    ],
    bank_transfer: [
      { name: 'bankName', label: 'Bank name', type: 'text', placeholder: 'Access Bank' },
      { name: 'accountName', label: 'Account name', type: 'text', placeholder: 'Account holder name' },
      { name: 'accountNumber', label: 'Account number', type: 'text', placeholder: '0123456789' },
      { name: 'reference', label: 'Transfer reference', type: 'text', placeholder: 'Order payment ref' },
    ],
    ussd: [
      { name: 'bankName', label: 'Bank name', type: 'text', placeholder: 'First Bank' },
      { name: 'phoneNumber', label: 'Phone number', type: 'tel', placeholder: '0802 000 0000' },
      { name: 'ussdCode', label: 'USSD code', type: 'text', placeholder: '*737#' },
    ],
    bank: [
      { name: 'bankName', label: 'Bank name', type: 'text', placeholder: 'Zenith Bank' },
      { name: 'accountName', label: 'Account holder', type: 'text', placeholder: 'Account holder name' },
      { name: 'accountNumber', label: 'Account number', type: 'text', placeholder: '0123456789' },
    ],
  };

  return methodMap[methodId] || [
    { name: 'details', label: 'Payment details', type: 'text', placeholder: 'Enter your payment details' },
  ];
}

function renderGatewayForm() {
  if (!selectedMethod) return;

  gatewayTitle.textContent = `Pay with ${selectedMethod.name}`;
  const fields = getGatewayFields(selectedMethod.id);

  gatewayFields.innerHTML = fields.map((field, index) => {
    const fullWidth = index === fields.length - 1 && fields.length % 2 !== 0 ? ' full' : '';
    return `
      <div class="field-group${fullWidth}">
        <label for="${field.name}">${field.label}</label>
        <input id="${field.name}" name="${field.name}" type="${field.type}" placeholder="${field.placeholder}" required>
      </div>
    `;
  }).join('');

  gatewayPanel.classList.remove('hidden');
  gatewayPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleContinue() {
  if (!selectedMethod) return;

  localStorage.setItem('selectedPaymentMethod', JSON.stringify({
    id: selectedMethod.id,
    name: selectedMethod.name,
  }));

  renderGatewayForm();
  statusEl.textContent = `${selectedMethod.name} selected. Please complete your payment details.`;
}

function savePaymentRecord(details, statusText) {
  const paymentRecord = {
    method: selectedMethod.name,
    methodId: selectedMethod.id,
    amount: getCartTotal(),
    details,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem('paymentRecord', JSON.stringify(paymentRecord));
  localStorage.removeItem('cart');
  statusEl.textContent = statusText;

  setTimeout(() => {
    window.location.href = 'success.html';
  }, 800);
}

function payWithPaystack() {
  const cartTotal = getCartTotal();
  const orderRef = `OSH-${Date.now()}`;
  const customerEmail = localStorage.getItem('customerEmail') || 'customer@example.com';

  if (!window.PaystackPop) {
    statusEl.textContent = 'Paystack is not available right now. Please try again later.';
    return;
  }

  const handler = window.PaystackPop.setup({
    key: 'pk_test_8b84081446ac4e5612588b0dff088be0e42a1706',
    email: customerEmail,
    amount: Math.round(cartTotal * 100),
    currency: 'NGN',
    ref: orderRef,
    callback: function(response) {
      savePaymentRecord({ reference: response.reference, status: 'paid' }, `Payment successful for ${selectedMethod.name}. Reference: ${response.reference}`);
      paymentForm.reset();
    },
    onClose: function() {
      statusEl.textContent = 'Payment popup closed. Your payment was not completed.';
    }
  });

  handler.openIframe();
}

function handlePaymentSubmit(event) {
  event.preventDefault();

  if (!selectedMethod) {
    statusEl.textContent = 'Please select a payment method first.';
    return;
  }

  const formData = new FormData(paymentForm);
  const entries = Object.fromEntries(formData.entries());

  if (selectedMethod.id === 'card') {
    payWithPaystack();
    return;
  }

  savePaymentRecord(entries, `Payment submitted successfully for ${selectedMethod.name}.`);
  paymentForm.reset();
}

async function loadMethods() {
  try {
    const res = await fetch('/api/v1/payment-methods');
    if (!res.ok) throw new Error('Request failed');

    const json = await res.json();
    renderMethods(json.data || []);
  } catch (error) {
    renderMethods(FALLBACK_METHODS);
    statusEl.textContent = 'Showing default payment options because the live payment feed is unavailable.';
  }
}

if (backBtn) {
  backBtn.addEventListener('click', () => {
    window.history.back();
  });
}

if (continueBtn) {
  continueBtn.addEventListener('click', handleContinue);
}

if (paymentForm) {
  paymentForm.addEventListener('submit', handlePaymentSubmit);
}

updateOrderSummary();
loadMethods();