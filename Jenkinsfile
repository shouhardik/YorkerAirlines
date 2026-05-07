pipeline {
  agent any

  tools {
    nodejs 'node-20'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Test') {
      steps {
        sh 'npm test'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'frontend/dist/**', fingerprint: true, allowEmptyArchive: true
    }
    success {
      echo 'CI build and tests passed.'
    }
    failure {
      echo 'CI build failed. Check test/build logs.'
    }
  }
}
