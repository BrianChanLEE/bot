const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/order',orderController.processOrder);
router.get('/orderbook',orderController.getOrderbook);
router.post('/email',orderController.getOrderbookAndSendEmail);

module.exports = router;