const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        required: true,
      },
      size: {
        type: String,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['wave', 'orange_money', 'free_money', 'card'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['en_attente', 'paye', 'echoue'],
    default: 'en_attente',
  },
  orderStatus: {
    type: String,
    enum: ['en_attente', 'confirmee', 'expediee', 'livree', 'annulee'],
    default: 'en_attente',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);