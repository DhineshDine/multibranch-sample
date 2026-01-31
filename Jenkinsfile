pipeline {
    agent any 
    environment {
        DOCKER_IMAGE_BASE = "dhineshdine/multibranch-sample"
        DOCKER_IMAGE_NAME = "${DOCKER_IMAGE_BASE}:${BUILD_NUMBER}"
        
        GIT_REPO_URL = "https://github.com/DhineshDine/multibranch-sample.git"
        // Ensure this path is exactly as it appears in your GitHub repo
        MANIFEST_FILE = "argo-cd/manifests/deployment.yaml"
    }
    
    stages {
        stage('Build App') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                withCredentials([string(credentialsId: 'DOCKER_PWD', variable: 'DOCKER')]) {
                    bat "docker login -u dhineshdine -p %DOCKER%"
                    bat "docker build -t %DOCKER_IMAGE_NAME% ."
                    bat "docker push %DOCKER_IMAGE_NAME%"
                }
            }
        }

        stage('Update GitOps Manifests') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'GitHub-UnameWithPass', 
                                 passwordVariable: 'GIT_PWD', 
                                 usernameVariable: 'GIT_USR')]) {
                    script {
                        // We build the URL here, but we will use it carefully
                        def authRepoUrl = GIT_REPO_URL.replace("https://", "https://${GIT_USR}:${GIT_PWD}@")
                        
                        bat """
                            @echo off
                            :: 1. Clean and Clone
                            if exist temp-repo rmdir /s /q temp-repo
                            git clone ${authRepoUrl} temp-repo
                            
                            :: 2. Enter the repo
                            cd temp-repo

                            :: 3. Identify the user (Fixes identity error)
                            git config user.email "dhineshdine18@example.com"
                            git config user.name "DhineshDine"

                            :: 4. Update the image (Using the variable defined in environment)
                            :: Note: We use %MANIFEST_FILE% because we are inside the bat shell
                            powershell -Command "(Get-Content %MANIFEST_FILE%) -replace 'image:.*', 'image: ${env.DOCKER_IMAGE_NAME}' | Set-Content %MANIFEST_FILE%"
                            
                            :: 5. Push changes
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
            bat 'if exist temp-repo rmdir /s /q temp-repo'
        }
    }
}