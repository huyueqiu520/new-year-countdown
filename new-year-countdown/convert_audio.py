import os
import sys

def check_file_info():
    mp3_file = "恭喜发财.mp3"
    m4a_file = "恭喜发财.m4a"
    
    # 检查MP3文件是否存在
    if not os.path.exists(mp3_file):
        print(f"错误：找不到文件 {mp3_file}")
        return False
    
    # 获取文件大小
    file_size = os.path.getsize(mp3_file)
    print(f"MP3文件: {mp3_file}")
    print(f"文件大小: {file_size} 字节 ({file_size/1024/1024:.2f} MB)")
    
    # 检查是否已有M4A文件
    if os.path.exists(m4a_file):
        print(f"\nM4A文件已存在: {m4a_file}")
        m4a_size = os.path.getsize(m4a_file)
        print(f"M4A文件大小: {m4a_size} 字节 ({m4a_size/1024/1024:.2f} MB)")
    else:
        print(f"\nM4A文件不存在: {m4a_file}")
    
    return True

if __name__ == "__main__":
    check_file_info()