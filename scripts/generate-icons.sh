#!/bin/bash

# Create a temporary directory
mkdir -p temp_icons
cd temp_icons

# Download a leaf icon (using a PNG source)
curl -o leaf.png "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/leaf.svg" -H "Accept: image/png"

# Install ImageMagick if not already installed
if ! command -v magick &> /dev/null; then
    echo "ImageMagick is required but not installed. Installing..."
    brew install imagemagick
fi

# Convert PNG to different sizes using the new magick command
magick leaf.png -background none -resize 16x16 ../public/favicon-16x16.png
magick leaf.png -background none -resize 32x32 ../public/favicon-32x32.png
magick leaf.png -background none -resize 180x180 ../public/apple-touch-icon.png
magick leaf.png -background none -resize 192x192 ../public/android-chrome-192x192.png
magick leaf.png -background none -resize 512x512 ../public/android-chrome-512x512.png

# Create favicon.ico (contains multiple sizes)
magick leaf.png -background none -define icon:auto-resize=16,32,48,64 ../public/favicon.ico

# Clean up
cd ..
rm -rf temp_icons

echo "Icons generated successfully!"
