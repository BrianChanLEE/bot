const axios = require('axios');
const Web3 = require('web3').default;

const Logger = require("../lib/looger.js");
const logger = new Logger("logs");

/**
 * @swagger
 * /block/latest:
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
 * /block/latest:
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
        
        const web3 = new Web3('http://node.masnet.ai:8545');
        
        const blockNumber = await web3.eth.getBlockNumber();
        logger.info(`블록 번호 가져오기 성공: ${blockNumber}`); 
         // BigInt를 문자열로 변환
         res.json({ blockNumber: blockNumber.toString() });
    } catch (error) {
        logger.error(`블록 번호 가져오기 실패: ${error.message}`); 
        res.status(500).json({ error: '블록 번호를 가져오는 데 실패했습니다.' });
    }
};



module.exports = {
    getLatestBlock,
     getLatestBlockWeb3
}