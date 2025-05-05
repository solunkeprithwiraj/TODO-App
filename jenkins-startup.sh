#!/bin/bash

# Clone or pull your GitHub repo
if [ ! -d "your-project" ]; then
  git clone https://github.com/your-user/your-project.git
else
  cd your-project
  git pull origin main
fi

# Navigate into the project folder
cd your-project

# Start your Docker containers
docker-compose up -d --build
