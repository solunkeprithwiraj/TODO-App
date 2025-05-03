#!/bin/bash

# This script helps fix Docker permissions inside the Jenkins container
# Place this file in the root of your repository

# Make sure the Docker socket is accessible to the jenkins user
HOST_DOCKER_GID=$(stat -c '%g' /var/run/docker.sock)
CONTAINER_DOCKER_GID=$(getent group docker | cut -d: -f3)

if [ "$HOST_DOCKER_GID" != "$CONTAINER_DOCKER_GID" ]; then
    echo "Adjusting docker group ID to match host's docker socket GID: $HOST_DOCKER_GID"
    groupmod -g "$HOST_DOCKER_GID" docker
fi

# Add jenkins user to the docker group
usermod -aG docker jenkins

# Fix socket permissions
chmod 666 /var/run/docker.sock

echo "Docker environment setup complete"