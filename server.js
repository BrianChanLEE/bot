const express = require("express");
const bodyParser = require('body-parser');
const { swaggerUi, swaggerDocs } = require('./swagger');
require('dotenv').config();
const marketRoutes = require('./src/routers/marketRoutes');
const helloRoutes = require('./src/routers/helloRoutes');
const blockRoutes = require('./src/routers/blockRoutes');

const app = express();




// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 라우터 설정
app.use('/', helloRoutes)
app.use('/api', marketRoutes);
app.use('/api', blockRoutes);
app.use('/api-doc',swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});