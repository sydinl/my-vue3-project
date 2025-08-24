@echo off
setlocal enabledelayedexpansion

set "itemsDir=c:\Users\wdd.WIN-HB0J5KJ1FOL\WorkSpace\my-vue3-project\src\static\items"

cd /d "%itemsDir%"

for %%F in (微信图片_*.jpg) do (
    set "oldName=%%F"
    set "newName=!oldName:微信图片=wxpic!"
    rename "!oldName!" "!newName!"
    echo 重命名: !oldName! -> !newName!
)

echo 重命名完成!
pause