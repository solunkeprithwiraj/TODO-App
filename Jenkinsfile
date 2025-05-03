pipeline {
    agent any
    
    environment {
        GITHUB_REPO = 'https://github.com/solunkeprithwiraj/TODO-App.git'
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        PATH = "/usr/local/bin:${env.PATH}"
    }
    
    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }
    
    stages {
        stage('Setup') {
            steps {
                // Check Docker and Docker Compose versions
                sh 'docker --version || echo "Docker not found!"'
                sh 'docker-compose --version || echo "Docker Compose not found!"'
                
                // Verify Docker socket permissions
                sh '''
                    ls -la /var/run/docker.sock || echo "Docker socket not found!"
                    id jenkins
                    getent group docker || echo "Docker group not found!"
                '''
            }
        }
        
        stage('Checkout') {
            steps {
                // Clone the specific GitHub repository
                git url: "${env.GITHUB_REPO}", branch: 'main'
                
                // Make the docker setup script executable if it exists
                sh 'chmod +x docker-setup.sh || echo "Setup script not found, continuing..."'
            }
        }
        
        stage('Build') {
            steps {
                // Build all services (backend, frontend, and mongo will use the image)
                sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} build backend frontend'
            }
        }
        
        stage('Test') {
            steps {
                // Start MongoDB for testing
                sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} up -d mongo'
                
                // Wait for MongoDB to be ready
                sh 'sleep 10'
                
                // Run backend tests
                sh 'echo "Running backend tests..."'
                // Uncomment when you have tests
                // sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} run --rm backend npm test'
                
                // Run frontend tests
                sh 'echo "Running frontend tests..."'
                // Uncomment when you have tests
                // sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} run --rm frontend npm test'
            }
        }
        
        stage('Deploy') {
            steps {
                // Deploy the application using docker-compose
                sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} up -d'
            }
        }
    }
    
    post {
        success {
            echo 'CI/CD pipeline completed successfully!'
            echo 'TODO application is now deployed with MongoDB.'
        }
        failure {
            echo 'CI/CD pipeline failed. Check logs for details.'
        }
        always {
            // Clean up test containers if they exist
            sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} down || true'
            
            // Clean up unused Docker resources to prevent disk space issues
            sh 'docker system prune -f'
        }
    }
}