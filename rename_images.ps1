# Rename script for image files
$directory = "c:\Users\wdd.WIN-HB0J5KJ1FOL\WorkSpace\my-vue3-project\src\static\items"
$files = Get-ChildItem -Path $directory -Filter "微信图片_*.jpg"
$count = 0

foreach ($file in $files) {
    $newName = $file.Name -replace '微信图片', 'wxpic'
    $newPath = Join-Path -Path $directory -ChildPath $newName
    Rename-Item -Path $file.FullName -NewName $newName -Force
    Write-Host "Renamed: $($file.Name) -> $newName"
    $count++
}

Write-Host "Rename completed! Processed $count files."