#!/bin/bash

# Run as root to fix Docker permissions
if [ "$(id -u)" = '0' ]; then
    echo "Running Docker setup script..."
    /usr/local/bin/docker-setup.sh
fi

# Switch to Jenkins user
if [ "$1" = 'jenkins.sh' ] && [ "$(id -u)" = '0' ]; then
    # Jenkins is run as the jenkins user, so we need to switch to that user
    exec gosu jenkins "$@"
else
    # If not running as jenkins.sh or not running as root, just execute the command
    exec "$@"
fi