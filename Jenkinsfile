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
withCredentials([string(credentialsId: 'Docker_pwd', variable: 'DINE_DOC')]) {

        bat 'docker login -u dhineshdine -p ${DINE_DOC}'
        bat 'docker build -t dhineshdine/multibranch-sample:latest'
        bat 'docker push dhineshdine/multibranch-sample:latest'

        echo "Deployed to Docker Sucessfully"
        }
      }
    }
  }
}
