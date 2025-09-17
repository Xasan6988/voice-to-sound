#!/bin/bash

# Check if Dockerfile exists
if ! test -e ./src/db/Dockerfile; then
    echo "Error: Dockerfile not found at ./src/db/Dockerfile"
    exit 1
fi

# Stop and remove all containers using the image
if docker ps -a --filter "ancestor=voice2sound" --format "{{.ID}}" | grep -q .; then
    echo "Stopping and removing existing containers..."
    docker stop $(docker ps -a --filter "ancestor=voice2sound" --format "{{.ID}}") >/dev/null 2>&1
    docker rm $(docker ps -a --filter "ancestor=voice2sound" --format "{{.ID}}") >/dev/null 2>&1
fi

# Remove the image if it exists
if docker image inspect voice2sound >/dev/null 2>&1; then
    echo "Removing existing image..."
    docker rmi voice2sound >/dev/null 2>&1
fi

# Build new Docker image
echo "Building new image..."
docker build -t voice2sound ./src/db/

echo "Build complete. New image 'voice2sound' created."