pipeline {
    agent any 
    environment {
        DOCKER_IMAGE_BASE = "dhineshdine/multibranch-sample"
        DOCKER_IMAGE_NAME = "${DOCKER_IMAGE_BASE}:${BUILD_NUMBER}"
        
        GIT_REPO_URL = "https://github.com/DhineshDine/multibranch-sample.git"
        // Matches your repo structure: argo-cd/manifests/deployment.yaml
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
                    // Using --password-stdin is the secure way to login on Windows
                    bat "echo %DOCKER% | docker login -u dhineshdine --password-stdin"
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
                        // Use triple single-quotes ''' to avoid Groovy string interpolation issues with passwords
                        bat '''
                            @echo off
                            :: 1. Build the URL inside the shell using environment variables
                            set "AUTH_URL=https://%GIT_USR%:%GIT_PWD%@github.com/DhineshDine/multibranch-sample.git"
                            
                            :: 2. Clean and Clone
                            if exist temp-repo rmdir /s /q temp-repo
                            git clone "%AUTH_URL%" temp-repo
                            
                            :: 3. Enter the repo and check for success
                            if not exist temp-repo (echo "Clone failed" && exit 1)
                            cd temp-repo

                            :: 4. Identity config
                            git config user.email "dhineshdine18@example.com"
                            git config user.name "DhineshDine"

                            :: 5. Update image using PowerShell
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
    } // End of stages
    
    post {
        always {
            bat 'if exist temp-repo rmdir /s /q temp-repo'
        }
    }
}