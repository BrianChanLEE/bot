
const https = require('https');
const crypto = require('crypto');
const querystring = require('querystring');
const  Logger = require ("../lib/looger.js");
const logger = new Logger("logs");
require('dotenv').config();


const baseURL = "openapi.digifinex.com";
const appKey = process.env.digefinexappKey;  // 변수명 오타 수정
const appSecret = process.env.digefineexappSecrete;  // 변수명 오타 수정

// 데이터 서명을 계산하는 함수
const calcSign = (data) => {
    if (!appSecret) {
        logger.error('appSecret이 설정되지 않았습니다.');
        throw new Error('appSecret이 설정되지 않았습니다.');
    }
    const content = querystring.stringify(data);
    return crypto.createHmac('sha256', appSecret).update(content).digest('hex');
  };

// HTTP 요청을 수행하는 함수
const doRequest = (method, path, data = {}, needSign = false) => {
  return new Promise((resolve, reject) => {
    const content = querystring.stringify(data);
    const options = {
      hostname: baseURL,
      port: 443,
      path: '/v3' + path,
      method: method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.52 Safari/537.17',
      }
    };

    if (method === "GET" && content !== "") {
      options.path += '?' + content;
    }

    if (needSign) {
        if (!appKey) {
            logger.error('appKey가 설정되지 않았습니다.');
        throw new Error('appKey가 설정되지 않았습니다.');
          }
      options.headers['ACCESS-KEY'] = appKey;
      options.headers['ACCESS-TIMESTAMP'] = Math.floor(Date.now() / 1000);
      options.headers['ACCESS-SIGN'] = calcSign(data);
    }

    logger.info(`요청 옵션: ${JSON.stringify(options)}`);

    const req = https.request(options, (res) => {
      let responseData = '';
      logger.info(`상태 코드: ${res.statusCode}`);
      logger.info(`헤더: ${JSON.stringify(res.headers)}`);

      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        logger.info(`응답 본문: ${responseData}`);
        resolve(responseData);
      });
    });

    req.on('error', (e) => {
        logger.error(`요청 중 문제 발생: ${e.message}`);
      reject(e);
    });

    if (method !== 'GET') {
      req.write(content);
    }

    req.end();
  });
};

module.exports = {
    doRequest
}