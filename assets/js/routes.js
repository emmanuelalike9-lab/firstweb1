// paymentMethod.routes.js
// Routes for /api/v1/payment-methods

const express = require('express');
const router = express.Router();
const {
  getPaymentMethods,
  getPaymentMethodById,
  selectPaymentMethod,
} = require('./paymentMethod.controller');

// GET /api/v1/payment-methods
router.get('/', getPaymentMethods);

// GET /api/v1/payment-methods/:id
router.get('/:id', getPaymentMethodById);

// POST /api/v1/payment-methods/select
router.post('/select', selectPaymentMethod);

module.exports = router;

// In your main app file, mount with:
// const paymentMethodRoutes = require('./paymentMethod.routes');
// app.use('/api/v1/payment-methods', paymentMethodRoutes);