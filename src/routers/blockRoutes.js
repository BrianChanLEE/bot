const express = require('express');
const router = express.Router();
const blockController = require('../controllers/blockController');


// 기본 번들 통신을 통해 블록 넘버 가져오기
router.get('/get-latest-block-basic', blockController.getLatestBlock);

// web3.js를 통해 블록 넘버 가져오기
router.get('/get-latest-block-web3', blockController.getLatestBlockWeb3);

module.exports = router;