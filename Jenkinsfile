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
                        bat '''
                            @echo off
                            :: 1. Build the URL inside the shell to avoid Groovy formatting issues
                            set "AUTH_URL=https://%GIT_USR%:%GIT_PWD%@github.com/DhineshDine/multibranch-sample.git"
                            
                            :: 2. Clean and Clone
                            if exist temp-repo rmdir /s /q temp-repo
                            git clone %AUTH_URL% temp-repo
                            
                            :: 3. Enter the repo
                            cd temp-repo
                            if %ERRORLEVEL% neq 0 (echo "Clone failed" && exit 1)

                            :: 4. Identity config (Required for Windows)
                            git config user.email "dhineshdine18@example.com"
                            git config user.name "DhineshDine"

                            :: 5. Update image using PowerShell
                            :: Note: I used %MANIFEST_FILE% from your environment block
                            powershell -Command "(Get-Content %MANIFEST_FILE%) -replace 'image:.*', 'image: %DOCKER_IMAGE_NAME%' | Set-Content %MANIFEST_FILE%"
                            
                            :: 6. Commit and Push
                            git add .
                            git commit -m "image update: version %BUILD_NUMBER% [skip ci]"
                            git push origin main
                        '''
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