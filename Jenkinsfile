pipeline {
    agent any

    environment {
        IMAGE_NAME = "dhineshdine/multibranch-sample"
        MANIFEST_PATH = "argo-cd/manifests/deployment.yaml"
        TEMP_REPO = "temp-repo"
        GIT_REPO = "https://github.com/DhineshDine/multibranch-sample.git"
    }

    stages {

        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    env.BUILD_TAG_VERSION = env.BUILD_NUMBER
                }
                bat """
                docker build -t %IMAGE_NAME%:%BUILD_TAG_VERSION% .
                """
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'DockerUnamePass',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat """
                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                    docker push %IMAGE_NAME%:%BUILD_TAG_VERSION%
                    """
                }
            }
        }

        stage('Clone GitOps Repo') {
            steps {
                bat """
                if exist %TEMP_REPO% rmdir /s /q %TEMP_REPO%
                git clone %GIT_REPO% %TEMP_REPO%
                """
            }
        }

        stage('Update Kubernetes Manifest') {
            steps {
                bat """
                cd %TEMP_REPO%
                powershell -Command "(Get-Content %MANIFEST_PATH%) -replace 'image:.*', 'image: %IMAGE_NAME%:%BUILD_TAG_VERSION%' | Set-Content %MANIFEST_PATH%"
                """
            }
        }

        stage('Commit & Push Manifest') {
            steps {
               withCredentials([
    string(credentialsId: 'git-hub', variable: 'GITHUB_TOKEN')]) {
    bat """
    git config user.email "dhineshdine18@example.com"
    git config user.name "DhineshDine"

    git remote set-url origin https://%GITHUB_TOKEN%@github.com/DhineshDine/multibranch-sample.git

    git push origin main
    """
}

            }
        }
    }

    post {
        always {
            bat """
            if exist %TEMP_REPO% rmdir /s /q %TEMP_REPO%
            """
        }
        success {
            echo "✅ CI completed — Argo CD will sync automatically"
        }
        failure {
            echo "❌ Pipeline failed — check logs"
        }
    }
}
