
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const Logger = require("../lib/looger.js");
const logger = new Logger("logs");

async function sendOrderbookEmail(emailAddress, orderbookData) {
  try {
    const transporter = nodemailer.createTransport({
      host:'smtp.gmail.com',
      port: 465,
      secure: true,        
      auth: {
        user: process.env.MAIL_ID,
        pass: process.env.SMT_PWD,
      },
      debug: true
    });

    console.log('SMTP Config:', {
        user: process.env.MAIL_ID,
        pass: process.env.SMT_PWD ? '****' : 'not set'
      });

    const mailOptions = {
      from: process.env.MAIL_ID,
      to: emailAddress,
      subject: "주문서 데이터",
      text: `요청하신 주문서 데이터입니다:\n\n${orderbookData}`,
      html: `<h1>주문서 데이터</h1><pre>${orderbookData}</pre>`
    };

    const emailSendResult = await transporter.sendMail(mailOptions);

    if (emailSendResult.response.includes("250")) {
      logger.info("주문서 데이터 이메일 전송 성공");
      return {
        success: true,
        message: "주문서 데이터 이메일 전송 성공",
      };
    } else {
      logger.info("주문서 데이터 이메일 전송 실패");
      return {
        success: false,
        message: "주문서 데이터 이메일 전송 실패",
      };
    }
  } catch (error) {
    if (error instanceof Error) {
        console.error('Detailed error:', error);
        console.error('Error stack:', error.stack);
        logger.error(`이메일 전송 중 오류 발생: ${error.message}`);
      return {
        success: false,
        message: "이메일 전송 중 오류 발생",
      };
    }

    logger.error("이메일 전송 중 예상치 못한 오류 발생");
    return {
      success: false,
      message: "이메일 전송 중 예상치 못한 오류 발생",
    };
  }
}

module.exports = {
  sendOrderbookEmail
};
