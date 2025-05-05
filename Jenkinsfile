pipeline {
    agent any

    environment {
        DOCKER_COMPOSE = 'docker-compose -f docker-compose.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/solunkeprithwiraj/TODO-App.git'
            }
        }

        stage('Build and Run Containers') {
            steps {
                sh "${DOCKER_COMPOSE} down"
                sh "${DOCKER_COMPOSE} build"
                sh "${DOCKER_COMPOSE} up -d"
            }
        }
    }

    post {
        failure {
            echo 'Pipeline failed!'
        }
    }
}
