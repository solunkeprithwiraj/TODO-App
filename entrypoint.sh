#!/bin/bash

# Run the start-project script
if [ -f "/var/jenkins_home/start-project.sh" ]; then
    echo "Running start-project.sh..."
    /var/jenkins_home/start-project.sh
else
    echo "start-project.sh not found!"
fi

# Start Jenkins
exec /usr/local/bin/jenkins.sh "$@"