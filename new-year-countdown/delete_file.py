import os

file_path = os.path.join('C:/Users/Administrator/Desktop/new-year-countdown', '恭喜发财 .m4a')

try:
    if os.path.exists(file_path):
        os.remove(file_path)
        print(f"已删除文件: {file_path}")
    else:
        print(f"文件不存在: {file_path}")
except Exception as e:
    print(f"删除文件时出错: {e}")