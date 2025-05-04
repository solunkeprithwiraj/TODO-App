pipeline {
    agent any
    
    options {
        timeout(time: 60, unit: 'MINUTES')  // Increased timeout to 60 minutes
        disableConcurrentBuilds()
    }
    
    stages {
        stage('Setup') {
            steps {
                sh 'docker --version'
                sh 'docker-compose --version'
                sh 'ls -la /var/run/docker.sock'
                sh 'id $(whoami)'  // Make sure Jenkins user has docker group
                sh 'getent group docker'  // Verify docker group exists
            }
        }
        
        stage('Checkout') {
            steps {
                // Checkout your project from Git
                git url: 'https://github.com/solunkeprithwiraj/TODO-App.git', branch: 'main'
                sh 'chmod +x docker-setup.sh'  // Make sure the script is executable
            }
        }
        
        stage('Build') {
            steps {
                // Add retry mechanism for build to handle flaky builds
                retry(2) {
                    sh 'docker-compose -f docker-compose.yml build --no-cache backend frontend'
                }
            }
        }
        
        stage('Test') {
            steps {
                // Run tests for backend and frontend
                // Add specific test commands if needed
                sh 'echo "Running tests..."'
                // Example test runs (uncomment these if you have tests):
                // sh 'docker-compose -f docker-compose.yml run backend npm test'
                // sh 'docker-compose -f docker-compose.yml run frontend npm test'
            }
        }
        
        stage('Deploy') {
            steps {
                // Deploy application in detached mode
                sh 'docker-compose -f docker-compose.yml up -d'
                sh 'echo "Application deployed successfully"'
            }
        }
    }
    
    post {
        always {
            script {
                // Clean up containers and volumes after pipeline run
                try {
                    sh 'docker-compose -f docker-compose.yml down'
                } catch (Exception e) {
                    echo "Warning: Failed to bring down docker-compose: ${e.message}"
                }
                
                try {
                    // Clean up unused Docker resources
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
