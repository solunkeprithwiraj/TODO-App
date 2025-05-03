pipeline {
    agent any
    
    options {
        timeout(time: 60, unit: 'MINUTES')  // Increased from 30 to 60 minutes
        disableConcurrentBuilds()
    }
    
    stages {
        stage('Setup') {
            steps {
                sh 'docker --version'
                sh 'docker-compose --version'
                sh 'ls -la /var/run/docker.sock'
                sh 'id $(whoami)'
                sh 'getent group docker'
            }
        }
        
        stage('Checkout') {
            steps {
                git url: 'https://github.com/solunkeprithwiraj/TODO-App.git', branch: 'main'
                sh 'chmod +x docker-setup.sh'
            }
        }
        
        stage('Build') {
            steps {
                // Add retry mechanism for build
                retry(2) {
                    sh 'docker-compose -f docker-compose.yml build --no-cache backend frontend'
                }
            }
        }
        
        stage('Test') {
            steps {
                // Add your test commands here
                sh 'echo "Running tests..."'
                // sh 'docker-compose -f docker-compose.yml run backend npm test'
                // sh 'docker-compose -f docker-compose.yml run frontend npm test'
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'docker-compose -f docker-compose.yml up -d'
                sh 'echo "Application deployed successfully"'
            }
        }
    }
    
    post {
        always {
            script {
                try {
                    sh 'docker-compose -f docker-compose.yml down'
                } catch (Exception e) {
                    echo "Warning: Failed to bring down docker-compose: ${e.message}"
                }
                
                try {
                    sh 'docker system prune -f'
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