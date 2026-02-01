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
        dir('temp-repo') {
            checkout([
                $class: 'GitSCM',
                branches: [[name: '*/main']],
                userRemoteConfigs: [[
                    url: 'https://github.com/DhineshDine/multibranch-sample.git',
                    credentialsId: 'GitHub-UnameWithPass'
                ]]
            ])

            bat """
                git config user.email "dhineshdine18@example.com"
                git config user.name "DhineshDine"

                powershell -Command "(Get-Content ${MANIFEST_FILE}) -replace 'image:.*', 'image: ${DOCKER_IMAGE_NAME}' | Set-Content ${MANIFEST_FILE}"

                git add .
                git commit -m "image update: version ${BUILD_NUMBER} [skip ci]"
                git push origin main
            """
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