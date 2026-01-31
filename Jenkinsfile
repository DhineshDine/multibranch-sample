pipeline {
    agent any 
    environment {
        // 1. Use Build Number for unique tagging (Best Practice for GitOps)
        DOCKER_IMAGE_BASE = "dhineshdine/multibranch-sample"
        DOCKER_IMAGE_NAME = "${DOCKER_IMAGE_BASE}:${BUILD_NUMBER}"
        
        // 2. Git Manifest Details
        GIT_REPO_URL = "https://github.com/dhineshdine/your-repo-name.git"
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
                // Use Username/Password credentials for Git push access
               withCredentials([string(credentialsId: 'git-hub', variable: 'Git_hub')]) 
                {
                    script {
                        // Create an authenticated URL for the push
                        def authRepoUrl = GIT_REPO_URL.replace("https://", "https://${GIT_USERNAME}:${GIT_PASSWORD}@")
                        
                        bat """
                            @echo off
                            :: Clean up if previous run left the folder
                            if exist temp-repo rmdir /s /q temp-repo
                            
                            git clone ${authRepoUrl} temp-repo
                            cd temp-repo
                            
                            :: Use PowerShell to find the image line and replace it with the new build tag
                            powershell -Command "(Get-Content ${env.MANIFEST_PATH}) -replace 'image:.*', 'image: ${env.DOCKER_IMAGE_NAME}' | Set-Content ${env.MANIFEST_PATH}"
                            
                            :: Set Git config (local to this repo)
                            git config user.email "jenkins-bot@example.com"
                            git config user.name "Jenkins Automation"
                            
                            :: Commit and push back to GitHub
                            git add ${env.MANIFEST_PATH}
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