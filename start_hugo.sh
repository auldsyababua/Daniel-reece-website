#!/bin/bash

# Clean any previous build artifacts
echo "Cleaning previous build..."
rm -rf public/
rm -rf resources/
rm -f .hugo_build.lock

# Rebuild the site from scratch
echo "Building Hugo site..."
hugo --cleanDestinationDir

# Start the server
echo "Starting Hugo server..."
hugo server --bind=0.0.0.0 --port=5000 --disableFastRender