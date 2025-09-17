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
if [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_PASSWORD" ] || [ -z "$POSTGRES_DB" ]; then
  echo "POSTGRES_USER, POSTGRES_PASSWORD and POSTGRES_DB must be set"
  exit 1
fi

# Run docker
docker run -p 5432:5432 --env-file $PATH_TO_ENV_FILE voice2sound