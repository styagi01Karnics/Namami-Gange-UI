pipeline {

    agent any

    tools {
        nodejs 'node-18'
    }

    environment {

        // =========================================================
        // PROJECT
        // =========================================================
        PROJECT_NAME = "namami-gange-ui"
        DOCKER_ORG   = "sunardock"
        IMAGE_TAG    = "${BUILD_NUMBER}"

        // =========================================================
        // APPLICATION SERVER
        // =========================================================
        DEPLOY_SERVER = "45.195.229.15"
        DEPLOY_PATH   = "/opt/namami-gange-ui"
        APP_PORT      = "18085"

        // =========================================================
        // JENKINS TOOLS
        // =========================================================
        SONAR_HOME = tool 'SonarScanner'

        // =========================================================
        // CREDENTIALS
        // Same style as Funride
        // =========================================================
        DOCKERHUB_CREDENTIAL_ID = "dockerhub-creds"
        SSH_CREDENTIAL_ID       = "new-server-ssh"
    }


    stages {

        // =========================================================
        // CHECKOUT SOURCE
        // =========================================================
        stage('Checkout Source') {
            steps {
                checkout scm

                sh '''
                    echo "=========================================="
                    echo "SOURCE CHECKOUT"
                    echo "=========================================="

                    git branch --show-current || true
                    git log -1 --oneline || true

                    echo ""
                    echo "Node Version:"
                    node --version

                    echo ""
                    echo "NPM Version:"
                    npm --version
                '''
            }
        }


        // =========================================================
        // BUILD REACT FRONTEND
        // =========================================================
        stage('Build Frontend') {
            steps {
                sh '''
                    set -e

                    echo "=========================================="
                    echo "BUILD REACT FRONTEND"
                    echo "=========================================="

                    echo "Installing dependencies..."
                    npm ci

                    echo ""
                    echo "Building React application..."
                    npm run build

                    echo ""
                    echo "React build completed successfully."

                    echo ""
                    echo "Checking generated build files..."

                    if [ -d "build" ]; then
                        echo "React build directory found: build/"
                        du -sh build
                    elif [ -d "dist" ]; then
                        echo "Vite build directory found: dist/"
                        du -sh dist
                    else
                        echo "ERROR: Neither build/ nor dist/ directory exists."
                        exit 1
                    fi
                '''
            }
        }


        // =========================================================
        // SONARQUBE ANALYSIS
        // =========================================================
        stage('SonarQube Analysis') {
            steps {

                withSonarQubeEnv('SonarQube') {

                    sh '''
                        set -e

                        echo "=========================================="
                        echo "SONARQUBE ANALYSIS"
                        echo "=========================================="

                        ${SONAR_HOME}/bin/sonar-scanner \
                          -Dsonar.projectKey=namami-gange-ui \
                          -Dsonar.projectName=namami-gange-ui \
                          -Dsonar.sources=. \
                          -Dsonar.exclusions=node_modules/**,build/**,dist/**,coverage/** \
                          -Dsonar.sourceEncoding=UTF-8

                        echo ""
                        echo "SonarQube analysis completed."
                    '''
                }
            }
        }


        // =========================================================
        // DOCKER LOGIN
        // =========================================================
        stage('Docker Login') {
            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: "${DOCKERHUB_CREDENTIAL_ID}",
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {

                    sh '''
                        set -e

                        echo "=========================================="
                        echo "DOCKER HUB LOGIN"
                        echo "=========================================="

                        echo "$DOCKER_PASSWORD" | docker login \
                            -u "$DOCKER_USERNAME" \
                            --password-stdin

                        echo "Docker Hub login successful."
                    '''
                }
            }
        }


        // =========================================================
        // BUILD DOCKER IMAGE
        // =========================================================
        stage('Build Docker Image') {
            steps {
                sh '''
                    set -e

                    echo "=========================================="
                    echo "BUILD DOCKER IMAGE"
                    echo "=========================================="

                    IMAGE="${DOCKER_ORG}/${PROJECT_NAME}:${IMAGE_TAG}"

                    echo "Building:"
                    echo "$IMAGE"

                    docker build \
                        -t "$IMAGE" \
                        .

                    echo ""
                    echo "Docker image created successfully."

                    docker image inspect "$IMAGE" > /dev/null

                    docker images "$DOCKER_ORG/$PROJECT_NAME"
                '''
            }
        }


        // =========================================================
        // PUSH DOCKER IMAGE
        // =========================================================
        stage('Push Docker Image') {
            steps {
                sh '''
                    set -e

                    echo "=========================================="
                    echo "PUSH IMAGE TO DOCKER HUB"
                    echo "=========================================="

                    IMAGE="${DOCKER_ORG}/${PROJECT_NAME}:${IMAGE_TAG}"

                    docker push "$IMAGE"

                    echo ""
                    echo "Image pushed successfully:"
                    echo "$IMAGE"
                '''
            }
        }


        // =========================================================
        // PREPARE DEPLOYMENT FILES
        // =========================================================
        stage('Prepare Deployment Files') {
            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: "${SSH_CREDENTIAL_ID}",
                        usernameVariable: 'SSH_USERNAME',
                        passwordVariable: 'SSH_PASSWORD'
                    )
                ]) {

                    sh '''
                        set -e

                        echo "=========================================="
                        echo "PREPARE DEPLOYMENT FILES"
                        echo "=========================================="

                        echo "Creating deployment directory..."

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USERNAME@$DEPLOY_SERVER" \
                            "mkdir -p $DEPLOY_PATH"

                        echo "Creating docker-compose.yml..."

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USERNAME@$DEPLOY_SERVER" \
                            "cat > $DEPLOY_PATH/docker-compose.yml <<EOF
services:
  namami-gange-ui:
    image: ${DOCKER_ORG}/${PROJECT_NAME}:\${IMAGE_TAG}
    container_name: namami-gange-ui
    restart: unless-stopped

    ports:
      - \"${APP_PORT}:80\"

    extra_hosts:
      - \"host.docker.internal:host-gateway\"
EOF"

                        echo "Creating .env..."

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USERNAME@$DEPLOY_SERVER" \
                            "echo 'IMAGE_TAG=${IMAGE_TAG}' > $DEPLOY_PATH/.env"

                        echo ""
                        echo "Deployment files prepared."

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USERNAME@$DEPLOY_SERVER" \
                            "cat $DEPLOY_PATH/docker-compose.yml && echo '--- .env ---' && cat $DEPLOY_PATH/.env"
                    '''
                }
            }
        }


        // =========================================================
        // DEPLOY APPLICATION
        // =========================================================
        stage('Deploy Application') {
            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: "${SSH_CREDENTIAL_ID}",
                        usernameVariable: 'SSH_USERNAME',
                        passwordVariable: 'SSH_PASSWORD'
                    )
                ]) {

                    sh '''
                        set -e

                        echo "=========================================="
                        echo "DEPLOY APPLICATION"
                        echo "=========================================="

                        IMAGE="${DOCKER_ORG}/${PROJECT_NAME}:${IMAGE_TAG}"

                        echo "Pulling image:"
                        echo "$IMAGE"

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USERNAME@$DEPLOY_SERVER" \
                            "docker pull $IMAGE"

                        echo ""
                        echo "Starting application..."

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USERNAME@$DEPLOY_SERVER" \
                            "cd $DEPLOY_PATH && \
                             echo 'IMAGE_TAG=${IMAGE_TAG}' > .env && \
                             docker compose up -d --force-recreate"

                        echo ""
                        echo "Application status:"

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USERNAME@$DEPLOY_SERVER" \
                            "cd $DEPLOY_PATH && docker compose ps"

                        echo ""
                        echo "Docker container status:"

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USERNAME@$DEPLOY_SERVER" \
                            "docker ps --filter name=namami-gange-ui"
                    '''
                }
            }
        }


        // =========================================================
        // HEALTH CHECK
        // =========================================================
        stage('Health Check') {
            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: "${SSH_CREDENTIAL_ID}",
                        usernameVariable: 'SSH_USERNAME',
                        passwordVariable: 'SSH_PASSWORD'
                    )
                ]) {

                    sh '''
                        set -e

                        echo "=========================================="
                        echo "HEALTH CHECK"
                        echo "=========================================="

                        echo "Waiting for application to start..."
                        sleep 10

                        echo ""
                        echo "Checking container..."

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USERNAME@$DEPLOY_SERVER" \
                            "docker ps --filter name=namami-gange-ui"

                        echo ""
                        echo "Checking HTTP endpoint..."

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USERNAME@$DEPLOY_SERVER" \
                            "curl -f --max-time 15 http://127.0.0.1:${APP_PORT}/"

                        echo ""
                        echo "=========================================="
                        echo "HEALTH CHECK PASSED"
                        echo "=========================================="
                    '''
                }
            }
        }


        // =========================================================
        // JENKINS DOCKER CLEANUP
        // Keep current image only
        // =========================================================
        stage('Jenkins Docker Cleanup') {
            steps {
                sh '''
                    set +e

                    echo "=========================================="
                    echo "JENKINS DOCKER CLEANUP"
                    echo "=========================================="

                    CURRENT="${IMAGE_TAG}"
                    REPO="${DOCKER_ORG}/${PROJECT_NAME}"

                    echo "Current build: $CURRENT"

                    docker images "$REPO" \
                        --format '{{.Repository}}:{{.Tag}}' |
                    while read IMAGE
                    do
                        TAG="${IMAGE##*:}"

                        if [ "$TAG" = "$CURRENT" ]; then
                            echo "Keeping: $IMAGE"
                            continue
                        fi

                        if echo "$TAG" | grep -Eq '^[0-9]+$'; then
                            echo "Removing old Jenkins image: $IMAGE"
                            docker rmi "$IMAGE" || true
                        fi
                    done

                    echo ""
                    echo "Removing dangling images..."
                    docker image prune -f || true

                    echo ""
                    echo "Remaining images:"
                    docker images "$REPO"
                '''
            }
        }


        // =========================================================
        // APPLICATION SERVER DOCKER CLEANUP
        // Keep latest 3 numeric image versions
        // =========================================================
        stage('New Server Docker Cleanup') {
            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: "${SSH_CREDENTIAL_ID}",
                        usernameVariable: 'SSH_USERNAME',
                        passwordVariable: 'SSH_PASSWORD'
                    )
                ]) {

                    sh '''
                        set +e

                        echo "=========================================="
                        echo "APPLICATION SERVER DOCKER CLEANUP"
                        echo "=========================================="

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USERNAME@$DEPLOY_SERVER" \
                            "REPO='${DOCKER_ORG}/${PROJECT_NAME}'; \
                             CURRENT='${IMAGE_TAG}'; \
                             echo 'Current image:'; \
                             echo \\\"\\$REPO:\\$CURRENT\\\"; \
                             echo ''; \
                             echo 'Images before cleanup:'; \
                             docker images \\\"\\$REPO\\\"; \
                             echo ''; \
                             echo 'Keeping latest 3 numeric versions...'; \
                             docker images \\\"\\$REPO\\\" --format '{{.Tag}}' | \
                             grep -E '^[0-9]+$' | \
                             sort -rn | \
                             head -3 | \
                             sort -rn > /tmp/namami_keep.txt; \
                             cat /tmp/namami_keep.txt; \
                             echo ''; \
                             docker images \\\"\\$REPO\\\" --format '{{.Repository}}:{{.Tag}}' | \
                             while read IMAGE; do \
                                 TAG=\\\"\\${IMAGE##*:}\\\"; \
                                 if echo \\\"\\$TAG\\\" | grep -Eq '^[0-9]+$'; then \
                                     if grep -qx \\\"\\$TAG\\\" /tmp/namami_keep.txt; then \
                                         echo \\\"Keeping: \\$IMAGE\\\"; \
                                     else \
                                         if docker ps --format '{{.Image}}' | grep -qx \\\"\\$IMAGE\\\"; then \
                                             echo \\\"Skipping running image: \\$IMAGE\\\"; \
                                         else \
                                             echo \\\"Removing old image: \\$IMAGE\\\"; \
                                             docker rmi \\\"\\$IMAGE\\\" || true; \
                                         fi; \
                                     fi; \
                                 fi; \
                             done; \
                             echo ''; \
                             echo 'Removing dangling images...'; \
                             docker image prune -f || true; \
                             echo ''; \
                             echo 'Images after cleanup:'; \
                             docker images \\\"\\$REPO\\\""
                    '''
                }
            }
        }
    }


    // =============================================================
    // POST ACTIONS
    // =============================================================
    post {

        success {
            echo """
            ==========================================
            DEPLOYMENT SUCCESSFUL
            ==========================================

            Project : ${PROJECT_NAME}
            Build   : ${BUILD_NUMBER}
            Image   : ${DOCKER_ORG}/${PROJECT_NAME}:${IMAGE_TAG}
            Server  : ${DEPLOY_SERVER}
            Port    : ${APP_PORT}

            Docker Hub image pushed successfully.
            Application deployed successfully.
            Health check passed.

            ==========================================
            """
        }

        failure {
            echo """
            ==========================================
            DEPLOYMENT FAILED
            ==========================================

            Project : ${PROJECT_NAME}
            Build   : ${BUILD_NUMBER}

            Please check the Jenkins console log.

            ==========================================
            """
        }

        always {
            sh '''
                docker logout || true
            '''

            cleanWs(
                deleteDirs: true,
                disableDeferredWipeout: true
            )
        }
    }
}
