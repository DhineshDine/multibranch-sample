pipeline {
    agent any 
    environment {
        // 1. Use Build Number for unique tagging (Best Practice for GitOps)
        DOCKER_IMAGE_BASE = "dhineshdine/multibranch-sample"
        DOCKER_IMAGE_NAME = "${DOCKER_IMAGE_BASE}:${BUILD_NUMBER}"
        
        // 2. Git Manifest Details
        GIT_REPO_URL = "https://github.com/DhineshDine/multibranch-sample.git"
        MANIFEST_PATH = "argocd/manifests/deployment.yaml"
    }
    
    stages {
        stage('Build App') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                // Use a standard credential helper or masked variable
                withCredentials([string(credentialsId: 'DOCKER_PWD', variable: 'DOCKER')]) {
                    bat "docker login -u dhineshdine -p %DOCKER%"
                    bat "docker build -t %DOCKER_IMAGE_NAME% ."
                    bat "docker push %DOCKER_IMAGE_NAME%"
                }
            }
        }

       stage('Update GitOps Manifests') {
    steps {
        // Use the ID of your 'Username with password' credential
        withCredentials([gitUsernamePassword(credentialsId: 'GitHub-UnameWithPass', 
                                             gitToolName: 'Default')]) {
            script {
                bat """
                    @echo off
                    :: 1. Clean up and Clone
                    if exist temp-repo rmdir /s /q temp-repo
                    git clone ${GIT_REPO_URL} temp-repo
                    cd temp-repo

                    :: 2. Identify the Jenkins Bot (Fixes 'Author identity unknown')
                    git config user.email "jenkins-bot@example.com"
                    git config user.name "Jenkins Automation"

                    :: 3. Update the YAML file
                    powershell -Command "(Get-Content argocd/manifests/deployment.yaml) -replace 'image:.*', 'image: ${env.DOCKER_IMAGE_NAME}' | Set-Content argocd/manifests/deployment.yaml"

                    :: 4. Commit and Push
                    git add .
                    git commit -m "image update: version ${BUILD_NUMBER} [skip ci]"
                    git push origin main
                """
            }
        }
    }
}
    }
    
    post {
        always {
            // Clean up workspace
            bat 'if exist temp-repo rmdir /s /q temp-repo'
        }
    }
}