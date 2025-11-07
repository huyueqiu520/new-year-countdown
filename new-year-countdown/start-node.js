#!/usr/bin/env node

/**
 * Node.js 启动脚本
 * 启动新年倒计时网站服务器
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎉 新年倒计时网站启动器 (Node.js版本)');
console.log('='.repeat(50));

// 检查依赖
console.log('📦 检查项目依赖...');
try {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const nodeModulesPath = path.join(__dirname, 'node_modules');
    
    if (fs.existsSync(packageJsonPath) && !fs.existsSync(nodeModulesPath)) {
        console.log('安装项目依赖...');
        execSync('npm install', { stdio: 'inherit', cwd: __dirname });
        console.log('✅ 依赖安装完成');
    } else {
        console.log('✅ 依赖已安装');
    }
} catch (error) {
    console.log('⚠️  依赖检查失败，继续启动...');
}

// 启动服务器
console.log('\n🚀 正在启动服务器...');
try {
    const serverScript = fs.existsSync(path.join(__dirname, 'server.js')) 
        ? 'server.js' 
        : 'simple-server.js';
    
    console.log(`使用服务器脚本: ${serverScript}`);
    console.log('🌐 访问地址: http://localhost:8080');
    console.log('⏹️  按 Ctrl+C 停止服务器\n');
    
    // 启动服务器
    require(`./${serverScript}`);
} catch (error) {
    console.error('❌ 启动服务器失败:', error.message);
    process.exit(1);
}