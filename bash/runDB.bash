#!/bin/bash

# Check NODE_ENV and set PATH_TO_ENV_FILE
[ "$NODE_ENV" = 'production' ] && PATH_TO_ENV_FILE="./.production.env" || PATH_TO_ENV_FILE="./.development.env"

# Check if environment file exists
if [ ! -f "$PATH_TO_ENV_FILE" ]; then
  echo "Error: Environment file $PATH_TO_ENV_FILE not found"
  exit 1
fi

# Load environment variables
export $(cat $PATH_TO_ENV_FILE | grep -v ^# | xargs) >/dev/null

# Check if POSTGRES_USER, POSTGRES_PASSWORD and POSTGRES_DB are set
if [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_PASSWORD" ] || [ -z "$POSTGRES_DB" ] || [ -z "$DATABASE_URL" ]; then
  echo "POSTGRES_USER, POSTGRES_PASSWORD and POSTGRES_DB must be set"
  exit 1
fi

# Check for existing containers from the same image
EXISTING_CONTAINERS=$(docker ps -a -q --filter ancestor=voice2sound)

# If containers exist, stop and remove them
if [ ! -z "$EXISTING_CONTAINERS" ]; then
  echo "Stopping and removing existing containers..."
  docker stop $EXISTING_CONTAINERS >/dev/null
  docker rm $EXISTING_CONTAINERS >/dev/null
  echo "Existing containers removed."
fi

# Run docker
echo "Starting new container..."
docker run -p 5432:5432 --env-file $PATH_TO_ENV_FILE voice2sound

# Check if container started successfully
if [ $? -eq 0 ]; then
  echo "Container started successfully!"
else
  echo "Failed to start container"
  exit 1
fi