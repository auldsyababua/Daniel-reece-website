#!/bin/bash

# Clean any previous build artifacts
echo "Cleaning previous build..."
rm -rf public/
rm -rf resources/
rm -f .hugo_build.lock

# Make sure node modules are installed
echo "Running npm install (if needed)..."
npm install

# Run Tailwind build 
echo "Building CSS with Tailwind..."
npx tailwindcss -i ./assets/css/style.css -o ./static/css/style.css
npx tailwindcss -i ./assets/css/main.css -o ./static/css/main.css
npx tailwindcss -i ./assets/css/test.css -o ./static/css/test.css

# Rebuild the site from scratch
echo "Building Hugo site..."
hugo --cleanDestinationDir

# Copy CSS to public
echo "Ensuring CSS is available..."
mkdir -p public/css/
cp -f static/css/*.css public/css/

# Start the server
echo "Starting Hugo server..."
hugo server --bind=0.0.0.0 --port=5000 --disableFastRender