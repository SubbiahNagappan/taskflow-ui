pipeline {
  agent { label 'taskflow-ui-docker-agent' }

  environment {
    IMAGE_NAME = 'taskflow-ui'
    IMAGE_TAG = "${env.BUILD_NUMBER ?: 'local'}"
    REGISTRY = ''
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Build frontend') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Docker image build') {
      steps {
        script {
          def image = "${IMAGE_NAME}:${IMAGE_TAG}"
          sh "docker build -t ${image} ."

          if (REGISTRY?.trim()) {
            def remoteImage = "${REGISTRY}/${image}"
            sh "docker tag ${image} ${remoteImage}"
            sh "docker push ${remoteImage}"
          }
        }
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}
