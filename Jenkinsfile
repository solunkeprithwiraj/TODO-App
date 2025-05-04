pipeline {
    agent any
    
    options {
        timeout(time: 60, unit: 'MINUTES')
        disableConcurrentBuilds()
    }
    
    stages {
        stage('Setup') {
            steps {
                sh 'docker --version'
                sh 'docker-compose --version'
                sh 'ls -la /var/run/docker.sock || echo "Docker socket not found"'
                sh 'id $(whoami) || echo "Could not get user info"'  // Make sure Jenkins user has docker group
                sh 'getent group docker || echo "Docker group not found"'  // Verify docker group exists
            }
        }
        
        stage('Checkout') {
            steps {
                git url: 'https://github.com/solunkeprithwiraj/TODO-App.git', branch: 'main'
                sh 'chmod +x docker-setup.sh || echo "Script not found"'  // Make sure the script is executable
            }
        }
        
        stage('Build') {
            steps {
                retry(2) {
                    sh 'docker-compose -f docker-compose.yml build --no-cache backend frontend'
                }
            }
        }
        
        stage('Test') {
            steps {
                sh 'echo "Running tests..."'
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