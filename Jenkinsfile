pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {

                git branch: 'main', url: 'https://github.com/solunkeprithwiraj/TODO-App.git'            
            }
        }

        stage('Build and Start Containers') {
            steps {
                sh 'docker-compose up -d --build'
            }
        }

        stage('Run Backend Tests') {
            steps {
                sh 'docker-compose exec backend npm test'
            }
        }

        stage('Cleanup') {
            steps {
                sh 'docker-compose down'
            }
        }
    }
}
