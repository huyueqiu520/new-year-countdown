const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

// 配置静态文件服务，支持中文文件名
app.use(express.static(path.join(__dirname), {
    setHeaders: (res, path) => {
        // 为音频文件设置正确的 Content-Type
        if (path.endsWith('.mp3')) {
            res.setHeader('Content-Type', 'audio/mpeg');
        } else if (path.endsWith('.m4a')) {
            res.setHeader('Content-Type', 'audio/mp4');
        }
    }
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🎉 新年倒计时网站已启动！`);
    console.log(`🌐 访问地址: http://localhost:${PORT}`);
    console.log(`⏰ 服务器运行在端口 ${PORT}`);
});

process.on('SIGINT', () => {
    console.log('\n👋 服务器正在关闭...');
    process.exit(0);
});