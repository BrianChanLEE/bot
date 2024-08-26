const { doRequest } = require('../services/digifinexService');
const {sendOrderbookEmail} = require('../services/mailler.js');
const  Logger = require ("../lib/looger.js");
const logger = new Logger("logs");


/**
 * 이 함수는 특정 시간 간격으로 시장 주문서를 조회하고, 조건에 따라
 * 새로운 구매 및 판매 주문을 생성하여 제출합니다.
 * 
 * 1. 현재 시간을 'Asia/Seoul' 타임존으로 설정하여 로그에 기록합니다.
 * 2. 고정 가격(fixPrice)과 랜덤 수량(randomValue)을 생성합니다.
 * 3. 주문서를 조회하여 최저 판매 가격(asks)과 최고 구매 가격(bids)을 분석합니다.
 * 4. 분석된 결과를 바탕으로 새로운 주문을 구성합니다.
 * 5. 구성된 주문을 서버에 제출하며, 일정 시간 간격 후에 함수가 다시 호출됩니다.
 * 
 * 이 함수는 시장의 동적 변동에 대응하여 자동으로 주문을 처리하는 데 사용됩니다.
 */
async function processOrder() {
  // 시간 설정
  const currentDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' });
  logger.info(`>> 거래 시간: ${currentDate}`);

  // 0.100 부터 0.101 랜덤 고정가
  const constant = Math.floor(Math.random() * 2);
  const fixPrice = 0.1 + (0.001 * constant);

  // 100부터 1100 사이의 랜덤 숫자 생성
  const min = 100; 
  const max = 1100;
  const randomValue = parseFloat(`${Math.floor(Math.random() * (max - min + 1)) + min}.${Math.floor(Math.random() * 9999)}`);

  // 0초에서 600초(10분) 사이의 랜덤 지연 시간 생성
const randomDelay = Math.floor(Math.random() * 600);
setTimeout(processOrder, randomDelay * 1000);


  try {
    // 주문서 가져오기
    const ordersResponse = await doRequest('GET', '/order_book', { symbol: 'IBTC_USDT' }, true);
    const orders = JSON.parse(ordersResponse);
    const asks = orders.asks; // sell
    const bids = orders.bids; // buy

    // 최저 판매 주문가 찾기
    let minAsks = asks.reduce((min, ask) => ask[0] < min[0] ? ask : min, asks[0]);
    logger.info(`최저 판매 주문 가격: ${minAsks[0]} / ${minAsks[1]}`);

    // 최고 구매 주문가 찾기
    let maxBid = bids.reduce((max, bid) => bid[0] > max[0] ? bid : max, bids[0]);
    logger.info(`최고 구매 주문 가격: ${maxBid[0]} / ${maxBid[1]}`);

    let NewBuyOrder = { type: "buy", amount: randomValue, price: fixPrice, post_only: 0 };
    let NewSellOrder = { type: "sell", amount: randomValue, price: fixPrice, post_only: 0 };
    let RequestOrders = [];

    if (minAsks[0] === fixPrice) { 
      if (randomValue > minAsks[1]) {
        NewBuyOrder = { type: "buy", amount: minAsks[1], price: fixPrice, post_only: 0 };
      }
      RequestOrders = [NewBuyOrder, NewSellOrder];
    } else if (minAsks[0] < fixPrice) {
      if (randomValue > minAsks[1]) {
        NewBuyOrder = { type: "buy", amount: minAsks[1], price: minAsks[0], post_only: 0 };
      }
      RequestOrders = [NewBuyOrder, NewSellOrder];
    } else if (minAsks[0] > fixPrice) { 
      if (maxBid[0] === fixPrice) {
        if (randomValue > maxBid[1]) {
          NewSellOrder = { type: "sell", amount: maxBid[1], price: fixPrice, post_only: 0 };
        }
        RequestOrders = [NewSellOrder, NewBuyOrder];
      } else if (maxBid[0] > fixPrice) {
        if (randomValue > maxBid[1]) {
          NewSellOrder = { type: "sell", amount: maxBid[1], price: maxBid[0], post_only: 0 };
        }
        RequestOrders = [NewSellOrder];
      } else if (maxBid[0] < fixPrice) {
        RequestOrders = [NewSellOrder, NewBuyOrder];
      }
    }

    logger.info(`요청 주문: ${JSON.stringify(RequestOrders)}`);

    const newOrdersResponse = await doRequest('POST', '/spot/order/batch_new', {
      symbol: 'USDT_IBTC',
      list: JSON.stringify(RequestOrders)
    }, true);

    logger.info(`새 주문 응답: ${newOrdersResponse}`);

  } catch (error) {
    logger.error('오류:', error);
  }
}


/**
 * 이 함수는 클라이언트로부터 특정 거래 쌍(symbol)을 요청받아 
 * 해당 거래 쌍의 주문서(order book)를 외부 API로부터 가져와 
 * 클라이언트에게 JSON 형식으로 응답하는 역할을 합니다.
 *
 * 주요 단계:
 * 1. 요청 파라미터에서 거래 쌍(symbol)을 추출합니다.
 * 2. 외부 API로부터 해당 거래 쌍의 주문서를 가져옵니다.
 * 3. 주문서 데이터를 JSON 형식으로 클라이언트에게 반환합니다.
 * 4. 주문서 가져오기 실패 시 오류를 로그에 기록하고, 클라이언트에게 500 상태 코드와 함께 오류 메시지를 반환합니다.
 *
 * 이 함수는 주로 거래소의 주문서를 조회하여 클라이언트에 제공하는 데 사용됩니다.
 */
async function getOrderbook(req, res) {
  const requestedSymbol = req.body.symbol ;
  try {
    const ordersResponse = await doRequest('GET', '/order_book', { symbol: requestedSymbol }, true);
    const orders = JSON.parse(ordersResponse);
    logger.info(`주문서 가져오기 성공: ${requestedSymbol}`)
    res.json(orders);
  } catch (error) {
    logger.error(`주문서 가져오기 실패: ${requestedSymbol}`, error);
    res.status(500).json({ error: '주문서를 가져오는 데 실패했습니다.' });
  }
}


/**
 * 이 함수는 클라이언트로부터 특정 거래 쌍(symbol)과 이메일 주소를 요청받아,
 * 해당 거래 쌍의 주문서(order book)를 외부 API로부터 가져와 클라이언트에게 반환하고,
 * 주문서 데이터를 지정된 이메일 주소로 전송하는 역할을 합니다.
 *
 * 주요 단계:
 * 1. 요청 본문에서 거래 쌍(symbol)과 이메일 주소를 추출합니다.
 * 2. 이메일 주소 또는 거래 쌍이 제공되지 않은 경우, 적절한 오류 메시지를 반환합니다.
 * 3. 외부 API로부터 해당 거래 쌍의 주문서를 가져옵니다.
 * 4. 가져온 주문서 데이터를 문자열로 변환합니다.
 * 5. 주문서 데이터를 이메일로 전송합니다.
 * 6. 이메일 전송 성공 여부에 따라 클라이언트에게 성공 또는 실패 메시지를 반환합니다.
 * 7. 주문서 가져오기 또는 이메일 전송 중 오류가 발생할 경우, 로그에 기록하고 클라이언트에게 오류 메시지를 반환합니다.
 *
 * 이 함수는 주로 특정 거래 쌍의 주문서 데이터를 이메일로 전송하는 데 사용됩니다.
 */

async function getOrderbookAndSendEmail(req, res) {
  
 
  const requestedSymbol = req.body.symbol;
  const emailAddress = req.body.email;

  if (!emailAddress) {
    return res.status(400).json({ error: '이메일 주소가 제공되지 않았습니다.' });
  }

  if (!requestedSymbol) {
    return res.status(400).json({ error: '심볼이 제공되지 않았습니다.' });
  }

  try {
    const ordersResponse = await doRequest('GET', '/order_book', { symbol: requestedSymbol }, true);
    const orders = JSON.parse(ordersResponse);
    logger.info(`주문서 가져오기 성공: ${requestedSymbol}`);
   

    // 주문서 데이터를 문자열로 변환
    const orderbookData = JSON.stringify(orders, null, 2);
    console.log("orderbookData :",orderbookData)
    // 이메일 전송
    const emailResult = await sendOrderbookEmail(emailAddress, orderbookData);

    if (emailResult.success) {
      res.json({ 
        message: '주문서 데이터가 이메일로 전송되었습니다.',
        orderbook: orders 
      });
    } else {
      res.status(500).json({ 
        error: '주문서 데이터 이메일 전송 실패',
        orderbook: orders 
      });
    }
  } catch (error) {
    logger.error(`주문서 가져오기 또는 이메일 전송 실패: ${requestedSymbol}`, error);
    res.status(500).json({ error: '주문서를 가져오거나 이메일을 전송하는 데 실패했습니다.' });
  }
}

module.exports = { 
  processOrder,
  getOrderbook,
  getOrderbookAndSendEmail
};