const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger 옵션 설정
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'BOT-API',
      version: '1.0.0',
      description: 'API documentation for Xwidget_BOT-related operations',
    },
    servers: [
      {
        url: 'http://localhost:3001', // 서버 URL
        description: 'Development server',
      },
    ],
  },
  apis: [
    './src/controllers/blockController.js','./src/routers/blockRoutes.js',
    './src/controllers/mainController.js','./src/routers/helloRoutes.js',
    './src/controllers/orderController.js','./src/routers/marketRoutes.js',

    
    ], // Swagger doc을 생성할 파일 경로
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };