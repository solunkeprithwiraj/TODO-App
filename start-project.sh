#!/bin/bash

echo "Starting project initialization..."

# Log workspace contents
echo "Workspace contents:"
ls -la /var/jenkins_home/workspace/

# Check if backend directory exists and process it
if [ -d "/var/jenkins_home/workspace/backend" ]; then
    echo "Found backend directory. Initializing..."
    # Add your backend initialization commands here
    # cd /var/jenkins_home/workspace/backend && npm install (for Node.js)
    # or any other backend setup commands
fi

# Check if frontend directory exists and process it
if [ -d "/var/jenkins_home/workspace/frontend" ]; then
    echo "Found frontend directory. Initializing..."
    # Add your frontend initialization commands here
    # cd /var/jenkins_home/workspace/frontend && npm install (for Node.js)
    # or any other frontend setup commands
fi

# Check if docker-compose file exists
if [ -f "/var/jenkins_home/workspace/docker-compose.yml" ]; then
    echo "Found docker-compose.yml. Ready for deployment."
    # Optionally start services if needed
    # cd /var/jenkins_home/workspace && docker-compose up -d
fi

echo "Project initialization complete!"