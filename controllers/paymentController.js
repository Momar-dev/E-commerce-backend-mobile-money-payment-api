const axios = require('axios');
const Order = require('../models/Order');

exports.initiatePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvee' });
    }

    const response = await axios.post(
      'https://paytech.sn/api/payment/request-payment',
      {
        item_name: 'Commande Teranga Mode',
        item_price: order.totalAmount,
        currency: 'XOF',
        ref_command: order._id.toString(),
        command_name: `Commande ${order._id}`,
        env: 'test',
        ipn_url: 'https://2f3a7a41e3cd97.lhr.life/api/payment/webhook',
        success_url: 'https://thunderous-phoenix-aeb666.netlify.app/mes-commandes',
        cancel_url: 'https://thunderous-phoenix-aeb666.netlify.app/panier',
      },
      {
        headers: {
          'API_KEY': process.env.PAYTECH_API_KEY,
          'API_SECRET': process.env.PAYTECH_API_SECRET,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de l\'initiation du paiement',
      error: error.response?.data || error.message,
    });
  }
};

exports.paymentWebhook = async (req, res) => {
  try {
    const { ref_command, type_event } = req.body;

    if (type_event === 'sale_complete') {
      await Order.findByIdAndUpdate(ref_command, {
        paymentStatus: 'paye',
        orderStatus: 'confirmee',
      });
    }

    res.status(200).json({ message: 'Webhook recu' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur webhook', error: error.message });
  }
};