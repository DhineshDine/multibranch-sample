pipeline {
    agent any

    environment {
        IMAGE_NAME = "dhineshdine/multibranch-sample:${BUILD_NUMBER}"
        GIT_REPO   = "DhineshDine/multibranch-sample.git"
        MANIFEST   = "argo-cd/manifests/deployment.yaml"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                bat "docker build -t %IMAGE_NAME% ."
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([
                    string(credentialsId: 'DOCKER_PWD', variable: 'DOCKER_PASS')
                ]) {
                    bat """
                    echo %DOCKER_PASS% | docker login -u dhineshdine --password-stdin
                    docker push %IMAGE_NAME%
                    """
                }
            }
        }

        stage('Update GitOps Manifest') {
            steps {
                withCredentials([
                    string(credentialsId: 'git-hub', variable: 'GITHUB_TOKEN')
                ]) {
                    bat """
                    if exist temp-repo rmdir /s /q temp-repo

                    git clone https://%GITHUB_TOKEN%@github.com/%GIT_REPO% temp-repo
                    cd temp-repo

                    git checkout main

                    git config user.email "dhineshdine18@example.com"
                    git config user.name "DhineshDine"

                    powershell -Command "(Get-Content %MANIFEST%) -replace 'image:.*', 'image: %IMAGE_NAME%' | Set-Content %MANIFEST%"

                    git add %MANIFEST%

                    git diff --cached --quiet || git commit -m "Update image to %IMAGE_NAME% [skip ci]"

                    git push origin main
                    """
                }
            }
        }
    }

    post {
        always {
            bat 'if exist temp-repo rmdir /s /q temp-repo'
        }
    }
}
