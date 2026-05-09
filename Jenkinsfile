pipeline {
  agent any

  tools {
    nodejs 'node-20'
  }

  environment {
    IMAGE_NAME = 'shouhardik/yorker-airlines-backend'
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

    // stage('Docker Build & Push') {
    //   steps {
    //     script {
    //       def imageTag = "${env.BUILD_NUMBER}"
    //       withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_TOKEN')]) {
    //         sh """
    //           echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USER" --password-stdin
    //           docker build -t ${IMAGE_NAME}:${imageTag} -f backend/Dockerfile .
    //           docker tag ${IMAGE_NAME}:${imageTag} ${IMAGE_NAME}:latest
    //           docker push ${IMAGE_NAME}:${imageTag}
    //           docker push ${IMAGE_NAME}:latest
    //           docker logout
    //         """
    //       }
    //     }
    //   }
    // }
    stage('Docker Build & Push') {
    steps {
        script {
            withCredentials([
    usernamePassword(
        credentialsId: 'dockerhub-creds',
        usernameVariable: 'DOCKERHUB_USER',
        passwordVariable: 'DOCKERHUB_PASSWORD'
    )
]) {

    sh '''
    echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USER" --password-stdin

    docker build -t shouhardik/yorker-airlines-backend:${BUILD_NUMBER} -f backend/Dockerfile .

    docker tag shouhardik/yorker-airlines-backend:${BUILD_NUMBER} \
               shouhardik/yorker-airlines-backend:latest
    '''

    retry(3) {
        sh '''
        docker push shouhardik/yorker-airlines-backend:${BUILD_NUMBER}
        docker push shouhardik/yorker-airlines-backend:latest
        '''
    }
}
        }
    }
}

    stage('Deploy to Kubernetes') {
      steps {
        script {
          def imageTag = "${env.BUILD_NUMBER}"
          withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG_FILE')]) {
            sh """
              export KUBECONFIG="$KUBECONFIG_FILE"
              kubectl apply -f k8s/deployment.yaml
              kubectl apply -f k8s/service.yaml
              kubectl apply -f k8s/ingress.yaml
              kubectl set image deployment/yorker-airlines-backend backend=${IMAGE_NAME}:${imageTag}
              kubectl rollout status deployment/yorker-airlines-backend
            """
          }
        }
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
