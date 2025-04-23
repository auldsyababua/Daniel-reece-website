#!/bin/bash

# Clean any previous build artifacts
echo "Cleaning previous build..."
rm -rf public/
rm -rf resources/
rm -f .hugo_build.lock

# Make sure node modules are installed
echo "Running npm install (if needed)..."
npm install

# Make sure CSS directories exist
mkdir -p static/css
mkdir -p assets/css
mkdir -p public/css

# Create a simple test.css file in assets
echo "Creating test CSS files..."
if [ ! -f assets/css/test.css ]; then
  echo "/* Test CSS file */
  body { 
    border: 5px solid red; 
  }" > assets/css/test.css
fi

# Ensure style.css exists
if [ ! -f assets/css/style.css ]; then
  echo "@tailwind base;
@tailwind components;
@tailwind utilities;" > assets/css/style.css
fi

# Ensure main.css exists
if [ ! -f assets/css/main.css ]; then
  echo "/* Main custom CSS */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}" > assets/css/main.css
fi

# Run Tailwind build with NODE_ENV=production for full class generation
echo "Building CSS with Tailwind..."
NODE_ENV=production npx tailwindcss -i ./assets/css/style.css -o ./static/css/style.css
NODE_ENV=production npx tailwindcss -i ./assets/css/main.css -o ./static/css/main.css 
NODE_ENV=production npx tailwindcss -i ./assets/css/test.css -o ./static/css/test.css

# Rebuild the site from scratch
echo "Building Hugo site..."
hugo --cleanDestinationDir

# Copy CSS to public (direct copy to ensure CSS is available)
echo "Ensuring CSS is available..."
mkdir -p public/css/
cp -f static/css/*.css public/css/

# Output size of CSS files for debugging
echo "CSS file sizes:"
ls -lh static/css/
ls -lh public/css/

# Start the server
echo "Starting Hugo server..."
hugo server --bind=0.0.0.0 --port=5000 --disableFastRender