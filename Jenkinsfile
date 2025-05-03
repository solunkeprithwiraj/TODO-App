pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                // This will clone your GitHub repository
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                sh 'docker-compose build'
            }
        }
        
        stage('Test') {
            steps {
                // Add your test commands here
                sh 'echo "Running tests..."'
                // Example test commands:
                // sh 'docker-compose run --rm backend npm test'
                // sh 'docker-compose run --rm frontend npm test'
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
    
    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Build or deployment failed!'
        }
    }
}