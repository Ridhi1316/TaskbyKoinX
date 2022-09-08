const express = require('express');
const router = express.Router();
const transaction = require('../controllers/transactionController');

router.get('/:address', transaction.userTransaction);
router.post('/register_address', transaction.addressTransaction);
router.get('/get_ethereum', transaction.ethereumPrice);
router.get('/userDetails/:address', transaction.getEther);
router.get('/:address1/:address2', transaction.transactionBetweenUsers);

module.exports = router;
