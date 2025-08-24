import os

# 设置目录路径
directory = r"c:\Users\wdd.WIN-HB0J5KJ1FOL\WorkSpace\my-vue3-project\src\static\items"

# 获取所有需要重命名的文件
files = [f for f in os.listdir(directory) if f.startswith('微信图片') and f.endswith('.jpg')]
count = 0

# 遍历并重命名文件
for filename in files:
    # 创建新文件名
    new_filename = filename.replace('微信图片', 'wxpic')
    
    # 构建完整路径
    old_path = os.path.join(directory, filename)
    new_path = os.path.join(directory, new_filename)
    
    # 执行重命名
    os.rename(old_path, new_path)
    print(f"重命名: {filename} -> {new_filename}")
    count += 1

print(f"重命名完成! 处理了 {count} 个文件。")