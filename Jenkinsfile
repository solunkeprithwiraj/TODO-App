pipeline {
    agent any
    
    environment {
        DOCKER_COMPOSE = 'docker-compose'
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Clean workspace before checkout
                cleanWs()
                // Checkout with specific branch
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[url: 'https://github.com/solunkeprithwiraj/TODO-App.git']],
                    extensions: [[$class: 'CleanBeforeCheckout']]
                ])
            }
        }
        
        stage('Build and Deploy') {
            steps {
                script {
                    // Stop and remove existing containers if any
                    sh "${DOCKER_COMPOSE} down"
                    
                    // Build and start the containers
                    sh "${DOCKER_COMPOSE} up -d --build"
                    
                    // Wait for services to be ready
                    sleep(30)   
                }
            }
        }
        
        stage('Verify') {
            steps {
                script {
                    // Check if containers are running
                    sh "docker ps"
                    
                    // Basic health check
                    sh "curl -f http://localhost:3000 || true"
                    sh "curl -f http://localhost:5000 || true"
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
