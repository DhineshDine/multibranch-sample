pipeline {
  agent any 
environment {
  DOCKER_IMAGE_NAME = "dhineshdine/multibranch-sample:latest"
  DOCKER_CONTAINER_NAME = "multibranch-cont"
  HOST_PORT = 9000
  CONTAINER_PORT = 80
}
  stages {
    stage('build') {
      steps{
        bat ' npm install '
      }
    }
    stage('Build an Docker Image'){

          steps{
withCredentials([string(credentialsId: 'DOCKER_PWD', variable: 'DOCKER')]) {

        bat "docker login -u dhineshdine -p ${DOCKER}"
        bat "docker build -t ${env.DOCKER_IMAGE_NAME} ."
        }
      }
    }

    stage('Deploy to Hub'){
      steps{
      echo "Deploying to Hub"
      bat "docker push dhineshdine ${env.DOCKER_IMAGE_NAME}"
      
    }
    }

    stage('Run the Container'){
      steps{
        echo "Starting a new Container From ${env.DOCKER_IMAGE_NAME}"
        bat "docker run -d -p ${env.HOST_PORT}:${env.CONTAINER_PORT} --name ${env.DOCKER_CONTAINER_NAME} ${env.DOCKER_IMAGE_NAME}"
        echo "Deployed container on ${env.HOST_PORT}"
      }
    }
  }
}
