#!/bin/bash

# Configurable variables
REPO_URL="https://github.com/solunkeprithwiraj/TODO-App.git"
CLONE_DIR="/var/jenkins_home/todo-app"

# Clone repo if not already cloned
if [ ! -d "$CLONE_DIR" ]; then
  echo "Cloning repository..."
  git clone "$REPO_URL" "$CLONE_DIR"
else
  echo "Pulling latest changes..."
  cd "$CLONE_DIR" && git pull origin main
fi

# Navigate to the project directory
cd "$CLONE_DIR"

# Optional: stop running containers first
docker-compose down

# Build and start services
echo "Starting application using Docker Compose..."
docker-compose up -d --build
