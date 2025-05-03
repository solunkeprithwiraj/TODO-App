pipeline {
    agent any
    
    environment {
        GITHUB_REPO = 'https://github.com/solunkeprithwiraj/TODO-App.git'
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Clone the specific GitHub repository
                git url: "${env.GITHUB_REPO}", branch: 'main'
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