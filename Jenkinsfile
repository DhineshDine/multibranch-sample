pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BASE = "dhineshdine/multibranch-sample"
        DOCKER_IMAGE_NAME = "${DOCKER_IMAGE_BASE}:${BUILD_NUMBER}"
        GIT_REPO_URL = "https://github.com/DhineshDine/multibranch-sample.git"
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
                withCredentials([
                    string(credentialsId: 'DOCKER_PWD', variable: 'DOCKER_PWD')
                ]) {
                    bat """
                    echo %DOCKER_PWD% | docker login -u dhineshdine --password-stdin
                    docker build -t %DOCKER_IMAGE_NAME% .
                    docker push %DOCKER_IMAGE_NAME%
                    """
                }
            }
        }

        stage('Update GitOps Manifests') {
            options {
                timeout(time: 3, unit: 'MINUTES')
            }

            steps {
                dir('temp-repo') {

                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/main']],
                        userRemoteConfigs: [[
                            url: GIT_REPO_URL,
                            credentialsId: 'GitHub-UnameWithPass'
                        ]],
                        extensions: [
                            [$class: 'LocalBranch', localBranch: 'main']
                        ]
                    ])

                    withCredentials([
                        usernamePassword(
                            credentialsId: 'GitHub-UnameWithPass',
                            usernameVariable: 'GIT_USER',
                            passwordVariable: 'GIT_PASS'
                        )
                    ]) {
                        bat """
                        set GIT_TERMINAL_PROMPT=0

                        git status
                        git branch

                        git config user.email "dhineshdine18@example.com"
                        git config user.name "DhineshDine"

                        powershell -Command "(Get-Content ${MANIFEST_FILE}) -replace 'image:.*', 'image: ${DOCKER_IMAGE_NAME}' | Set-Content ${MANIFEST_FILE}"

                        git diff --quiet && echo No change in manifest && exit 0

                        git add ${MANIFEST_FILE}
                        git commit -m "image update: version ${BUILD_NUMBER} [skip ci]"

                        git remote set-url origin https://%GIT_USER%:%GIT_PASS%@github.com/DhineshDine/multibranch-sample.git
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
