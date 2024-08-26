/**
 * @swagger
 * /hello:
 *   get:
 *     summary: 환영 메시지 페이지 표시
 *     description: X-widget Bot 응용 프로그램의 환영 메시지 페이지를 HTML로 반환합니다.
 *     tags:
 *       - General
 *     produces:
 *       - text/html
 *     responses:
 *       200:
 *         description: HTML 페이지 반환 성공
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<!DOCTYPE html><html lang='en'>...</html>"
 */
exports.sayHello = (req, res) => {
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>X-widget Bot</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #f0f0f0;
                }
                .container {
                    text-align: center;
                    padding: 20px;
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                h1 {
                    color: #333;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>X-BOT</h1>
                <p>Welcome to our X-widget Bot application!</p>
            </div>
        </body>
        </html>
    `;
    
    res.send(html);
};