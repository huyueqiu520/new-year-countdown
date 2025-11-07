const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

class IPServer {
    constructor(port = 3000) {
        this.port = port;
        this.ipLogFile = path.join(__dirname, 'ip_logs.txt');
        this.server = null;
        this.init();
    }

    init() {
        this.server = http.createServer((req, res) => {
            const parsedUrl = url.parse(req.url, true);
            
            // 设置CORS头
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }

            if (parsedUrl.pathname === '/log-ip' && req.method === 'POST') {
                this.handleLogIP(req, res);
            } else if (parsedUrl.pathname === '/get-ips' && req.method === 'GET') {
                this.handleGetIPs(req, res);
            } else if (parsedUrl.pathname === '/stats' && req.method === 'GET') {
                this.handleGetStats(req, res);
            } else if (parsedUrl.pathname === '/') {
                this.serveStaticFile(res, 'index.html');
            } else {
                this.serveStaticFile(res, parsedUrl.pathname.slice(1));
            }
        });
    }

    handleLogIP(req, res) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const clientIP = this.getClientIP(req);
                const timestamp = new Date().toISOString();
                
                const logEntry = {
                    ip: clientIP,
                    timestamp: timestamp,
                    userAgent: req.headers['user-agent'] || 'Unknown',
                    referer: req.headers['referer'] || 'Direct',
                    ...data
                };

                this.logIP(logEntry);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: true, 
                    message: 'IP logged successfully',
                    yourIP: clientIP
                }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    error: 'Invalid JSON data' 
                }));
            }
        });
    }

    handleGetIPs(req, res) {
        try {
            if (fs.existsSync(this.ipLogFile)) {
                const content = fs.readFileSync(this.ipLogFile, 'utf8');
                const logs = content.trim().split('\n').filter(line => line).map(line => JSON.parse(line));
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: true, 
                    logs: logs,
                    count: logs.length
                }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: true, 
                    logs: [],
                    count: 0
                }));
            }
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: false, 
                error: 'Failed to read IP logs' 
            }));
        }
    }

    handleGetStats(req, res) {
        try {
            const statsFile = path.join(__dirname, 'access_stats.json');
            if (fs.existsSync(statsFile)) {
                const data = fs.readFileSync(statsFile, 'utf8');
                const stats = JSON.parse(data);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: true, 
                    stats: stats
                }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: true, 
                    stats: {
                        totalAccesses: 0,
                        uniqueIPs: [],
                        uniqueIPCount: 0,
                        lastAccess: null
                    }
                }));
            }
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: false, 
                error: 'Failed to read stats' 
            }));
        }
    }

    serveStaticFile(res, filePath) {
        const safePath = path.normalize(filePath).replace(/^(\/\.\.|\/\.)/, '');
        const fullPath = path.join(__dirname, safePath);
        
        // 默认文件
        if (!filePath || filePath === '/') {
            filePath = 'index.html';
        }

        fs.readFile(fullPath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
                return;
            }

            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes = {
                '.html': 'text/html',
                '.css': 'text/css',
                '.js': 'application/javascript',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.gif': 'image/gif',
                '.mp3': 'audio/mpeg',
                '.ico': 'image/x-icon'
            };

            const contentType = mimeTypes[ext] || 'application/octet-stream';
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    }

    getClientIP(req) {
        // 禁止查阅项！
        const forwarded = req.headers['x-forwarded-for'];
        if (forwarded) {
            return forwarded.split(',')[0].trim();
        }
        
        const realIP = req.headers['x-real-ip'];
        if (realIP) {
            return realIP;
        }
        
        return req.connection.remoteAddress || 
               req.socket.remoteAddress ||
               (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
               '127.0.0.1';
    }

    logIP(logEntry) {
        const logLine = JSON.stringify(logEntry) + '\n';
        
        // 创建日志目录（如果不存在）
        const logDir = path.dirname(this.ipLogFile);
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        
        // 添加访问统计
        this.updateAccessStats(logEntry.ip);
        
        fs.appendFile(this.ipLogFile, logLine, (err) => {
            if (err) {
                console.error('❌ IP记录失败:', err.message);
            } else {
                console.log(`✅ IP记录成功: ${logEntry.ip} - ${new Date(logEntry.timestamp).toLocaleString('zh-CN')}`);
            }
        });
    }

    updateAccessStats(ip) {
        const statsFile = path.join(__dirname, 'access_stats.json');
        let stats = {
            totalAccesses: 0,
            uniqueIPs: new Set(),
            lastAccess: new Date().toISOString()
        };

        try {
            if (fs.existsSync(statsFile)) {
                const data = fs.readFileSync(statsFile, 'utf8');
                stats = JSON.parse(data);
                stats.uniqueIPs = new Set(stats.uniqueIPs || []);
            }
        } catch (error) {
            console.warn('⚠️ 无法读取访问统计文件，将创建新文件');
        }

        stats.totalAccesses++;
        stats.uniqueIPs.add(ip);
        stats.lastAccess = new Date().toISOString();

        // 转换为可序列化的格式
        const serializableStats = {
            totalAccesses: stats.totalAccesses,
            uniqueIPs: Array.from(stats.uniqueIPs),
            uniqueIPCount: stats.uniqueIPs.size,
            lastAccess: stats.lastAccess
        };

        try {
            fs.writeFileSync(statsFile, JSON.stringify(serializableStats, null, 2));
            console.log(`📊 访问统计更新 - 总访问: ${stats.totalAccesses}, 独立IP: ${stats.uniqueIPs.size}`);
        } catch (error) {
            console.error('❌ 无法写入访问统计文件:', error.message);
        }
    }

    start() {
        this.server.listen(this.port, () => {
            console.log('🎯 记录服务器启动成功');
            console.log(`🌐 访问地址: http://localhost:${this.port}`);
            console.log(`📝 日志文件: ${this.ipLogFile}`);
            console.log('⏹️  按 Ctrl+C 停止服务器');
            console.log('----------------------------------------');
        });

        this.server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`❌ 端口 ${this.port} 已被占用，请更换端口或关闭占用程序`);
            } else {
                console.error('❌ 服务器错误:', err);
            }
        });
    }

    stop() {
        if (this.server) {
            this.server.close(() => {
                console.log('服务器已停止');
            });
        }
    }
}

// 启动服务器
if (require.main === module) {
    const port = process.env.PORT || 8000;
    const server = new IPServer(port);
    server.start();

    // 优雅关闭~
    process.on('SIGINT', () => {
        console.log('\n正在关闭服务器...');
        server.stop();
        process.exit(0);
    });
}

module.exports = IPServer;