"# new-year-countdown" 
# 新年倒计时网站

一个带有烟花、红包雨、背景音乐和IP统计功能的倒计时网站，庆祝中国新年。这个项目提供了一个互动性强、视觉效果丰富的倒计时体验。

## 🎉 功能特色

1. 🎉 新年倒计时 - 实时显示距离新年的时间
2. 🎵 背景音乐 - 自动播放恭喜发财音乐
3. 🎆 互动特效 - 烟花、红包雨、下雪效果
4. 🧧 春节装饰 - 福字、春联、灯笼、生肖轮盘
5. 🌐 IP记录 - 自动记录访问者信息
6. 📊 统计查看 - 实时查看访问统计

## 🚀 快速开始

### 先决条件

- [Node.js](https://nodejs.org/) (v12.0.0 或更高版本)
- Python (如果使用Python脚本)

### 安装与运行

1. 克隆或下载项目到本地

```bash
git clone https://github.com/yourusername/new-year-countdown.git
cd new-year-countdown
```

2. 安装依赖

```bash
npm install
```

3. 启动服务器

```bash
npm start
```

4. 访问网站
   - 打开浏览器访问 `http://localhost:8080`
   - IP记录服务器运行在 `http://localhost:3000`

### 一键启动脚本

项目还提供了便捷的启动脚本：

- `npm run launch` - 安装依赖并启动服务器
- `npm run serve` - 使用简单服务器启动（无IP统计功能）

## 🔧 端口说明

- **8080端口**: 网站服务器，提供新年倒计时页面
- **3000端口**: IP记录服务器，记录访问者信息

## 📁 项目结构

```
新年倒计时/
├── index.html          # 主页面
├── ip-stats.html       # IP访问统计页面
├── script.js           # 前端JavaScript代码
├── style.css           # 样式文件
├── server.js           # 网站服务器
├── ip-server.js        # IP记录服务器
├── ip_logs.txt         # IP记录文件（自动生成）
├── access_stats.json   # 访问统计文件（自动生成）
├── README.md
├── package.json
└── 启动文件.py         # Python启动脚本
```

## ⚙️ 配置

如果需要更改端口或其他设置，请修改以下文件：

- `server.js` - 网站服务器端口配置
- `ip-server.js` - IP记录服务器端口配置
- `script.js` - 前端API调用端口配置

## 🤝 贡献

欢迎提交Pull Request来改进这个项目。在提交之前，请确保您的代码符合项目的风格，并添加必要的测试。

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 参阅 [LICENSE](LICENSE) 文件了解详情。

## 📞 支持

如果您遇到问题或有建议，请在项目的Issues页面提出。

如遇到技术问题，请检查：
1. Node.js 和 Python 是否已正确安装
2. 端口3000和8080是否被其他程序占用
3. 防火墙或安全软件是否阻止了服务器运行
