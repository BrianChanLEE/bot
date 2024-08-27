const axios = require('axios');
const Logger = require("../lib/looger.js");
const logger = new Logger("logs");
/**
 * @swagger
 * /api/block/latest:
 *   get:
 *     summary: 최신 블록 번호 가져오기
 *     description: 이 엔드포인트는 최신 블록 번호를 가져옵니다.
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
// 기본 번들 통신을 통해 블록 넘버 가져오기
const getLatestBlock = async (req,res)=> {
    try {
            const response = await axios.post('http://node.masnet.ai:8545/',{
                jsonrpc: '2.0',
                method: "eth_blockNumber",
                params: [],
                id:1
            });

            const blockNumber = parseInt(response.data.result,16);
            logger.info(`블록 번호 가져오기 성공: ${blockNumber}`); 
            res.json({blockNumber});
    } catch (error) {
        logger.error(`블록 번호 가져오기 실패: ${error.message}`); 
        res.status(500).json({error: 'Failed to fetch block number' });
        
    }
};

/**
 * @swagger
 * /api/transaction/eth:
 *   get:
 *     summary: 트랜잭션 정보 가져오기 (ETH)
 *     description: 이더리움 네트워크에서 지정된 트랜잭션 해시로 트랜잭션 정보를 가져옵니다.
 *     tags:
 *       - Blockchain
 *     parameters:
 *       - in: query
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
 *       400:
 *         description: 잘못된 요청 (transactionHash가 제공되지 않음)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "transactionHash가 제공되지 않았습니다."
 *       404:
 *         description: 해당 트랜잭션을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "해당 트랜잭션을 찾을 수 없습니다."
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
// const getTransactionEth = async (req, res) => {
//     try {
//         const { transactionHash } = req.query;

//         // 트랜잭션 해시가 제공되지 않은 경우
//         if (!transactionHash) {
//             return res.status(400).json({ error: 'transactionHash가 제공되지 않았습니다.' });
//         }

//         // 기본 번들 통신을 통해 트랜잭션 정보 가져오기
//         const response = await axios.post(
//             'http://node.masnet.ai:8545/',
//             {
//                 jsonrpc: "2.0",
//                 method: "eth_getTransactionByHash",
//                 params: [transactionHash],
//                 id: 1
//             },
//             {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );

//         const transaction = response.data.result;

//         // 트랜잭션이 존재하지 않는 경우
//         if (!transaction) {
//             return res.status(404).json({ error: '해당 트랜잭션을 찾을 수 없습니다.' });
//         }

//         res.json({ transaction });
//     } catch (error) {
//         console.error(`트랜잭션 정보 가져오기 실패: ${error.message}`);
//         res.status(500).json({ error: '트랜잭션 정보를 가져오는 데 실패했습니다.' });
//     }
// };

const getTransactionEth = async (req, res) => {
    try {
        const { transactionHash } = req.query;

        // 트랜잭션 해시가 제공되지 않은 경우
        if (!transactionHash) {
            return res.status(400).json({ error: 'transactionHash가 제공되지 않았습니다.' });
        }

        // 기본 번들 통신을 통해 트랜잭션 정보 가져오기
        const response = await axios.post(
            'http://node.masnet.ai:8545/',
            {
                jsonrpc: "2.0",
                method: "eth_getTransactionByHash",
                params: [transactionHash],
                id: 1
            }
        );

        const transaction = response.data.result;

        // 트랜잭션이 존재하지 않는 경우
        if (!transaction) {
            return res.status(404).json({ error: '해당 트랜잭션을 찾을 수 없습니다.' });
        }

        res.json({ transaction });
    } catch (error) {
        console.error(`트랜잭션 정보 가져오기 실패: ${error.message}`);
        res.status(500).json({ error: '트랜잭션 정보를 가져오는 데 실패했습니다.' });
    }
};

module.exports = {
    getLatestBlock,
    getTransactionEth

}