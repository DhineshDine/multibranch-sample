pipeline {
  agent any 

  stages {
    stage('build') {
      steps{
        bat ' npm install '
      }
    }
    stage('Deploy to Docker'){

          steps{
withCredentials([string(credentialsId: 'DOCKER_PWD', variable: 'DOCKER')]) {

        bat "docker login -u dhineshdine -p ${DOCKER}"
        bat 'docker build -t dhineshdine/multibranch-sample:latest'
        bat 'docker push dhineshdine/multibranch-sample:latest'

        echo "Deployed to Docker Sucessfully"
        }
      }
    }
  }
}
