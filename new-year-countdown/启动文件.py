#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
新年倒计时网站启动器 - 最简单版本
"""

import os
import subprocess
import sys
import time

print("🎉 新年倒计时网站启动器")
print("=" * 50)

# 切换到项目目录
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# 检查必要文件
required_files = ['index-web.html', 'style.css']
for file in required_files:
    if not os.path.exists(file):
        print(f"❌ 错误: 缺少文件 {file}")
        input("按回车键退出...")
        sys.exit(1)

print("✅ 文件检查通过")
print("🚀 正在启动服务器...")

# 使用Python内置HTTP服务器
try:
    # 启动服务器
    server_process = subprocess.Popen([sys.executable, '-m', 'http.server', '8000', '--directory', '.'])
    
    # 等待服务器启动
    time.sleep(2)
    
    print("✅ 服务器已启动!")
    print("🌐 访问地址: http://localhost:8000")
    print("⏹️  按 Ctrl+C 停止服务器")
    
    # 打开浏览器
    try:
        import webbrowser
        webbrowser.open("http://localhost:8000")
        print("🌐 已自动打开浏览器")
    except Exception as e:
        print(f"⚠️  无法自动打开浏览器: {e}")
    
    # 等待用户停止
    input("按回车键停止服务器...")
    
    # 停止服务器
    server_process.terminate()
    server_process.wait()
    print("👋 服务器已关闭")
    
except Exception as e:
    print(f"❌ 启动失败: {e}")
    input("按回车键退出...")