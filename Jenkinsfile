pipeline {
    agent any

    triggers {
        githubPush() // Triggers pipeline on every push to GitHub
    }

    environment {
        // Define any environment variables you need
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install' 
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test' // Replace with your test command
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build' // or your build command
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploy stage here (optional)'
                
            }
        }
    }

    post {
        always {
            echo 'Job finished!'
        }
    }
}
