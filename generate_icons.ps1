$src = (Resolve-Path '.\fotos\menu.jpg').Path
foreach ($size in 180, 192, 512) {
    $img = [System.Drawing.Image]::FromFile($src)
    $bmp = New-Object System.Drawing.Bitmap($img, $size, $size)
    $bmp.Save(".\icone-$size.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $img.Dispose()
}
