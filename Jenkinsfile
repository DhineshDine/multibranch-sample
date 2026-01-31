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
            // Ensure 'git-hub' matches the ID you created in Jenkins Credentials Provider
withCredentials([usernamePassword(credentialsId: 'git-hub', 
                 passwordVariable: 'GIT_PWD', 
                 usernameVariable: 'GIT_USR')]) {
    script {
        // We use the variables defined above (GIT_USR and GIT_PWD)
        def authRepoUrl = GIT_REPO_URL.replace("https://", "https://${GIT_USR}:${GIT_PWD}@")
        
        bat """
            @echo off
            :: Now we use the authenticated URL to clone and push
            if exist temp-repo rmdir /s /q temp-repo
            git clone ${authRepoUrl} temp-repo
            cd temp-repo
            
            :: ... perform your file updates here ...

            git add .
            git commit -m "chore: update via jenkins [skip ci]"
            git push ${authRepoUrl} main
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