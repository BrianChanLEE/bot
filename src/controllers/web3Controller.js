
const Web3 = require('web3').default;
const web3 = new Web3('http://node.masnet.ai:8545');
const Logger = require("../lib/looger.js");
const logger = new Logger("logs");



/**
 * @swagger
 * /api/block/latest:
 *   get:
 *     summary: 최신 블록 번호 가져오기 (Web3 사용)
 *     description: Web3를 사용하여 최신 블록 번호를 가져옵니다.
 *     tags:
 *       - Blockchain
 *     responses:
 *       200:
 *         description: 블록 번호 가져오기 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blockNumber:
 *                   type: integer
 *                   description: 최신 블록 번호
 *                   example: 1234567
 *       500:
 *         description: 블록 번호 가져오기 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch block number"
 */
// web3.js를 통해 블록 넘버 가져오기
const getLatestBlockWeb3 = async (req, res) => {
    try {
        const blockNumber = await web3.eth.getBlockNumber();
        logger.info(`블록 번호 가져오기 성공: ${blockNumber}`); 
         // BigInt를 문자열로 변환
         res.json({ blockNumber: blockNumber.toString() });
    } catch (error) {
        logger.error(`블록 번호 가져오기 실패: ${error.message}`); 
        res.status(500).json({ error: '블록 번호를 가져오는 데 실패했습니다.' });
    }
};


/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: 계정 목록 가져오기
 *     description: Web3를 사용하여 블록체인 네트워크에서 사용 가능한 모든 계정 목록을 가져옵니다.
 *     tags:
 *       - Blockchain
 *     responses:
 *       200:
 *         description: 계정 목록 가져오기 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accounts:
 *                   type: array
 *                   description: 블록체인 네트워크의 계정 목록
 *                   items:
 *                     type: string
 *                   example: ["0x1234567890abcdef1234567890abcdef12345678", "0xabcdef1234567890abcdef1234567890abcdef12"]
 *       500:
 *         description: 계정 목록 가져오기 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "계정 목록을 가져오는 데 실패했습니다."
 */
const getAccounts = async (req,res) => {
    try {
        const accounts = await web3.eth.getAccounts();
        res.json({accounts})
    } catch (error) {
        logger.error(`계정 목록 가져오기 실패: ${error.message}`);
        res.status(500).json({ error: '계정 목록을 가져오는 데 실패했습니다.' });
    }
}

/**
 * @swagger
 * /api/block/number:
 *   get:
 *     summary: 현재 블록 번호 가져오기
 *     description: Web3를 사용하여 블록체인 네트워크의 현재 블록 번호를 가져옵니다.
 *     tags:
 *       - Blockchain
 *     responses:
 *       200:
 *         description: 블록 번호 가져오기 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blockNumber:
 *                   type: integer
 *                   description: 현재 블록 번호
 *                   example: 1234567
 *       500:
 *         description: 블록 번호 가져오기 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "블록 번호를 가져오는 데 실패했습니다."
 */
const getBlockNumber = async (req,res) => {
    try {
        const blockNumber = await web3.eth.getBlockNumber();
        res.json({ blockNumber });
    } catch (error) {
        logger.error(`블록 번호 가져오기 실패: ${error.message}`);
        res.status(500).json({ error: '블록 번호를 가져오는 데 실패했습니다.' });
    }
}


/**
 * @swagger
 * /api/balance/{address}:
 *   get:
 *     summary: 계정 잔액 가져오기
 *     description: 지정된 주소의 이더리움 잔액을 가져옵니다.
 *     tags:
 *       - Blockchain
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         description: 잔액을 조회할 이더리움 주소
 *         schema:
 *           type: string
 *           example: "0x1234567890abcdef1234567890abcdef12345678"
 *     responses:
 *       200:
 *         description: 잔액 가져오기 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: string
 *                   description: 이더리움 잔액 (Wei 단위)
 *                   example: "1000000000000000000"
 *       500:
 *         description: 잔액 가져오기 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "잔액을 가져오는 데 실패했습니다."
 */
const getBalance  = async (req,res) => {
    try {
        const { address } = req.params;
        const balance = await web3.eth.getBalance(address);
        res.json({ balance });
    } catch (error) {
        logger.error(`잔액 가져오기 실패: ${error.message}`);
        res.status(500).json({ error: '잔액을 가져오는 데 실패했습니다.' });
    }
}


/**
 * @swagger
 * /api/block/{blockHashOrBlockNumber}/{returnTransactionObjects}:
 *   get:
 *     summary: 블록 정보 가져오기
 *     description: 지정된 블록 해시 또는 블록 번호의 블록 정보를 가져옵니다. 트랜잭션 객체를 포함할지 여부도 선택할 수 있습니다.
 *     tags:
 *       - Blockchain
 *     parameters:
 *       - in: path
 *         name: blockHashOrBlockNumber
 *         required: true
 *         description: 조회할 블록의 해시 또는 번호
 *         schema:
 *           type: string
 *           example: "1234567"  # 또는 블록 해시: "0xabcdef..."
 *       - in: path
 *         name: returnTransactionObjects
 *         required: true
 *         description: 트랜잭션 객체를 포함할지 여부 (true/false)
 *         schema:
 *           type: string
 *           example: "true"
 *     responses:
 *       200:
 *         description: 블록 정보 가져오기 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 block:
 *                   type: object
 *                   description: 블록 정보
 *                   properties:
 *                     number:
 *                       type: integer
 *                       description: 블록 번호
 *                       example: 1234567
 *                     hash:
 *                       type: string
 *                       description: 블록 해시
 *                       example: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
 *                     parentHash:
 *                       type: string
 *                       description: 부모 블록의 해시
 *                       example: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
 *                     nonce:
 *                       type: string
 *                       description: 블록 논스
 *                       example: "0x0000000000000000"
 *                     transactions:
 *                       type: array
 *                       description: 블록 내의 트랜잭션 목록
 *                       items:
 *                         type: string
 *                         example: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
 *       500:
 *         description: 블록 정보 가져오기 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "블록 정보를 가져오는 데 실패했습니다."
 */
const getBlock = async (req,res) => {
    try {
        const { blockHashOrBlockNumber, returnTransactionObjects } = req.params;
        const block = await web3.eth.getBlock(blockHashOrBlockNumber, returnTransactionObjects === 'true');
        res.json({ block }); 
    } catch (error) {
        logger.error(`블록 정보 가져오기 실패: ${error.message}`);
        res.status(500).json({ error: '블록 정보를 가져오는 데 실패했습니다.' });
    }
}

/**
 * @swagger
 * /api/block/{blockHashOrBlockNumber}/transaction-count:
 *   get:
 *     summary: 블록 트랜잭션 수 가져오기
 *     description: 지정된 블록 해시 또는 블록 번호에 대한 트랜잭션 수를 가져옵니다.
 *     tags:
 *       - Blockchain
 *     parameters:
 *       - in: path
 *         name: blockHashOrBlockNumber
 *         required: true
 *         description: 조회할 블록의 해시 또는 번호
 *         schema:
 *           type: string
 *           example: "1234567"  # 또는 블록 해시: "0xabcdef..."
 *     responses:
 *       200:
 *         description: 블록 트랜잭션 수 가져오기 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: 블록 내의 트랜잭션 수
 *                   example: 42
 *       500:
 *         description: 블록 트랜잭션 수 가져오기 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "블록 트랜잭션 수를 가져오는 데 실패했습니다."
 */
const getBlockTransactionCount = async (req,res) => {
    try {
        const { blockHashOrBlockNumber } = req.params;
        const count = await web3.eth.getBlockTransactionCount(blockHashOrBlockNumber);
        res.json({ count });  
    } catch (error) {
        logger.error(`블록 트랜잭션 수 가져오기 실패: ${error.message}`);
        res.status(500).json({ error: '블록 트랜잭션 수를 가져오는 데 실패했습니다.' }); 
    }
}


/**
 * @swagger
 * /api/transaction/{transactionHash}:
 *   get:
 *     summary: 트랜잭션 정보 가져오기
 *     description: 지정된 트랜잭션 해시에 대한 트랜잭션 정보를 가져옵니다.
 *     tags:
 *       - Blockchain
 *     parameters:
 *       - in: path
 *         name: transactionHash
 *         required: true
 *         description: 조회할 트랜잭션의 해시
 *         schema:
 *           type: string
 *           example: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
 *     responses:
 *       200:
 *         description: 트랜잭션 정보 가져오기 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transaction:
 *                   type: object
 *                   description: 트랜잭션 정보
 *                   properties:
 *                     hash:
 *                       type: string
 *                       description: 트랜잭션 해시
 *                       example: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
 *                     from:
 *                       type: string
 *                       description: 송신자 주소
 *                       example: "0x1234567890abcdef1234567890abcdef12345678"
 *                     to:
 *                       type: string
 *                       description: 수신자 주소
 *                       example: "0xabcdef1234567890abcdef1234567890abcdef12"
 *                     value:
 *                       type: string
 *                       description: 전송된 금액 (Wei 단위)
 *                       example: "1000000000000000000"
 *                     gas:
 *                       type: integer
 *                       description: 가스 한도
 *                       example: 21000
 *                     gasPrice:
 *                       type: string
 *                       description: 가스 가격 (Wei 단위)
 *                       example: "20000000000"
 *       500:
 *         description: 트랜잭션 정보 가져오기 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "트랜잭션 정보를 가져오는 데 실패했습니다."
 */
const getTransaction = async (req,res) => {
    try {
        const { transactionHash } = req.params;
        const transaction = await web3.eth.getTransaction(transactionHash);
        res.json({ transaction });
    } catch (error) {
        logger.error(`트랜잭션 정보 가져오기 실패: ${error.message}`);
        res.status(500).json({ error: '트랜잭션 정보를 가져오는 데 실패했습니다.' });
    }
}

/**
 * @swagger
 * /api/transaction/{transactionHash}/receipt:
 *   get:
 *     summary: 트랜잭션 영수증 가져오기
 *     description: 지정된 트랜잭션 해시에 대한 트랜잭션 영수증을 가져옵니다.
 *     tags:
 *       - Blockchain
 *     parameters:
 *       - in: path
 *         name: transactionHash
 *         required: true
 *         description: 조회할 트랜잭션의 해시
 *         schema:
 *           type: string
 *           example: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
 *     responses:
 *       200:
 *         description: 트랜잭션 영수증 가져오기 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 receipt:
 *                   type: object
 *                   description: 트랜잭션 영수증
 *                   properties:
 *                     transactionHash:
 *                       type: string
 *                       description: 트랜잭션 해시
 *                       example: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
 *                     blockHash:
 *                       type: string
 *                       description: 트랜잭션이 포함된 블록의 해시
 *                       example: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
 *                     blockNumber:
 *                       type: integer
 *                       description: 트랜잭션이 포함된 블록 번호
 *                       example: 1234567
 *                     from:
 *                       type: string
 *                       description: 송신자 주소
 *                       example: "0x1234567890abcdef1234567890abcdef12345678"
 *                     to:
 *                       type: string
 *                       description: 수신자 주소
 *                       example: "0xabcdef1234567890abcdef1234567890abcdef12"
 *                     cumulativeGasUsed:
 *                       type: integer
 *                       description: 블록 내에서 사용된 총 가스
 *                       example: 21000
 *                     gasUsed:
 *                       type: integer
 *                       description: 트랜잭션에 사용된 가스
 *                       example: 21000
 *                     logs:
 *                       type: array
 *                       description: 트랜잭션 로그 목록
 *                       items:
 *                         type: object
 *                         properties:
 *                           address:
 *                             type: string
 *                             description: 로그의 생성된 주소
 *                             example: "0xabcdef1234567890abcdef1234567890abcdef12"
 *                           data:
 *                             type: string
 *                             description: 로그 데이터
 *                             example: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
 *                           topics:
 *                             type: array
 *                             description: 로그 주제 목록
 *                             items:
 *                               type: string
 *                               example: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
 *       500:
 *         description: 트랜잭션 영수증 가져오기 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "트랜잭션 영수증을 가져오는 데 실패했습니다."
 */
const getTransactionReceipt = async (req,res) => {
    try {
        const { transactionHash } = req.params;
        const receipt = await web3.eth.getTransactionReceipt(transactionHash);
        res.json({ receipt });
    } catch (error) {
        logger.error(`트랜잭션 영수증 가져오기 실패: ${error.message}`);
        res.status(500).json({ error: '트랜잭션 영수증을 가져오는 데 실패했습니다.' });
    }
}

/**
 * @swagger
 * /api/transaction-count/{address}:
 *   get:
 *     summary: 계정의 트랜잭션 수 가져오기
 *     description: 지정된 주소에 대한 트랜잭션 수를 가져옵니다.
 *     tags:
 *       - Blockchain
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         description: 트랜잭션 수를 조회할 이더리움 주소
 *         schema:
 *           type: string
 *           example: "0x1234567890abcdef1234567890abcdef12345678"
 *     responses:
 *       200:
 *         description: 트랜잭션 수 가져오기 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: 해당 주소의 트랜잭션 수
 *                   example: 42
 *       500:
 *         description: 트랜잭션 수 가져오기 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "트랜잭션 수를 가져오는 데 실패했습니다."
 */
const getTransactionCount = async (req,res) => {
    try {
        const { address } = req.params;
        const count = await web3.eth.getTransactionCount(address);
        res.json({ count });
    } catch (error) {
        logger.error(`트랜잭션 수 가져오기 실패: ${error.message}`);
        res.status(500).json({ error: '트랜잭션 수를 가져오는 데 실패했습니다.' });
    }
}

/**
 * @swagger
 * /api/transaction/send:
 *   post:
 *     summary: 트랜잭션 보내기
 *     description: 제공된 트랜잭션 객체를 사용하여 이더리움 네트워크에 트랜잭션을 보냅니다.
 *     tags:
 *       - Blockchain
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionObject:
 *                 type: object
 *                 description: 보낼 트랜잭션 객체
 *                 properties:
 *                   from:
 *                     type: string
 *                     description: 송신자 주소
 *                     example: "0x1234567890abcdef1234567890abcdef12345678"
 *                   to:
 *                     type: string
 *                     description: 수신자 주소
 *                     example: "0xabcdef1234567890abcdef1234567890abcdef12"
 *                   value:
 *                     type: string
 *                     description: 전송할 금액 (Wei 단위)
 *                     example: "1000000000000000000"
 *                   gas:
 *                     type: integer
 *                     description: 가스 한도
 *                     example: 21000
 *                   gasPrice:
 *                     type: string
 *                     description: 가스 가격 (Wei 단위)
 *                     example: "20000000000"
 *                   data:
 *                     type: string
 *                     description: 트랜잭션에 포함할 데이터
 *                     example: "0x..."
 *     responses:
 *       200:
 *         description: 트랜잭션 보내기 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 receipt:
 *                   type: object
 *                   description: 트랜잭션 영수증
 *                   properties:
 *                     transactionHash:
 *                       type: string
 *                       description: 트랜잭션 해시
 *                       example: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
 *                     blockHash:
 *                       type: string
 *                       description: 트랜잭션이 포함된 블록의 해시
 *                       example: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
 *                     blockNumber:
 *                       type: integer
 *                       description: 트랜잭션이 포함된 블록의 번호
 *                       example: 1234567
 *                     from:
 *                       type: string
 *                       description: 송신자 주소
 *                       example: "0x1234567890abcdef1234567890abcdef12345678"
 *                     to:
 *                       type: string
 *                       description: 수신자 주소
 *                       example: "0xabcdef1234567890abcdef1234567890abcdef12"
 *       500:
 *         description: 트랜잭션 보내기 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "트랜잭션을 보내는 데 실패했습니다."
 */
const sendTransaction = async (req,res) => {
    try {
        const { transactionObject } = req.body;
        const receipt = await web3.eth.sendTransaction(transactionObject);
        res.json({ receipt });
    } catch (error) {
        logger.error(`트랜잭션 보내기 실패: ${error.message}`);
        res.status(500).json({ error: '트랜잭션을 보내는 데 실패했습니다.' });
    }
}

/**
 * @swagger
 * /api/transaction/send-signed:
 *   post:
 *     summary: 서명된 트랜잭션 보내기
 *     description: 클라이언트에서 서명된 트랜잭션 데이터를 사용하여 이더리움 네트워크에 트랜잭션을 보냅니다.
 *     tags:
 *       - Blockchain
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               signedTransactionData:
 *                 type: string
 *                 description: 서명된 트랜잭션 데이터
 *                 example: "0xf86c808504a817c80082520894000000000000000000000000000000000000000000808025a0b..."
 *     responses:
 *       200:
 *         description: 서명된 트랜잭션 보내기 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 receipt:
 *                   type: object
 *                   description: 트랜잭션 영수증
 *                   properties:
 *                     transactionHash:
 *                       type: string
 *                       description: 트랜잭션 해시
 *                       example: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
 *                     blockHash:
 *                       type: string
 *                       description: 트랜잭션이 포함된 블록의 해시
 *                       example: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
 *                     blockNumber:
 *                       type: integer
 *                       description: 트랜잭션이 포함된 블록의 번호
 *                       example: 1234567
 *                     from:
 *                       type: string
 *                       description: 송신자 주소
 *                       example: "0x1234567890abcdef1234567890abcdef12345678"
 *                     to:
 *                       type: string
 *                       description: 수신자 주소
 *                       example: "0xabcdef1234567890abcdef1234567890abcdef12"
 *       500:
 *         description: 서명된 트랜잭션 보내기 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "서명된 트랜잭션을 보내는 데 실패했습니다."
 */
const sendSignedTransaction = async (req,res) => {
    try {
        const { signedTransactionData } = req.body;
        const receipt = await web3.eth.sendSignedTransaction(signedTransactionData);
        res.json({ receipt });
    } catch (error) {
        logger.error(`서명된 트랜잭션 보내기 실패: ${error.message}`);
        res.status(500).json({ error: '서명된 트랜잭션을 보내는 데 실패했습니다.' });
    }
}

/**
 * @swagger
 * /api/transaction/estimate-gas:
 *   post:
 *     summary: 가스 추정
 *     description: 주어진 트랜잭션 객체에 대해 필요한 가스의 양을 추정합니다.
 *     tags:
 *       - Blockchain
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionObject:
 *                 type: object
 *                 description: 가스를 추정할 트랜잭션 객체
 *                 properties:
 *                   from:
 *                     type: string
 *                     description: 송신자 주소
 *                     example: "0x1234567890abcdef1234567890abcdef12345678"
 *                   to:
 *                     type: string
 *                     description: 수신자 주소
 *                     example: "0xabcdef1234567890abcdef1234567890abcdef12"
 *                   value:
 *                     type: string
 *                     description: 전송할 금액 (Wei 단위)
 *                     example: "1000000000000000000"
 *                   data:
 *                     type: string
 *                     description: 트랜잭션에 포함할 데이터
 *                     example: "0x..."
 *     responses:
 *       200:
 *         description: 가스 추정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gas:
 *                   type: integer
 *                   description: 추정된 가스 양
 *                   example: 21000
 *       500:
 *         description: 가스 추정 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "가스를 추정하는 데 실패했습니다."
 */
const estimateGas = async (req,res) => {
    try {
        const { transactionObject } = req.body;
        const gas = await web3.eth.estimateGas(transactionObject);
        res.json({ gas });
    } catch (error) {
        logger.error(`가스 추정 실패: ${error.message}`);
        res.status(500).json({ error: '가스를 추정하는 데 실패했습니다.' });
    }
}

/**
 * @swagger
 * /api/account/new:
 *   post:
 *     summary: 새 계정 생성
 *     description: 제공된 비밀번호를 사용하여 새로운 이더리움 계정을 생성합니다.
 *     tags:
 *       - Blockchain
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: 새로운 계정을 보호할 비밀번호
 *                 example: "strongpassword123"
 *     responses:
 *       200:
 *         description: 새 계정 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 account:
 *                   type: string
 *                   description: 생성된 새로운 계정 주소
 *                   example: "0x1234567890abcdef1234567890abcdef12345678"
 *       500:
 *         description: 새 계정 생성 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "새 계정을 생성하는 데 실패했습니다."
 */
const newAccount = async (req,res) => {
    try {
        const { password } = req.body;
        const account = await web3.eth.personal.newAccount(password);
        res.json({ account });
    } catch (error) {
        logger.error(`새 계정 생성 실패: ${error.message}`);
        res.status(500).json({ error: '새 계정을 생성하는 데 실패했습니다.' });
    }
}

/**
 * @swagger
 * /api/gas-price:
 *   get:
 *     summary: 현재 가스 가격 가져오기
 *     description: 이더리움 네트워크의 현재 가스 가격을 가져옵니다.
 *     tags:
 *       - Blockchain
 *     responses:
 *       200:
 *         description: 가스 가격 가져오기 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gasPrice:
 *                   type: string
 *                   description: 현재 가스 가격 (Wei 단위)
 *                   example: "20000000000"
 *       500:
 *         description: 가스 가격 가져오기 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "가스 값을 가져오는데 실패했습니다."
 */
const getGasPrice = async (req,res) => {
    try {
        const gasPrice = await web3.eth.getGasPrice();
        res.json({ gasPrice });
    } catch (error) {
        logger.error(`가스 값을 가져오는데 실패: ${error.message}`);
        res.status(500).json({ error: '가스 값을 가져오는데 실패했습니다.' });
    }
}


/**
 * @swagger
 * /api/account/unlock:
 *   post:
 *     summary: 계정 잠금 해제
 *     description: 지정된 주소의 계정을 비밀번호를 사용하여 잠금 해제합니다. 옵션으로 잠금 해제 기간을 설정할 수 있습니다.
 *     tags:
 *       - Blockchain
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 description: 잠금 해제할 계정의 주소
 *                 example: "0x1234567890abcdef1234567890abcdef12345678"
 *               password:
 *                 type: string
 *                 description: 계정을 잠금 해제하기 위한 비밀번호
 *                 example: "strongpassword123"
 *               duration:
 *                 type: integer
 *                 description: 계정이 잠금 해제된 상태로 유지될 시간 (초 단위)
 *                 example: 600
 *     responses:
 *       200:
 *         description: 계정 잠금 해제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 unlocked:
 *                   type: boolean
 *                   description: 계정 잠금 해제 성공 여부
 *                   example: true
 *       500:
 *         description: 계정 잠금 해제 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "계정 잠금 해제에 실패했습니다."
 */
const unlockAccount = async (req,res) => {
    try {
        const { address, password, duration } = req.body;
        const unlocked = await web3.eth.personal.unlockAccount(address, password, duration);
        res.json({ unlocked });
    } catch (error) {
        logger.error(`계정 잠금 해제 실패: ${error.message}`);
        res.status(500).json({ error: '계정 잠금 해제에 실패했습니다.' });
    }
}

/**
 * @swagger
 * /api/data/sign:
 *   post:
 *     summary: 데이터 서명
 *     description: 지정된 주소와 비밀번호를 사용하여 데이터를 서명합니다.
 *     tags:
 *       - Blockchain
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataToSign:
 *                 type: string
 *                 description: 서명할 데이터
 *                 example: "Hello, World!"
 *               address:
 *                 type: string
 *                 description: 데이터를 서명할 계정 주소
 *                 example: "0x1234567890abcdef1234567890abcdef12345678"
 *               password:
 *                 type: string
 *                 description: 계정의 비밀번호
 *                 example: "strongpassword123"
 *     responses:
 *       200:
 *         description: 데이터 서명 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 signature:
 *                   type: string
 *                   description: 서명된 데이터의 서명 값
 *                   example: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
 *       500:
 *         description: 데이터 서명 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "데이터 서명에 실패했습니다."
 */
const signData = async (req,res) => {
    try {
        const { dataToSign, address, password } = req.body;
        const signature = await web3.eth.personal.sign(dataToSign, address, password);
        res.json({ signature });
    } catch (error) {
        logger.error(`데이터 서명 실패: ${error.message}`);
        res.status(500).json({ error: '데이터 서명에 실패했습니다.' });
    }
}

/**
 * @swagger
 * /api/transaction/send-personal:
 *   post:
 *     summary: 개인 트랜잭션 보내기
 *     description: 지정된 트랜잭션 객체와 비밀번호를 사용하여 개인 트랜잭션을 보냅니다.
 *     tags:
 *       - Blockchain
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionObject:
 *                 type: object
 *                 description: 보낼 트랜잭션 객체
 *                 properties:
 *                   from:
 *                     type: string
 *                     description: 송신자 주소
 *                     example: "0x1234567890abcdef1234567890abcdef12345678"
 *                   to:
 *                     type: string
 *                     description: 수신자 주소
 *                     example: "0xabcdef1234567890abcdef1234567890abcdef12"
 *                   value:
 *                     type: string
 *                     description: 전송할 금액 (Wei 단위)
 *                     example: "1000000000000000000"
 *                   gas:
 *                     type: integer
 *                     description: 가스 한도
 *                     example: 21000
 *                   gasPrice:
 *                     type: string
 *                     description: 가스 가격 (Wei 단위)
 *                     example: "20000000000"
 *                   data:
 *                     type: string
 *                     description: 트랜잭션에 포함할 데이터
 *                     example: "0x..."
 *               password:
 *                 type: string
 *                 description: 트랜잭션을 서명하는 데 사용할 계정의 비밀번호
 *                 example: "strongpassword123"
 *     responses:
 *       200:
 *         description: 트랜잭션 보내기 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 receipt:
 *                   type: object
 *                   description: 트랜잭션 영수증
 *                   properties:
 *                     transactionHash:
 *                       type: string
 *                       description: 트랜잭션 해시
 *                       example: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
 *                     blockHash:
 *                       type: string
 *                       description: 트랜잭션이 포함된 블록의 해시
 *                       example: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
 *                     blockNumber:
 *                       type: integer
 *                       description: 트랜잭션이 포함된 블록의 번호
 *                       example: 1234567
 *                     from:
 *                       type: string
 *                       description: 송신자 주소
 *                       example: "0x1234567890abcdef1234567890abcdef12345678"
 *                     to:
 *                       type: string
 *                       description: 수신자 주소
 *                       example: "0xabcdef1234567890abcdef1234567890abcdef12"
 *       500:
 *         description: 트랜잭션 보내기 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "트랜잭션을 보내는 데 실패했습니다."
 */
const personalSendTransaction = async (req,res) => {
    try {
        const { transactionObject, password } = req.body;
        const receipt = await web3.eth.personal.sendTransaction(transactionObject, password);
        res.json({ receipt });
    } catch (error) {
        logger.error(`트랜잭션 보내기 실패: ${error.message}`);
        res.status(500).json({ error: '트랜잭션을 보내는 데 실패했습니다.' });
    }
}
// const createAccessListWeb3 = async(req,res) => {
//     try {
//         const AccessList = await web3.eth.createAccessList();
//         logger.info(`액세스 목록 생성 성공: ${AccessList}`); 
//         res.json({AccessList: AccessList.toString()});
//     } catch (error) {
//         logger.error(`액세스 목록 생성 실패: ${error.message}`); 
//         res.status(500).json({ error: '액세스 목록 생성하는데 실패했습니다.' });
//     }
// }

module.exports = {
    getAccounts,
    getBlockNumber,
    getBalance,
    getBlock,
    getBlockTransactionCount,
    getTransaction,
    getTransactionReceipt,
    getTransactionCount,
    sendTransaction,
    sendSignedTransaction,
    estimateGas,
    getGasPrice,
    newAccount,
    unlockAccount,
    signData,
    personalSendTransaction,
    getLatestBlockWeb3

}