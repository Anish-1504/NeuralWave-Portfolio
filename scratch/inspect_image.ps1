Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public\sequences\headphones\ezgif-frame-001.jpg"))
Write-Output "Dimensions: $($img.Width) x $($img.Height)"
$corners = @(
    $img.GetPixel(5, 5),
    $img.GetPixel($img.Width - 5, 5),
    $img.GetPixel(5, $img.Height - 5),
    $img.GetPixel($img.Width - 5, $img.Height - 5)
)
Write-Output "Corner Colors: R=$($corners[0].R), G=$($corners[0].G), B=$($corners[0].B)"

# Find bounding box
$minY = 9999; $maxY = 0; $minX = 9999; $maxX = 0
for ($y = 0; $y -lt $img.Height; $y += 4) {
    for ($x = 0; $x -lt $img.Width; $x += 4) {
        $c = $img.GetPixel($x, $y)
        if ($c.R -gt 25 -or $c.G -gt 25 -or $c.B -gt 25) {
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
        }
    }
}
Write-Output "Object bounding box in 1920x1080: X=$minX to $maxX, Y=$minY to $maxY"
$img.Dispose()
