const express = require('express');
const router = express.Router();
const ethController = require('../controllers/ethController');
const web3Controller = require('../controllers/web3Controller');


// 기본 번들 통신을 통해 블록 넘버 가져오기
router.get('/get-latest-block-basic', ethController.getLatestBlock);
router.get('/transaction/eth', ethController.getTransactionEth);



// web3.js를 통해 블록 넘버 가져오기
router.get('/block/latest', web3Controller.getLatestBlockWeb3);
router.get('/transaction',web3Controller.getTransaction);








router.get('/accounts',web3Controller.getAccounts);
router.get(' /transaction-count/{address}',web3Controller.getTransactionCount);
router.get('/block/number',web3Controller.getBlockNumber);
router.get('/balance/{address}',web3Controller.getBalance);
router.get('/block/{blockHashOrBlockNumber}/{returnTransactionObjects}',web3Controller.getBlock);
router.get('/block/{blockHashOrBlockNumber}/transaction-count',web3Controller.getBlockTransactionCount);

router.get('getAccounts',web3Controller.getAccounts);
router.get('/transaction/:transactionHash/receipt',web3Controller.getTransactionReceipt);
router.get('/gas-price',web3Controller.getGasPrice);
router.post('/transaction/send',web3Controller.sendTransaction);
router.post('/transaction/send-signed',web3Controller.sendSignedTransaction);
router.post('/transaction/estimate-gas',web3Controller.estimateGas);
router.post('/account/new',web3Controller.newAccount);
router.post('/account/unlock',web3Controller.unlockAccount);
router.post('/data/sign',web3Controller.signData);
router.post('/transaction/send-personal',web3Controller.personalSendTransaction);


module.exports = router;