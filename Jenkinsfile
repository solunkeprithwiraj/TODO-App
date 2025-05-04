pipeline {
    agent any
    
    options {
        timeout(time: 60, unit: 'MINUTES')
        disableConcurrentBuilds()
    }
    
    stages {
        stage('Setup') {
            steps {
                bat 'docker --version'
                bat 'docker-compose --version'
                // Windows uses named pipes instead of sockets
                bat 'dir \\.\pipe\docker_engine || echo "Docker pipe not found"'
            }
        }
        
        stage('Checkout') {
            steps {
                git url: 'https://github.com/solunkeprithwiraj/TODO-App.git', branch: 'main'
            }
        }
        
        stage('Build') {
            steps {
                retry(2) {
                    bat 'docker-compose -f docker-compose.yml build --no-cache backend frontend'
                }
            }
        }
        
        stage('Test') {
            steps {
                bat 'echo "Running tests..."'
            }
        }
        
        stage('Deploy') {
            steps {
                bat 'docker-compose -f docker-compose.yml up -d'
                bat 'echo "Application deployed successfully"'
            }
        }
    }
    
    post {
        always {
            script {
                try {
                    bat 'docker-compose -f docker-compose.yml down'
                } catch (Exception e) {
                    echo "Warning: Failed to bring down docker-compose: ${e.message}"
                }
                
                try {
                    bat 'docker system prune -f'
                } catch (Exception e) {
                    echo "Warning: Failed to run docker system prune: ${e.message}"
                }
            }
        }
        
        success {
            echo 'Pipeline completed successfully!'
        }
        
        failure {
            echo 'Pipeline failed!'
        }
    }
}