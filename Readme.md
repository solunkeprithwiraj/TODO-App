# TODO App with CI/CD Pipeline

This repository contains a TODO application with a complete CI/CD pipeline using Jenkins, Docker, and MongoDB.

## Project Structure

```
.
├── backend/          # Node.js backend
├── frontend/         # React frontend
├── Jenkinsfile       # Jenkins pipeline configuration
├── Dockerfile        # Dockerfile for Jenkins
└── docker-compose.yml # Docker Compose configuration
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Setting Up Jenkins

1. Clone this repository:
   ```
   git clone https://github.com/solunkeprithwiraj/TODO-App.git
   cd TODO-App
   ```

2. Start Jenkins:
   ```
   docker-compose up -d jenkins
   ```

3. Access Jenkins at `http://localhost:8080` and set it up:
   - Get the initial admin password: `docker-compose exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword`
   - Install suggested plugins
   - Create an admin user
   - Configure Jenkins

4. Set up a pipeline:
   - Create a new pipeline job
   - Select "Pipeline script from SCM"
   - Set SCM to Git
   - Repository URL: `https://github.com/solunkeprithwiraj/TODO-App.git`
   - Branch: `main`
   - Script Path: `Jenkinsfile`
   - Save and run the pipeline

### Manual Deployment

If you want to deploy the application without Jenkins:

```
docker-compose up -d
```

This will start the frontend, backend, MongoDB, and Jenkins services.

## Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017
- Jenkins: http://localhost:8080

## Environment Configuration

The backend uses the following environment variables:
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT authentication
- `USER`: Email user for notifications
- `PASS`: Email password for notifications
- `NODE_ENV`: Application environment (development, production)

## CI/CD Pipeline

The CI/CD pipeline consists of the following stages:

1. **Checkout**: Clone the repository
2. **Build**: Build Docker images for backend and frontend
3. **Test**: Start MongoDB and run tests for both backend and frontend
4. **Deploy**: Deploy the application using Docker Compose

## Troubleshooting

### Jenkins cannot access Docker

If Jenkins cannot access Docker, ensure that:
1. The Docker socket is properly mounted
2. The jenkins user is in the docker group
3. The proper permissions are set on the Docker socket

You can run:
```
docker-compose exec jenkins bash -c "id jenkins && ls -la /var/run/docker.sock"
```

### Backend cannot connect to MongoDB

If the backend cannot connect to MongoDB, check:
1. MongoDB is running: `docker-compose ps mongo`
2. The MONGO_URI environment variable is set correctly
3. Network connectivity: `docker-compose exec backend ping mongo`

### Container networking issues

If containers cannot communicate with each other, check that they are on the same network:
```
docker network ls
docker network inspect app-network
```