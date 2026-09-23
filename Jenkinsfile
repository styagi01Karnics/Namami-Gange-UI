pipeline {

    agent any

    tools {
        nodejs 'node-22'
    }

    options {
        buildDiscarder(
            logRotator(
                numToKeepStr: '3'
            )
        )

        timestamps()

        disableConcurrentBuilds()
    }

    environment {

        // =========================================================
        // PROJECT
        // =========================================================

        PROJECT_NAME = "namami-gange-ui"
        DOCKER_ORG   = "sunardock"

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

                script {

                    def shortCommit = sh(
                        script: 'git rev-parse --short=7 HEAD',
                        returnStdout: true
                    ).trim()

                    def branchName = env.BRANCH_NAME ?: 'unknown'

                    env.GIT_SHORT_COMMIT = shortCommit

                    env.BRANCH_NAME_SAFE = branchName
                        .replaceAll('[^a-zA-Z0-9_.-]', '-')
                        .take(40)

                    env.IMAGE_TAG = "${BUILD_NUMBER}-${shortCommit}"

                    env.DEPLOY_EPOCH = "${System.currentTimeMillis()}"
                }

                sh '''
                    echo "=========================================="
                    echo "SOURCE CHECKOUT"
                    echo "=========================================="

                    echo "Branch:"
                    echo "$BRANCH_NAME_SAFE"

                    echo ""
                    echo "Commit:"
                    git log -1 --oneline || true

                    echo ""
                    echo "Commit SHA:"
                    echo "$GIT_SHORT_COMMIT"

                    echo ""
                    echo "Docker Image Tag:"
                    echo "$IMAGE_TAG"

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
        // BUILD FRONTEND
        // =========================================================

        stage('Build Frontend') {

            steps {

                sh '''
                    set -e

                    echo "=========================================="
                    echo "BUILD REACT FRONTEND"
                    echo "=========================================="

                    npm ci

                    npm run build

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
        // SONARQUBE
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

                    docker image inspect "$IMAGE" > /dev/null

                    echo ""
                    echo "Docker image created successfully."

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

                        echo "Branch:"
                        echo "$BRANCH_NAME_SAFE"

                        echo "Image:"
                        echo "$IMAGE"

                        echo "Deployment ID:"
                        echo "$DEPLOY_EPOCH"

                        echo ""
                        echo "Preparing application directory..."

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USERNAME@$DEPLOY_SERVER" \
                            "mkdir -p '$DEPLOY_PATH'"


                        echo ""
                        echo "Pulling image..."

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USERNAME@$DEPLOY_SERVER" \
                            "docker pull '$IMAGE'"


                        echo ""
                        echo "Starting deployment..."

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USERNAME@$DEPLOY_SERVER" \
                            "flock -x /tmp/namami-gange-ui-deploy.lock -c ' \
                                set -e; \
                                \
                                DEPLOY_FILE=\"${DEPLOY_PATH}/.deployment_epoch\"; \
                                \
                                if [ -f \"\\$DEPLOY_FILE\" ]; then \
                                    PREVIOUS_EPOCH=\\$(cat \"\\$DEPLOY_FILE\" 2>/dev/null || echo 0); \
                                    \
                                    echo \"Previous deployment ID: \\$PREVIOUS_EPOCH\"; \
                                    echo \"Current deployment ID: ${DEPLOY_EPOCH}\"; \
                                    \
                                    if [ \"${DEPLOY_EPOCH}\" -le \"\\$PREVIOUS_EPOCH\" ]; then \
                                        echo \"Older deployment detected. Skipping.\"; \
                                        exit 0; \
                                    fi; \
                                fi; \
                                \
                                echo \"Stopping existing container...\"; \
                                docker stop namami-gange-ui 2>/dev/null || true; \
                                \
                                echo \"Removing existing container...\"; \
                                docker rm namami-gange-ui 2>/dev/null || true; \
                                \
                                echo \"Writing docker-compose.yml...\"; \
                                cat > \"${DEPLOY_PATH}/docker-compose.yml\" <<COMPOSE
services:
  namami-gange-ui:
    image: ${IMAGE}
    container_name: namami-gange-ui
    restart: unless-stopped
    ports:
      - \"${APP_PORT}:80\"
    extra_hosts:
      - \"host.docker.internal:host-gateway\"
COMPOSE
                                \
                                echo \"Writing deployment metadata...\"; \
                                printf \"%s\\\\n\" \"${IMAGE_TAG}\" > \"${DEPLOY_PATH}/.env\"; \
                                printf \"%s\\\\n\" \"${DEPLOY_EPOCH}\" > \"\\$DEPLOY_FILE\"; \
                                \
                                cd \"${DEPLOY_PATH}\"; \
                                \
                                echo \"Starting new container...\"; \
                                docker compose up -d --force-recreate; \
                                \
                                echo \"Deployment completed.\" \
                            '"

                        echo ""
                        echo "Application status:"

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
        // JENKINS SERVER CLEANUP
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

                    echo "Current image:"
                    echo "$REPO:$CURRENT"

                    docker images "$REPO"

                    docker images "$REPO" \
                        --format '{{.Repository}}:{{.Tag}}' |
                    while read IMAGE
                    do

                        [ -z "$IMAGE" ] && continue

                        TAG="${IMAGE##*:}"

                        if [ "$TAG" = "$CURRENT" ]; then

                            echo "Keeping:"
                            echo "$IMAGE"

                        else

                            echo "Removing:"
                            echo "$IMAGE"

                            docker rmi "$IMAGE" || true

                        fi

                    done

                    echo ""
                    echo "Removing dangling images..."

                    docker image prune -f || true

                    echo ""
                    echo "Images after cleanup:"

                    docker images "$REPO"
                '''
            }
        }


        // =========================================================
        // APPLICATION SERVER CLEANUP
        // Keep current + previous 2
        // =========================================================

        stage('Application Server Docker Cleanup') {

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
                             KEEP_FILE='/tmp/namami-gange-ui-keep.txt'; \
                             \
                             echo 'Images before cleanup:'; \
                             docker images \"\\$REPO\"; \
                             \
                             echo ''; \
                             echo 'Selecting latest 3 images...'; \
                             \
                             docker images \"\\$REPO\" \
                               --format '{{.ID}}|{{.CreatedAt}}|{{.Tag}}' \
                               | sort -t'|' -k2,2r \
                               | head -3 \
                               | cut -d'|' -f3 \
                               | sort -u > \"\\$KEEP_FILE\"; \
                             \
                             echo ''; \
                             echo 'Keeping tags:'; \
                             cat \"\\$KEEP_FILE\"; \
                             \
                             echo ''; \
                             echo 'Cleaning old images...'; \
                             \
                             docker images \"\\$REPO\" \
                               --format '{{.Repository}}:{{.Tag}}' \
                               | while read IMAGE; do \
                                   [ -z \"\\$IMAGE\" ] && continue; \
                                   TAG=\"\\${IMAGE##*:}\"; \
                                   \
                                   if grep -Fxq \"\\$TAG\" \"\\$KEEP_FILE\"; then \
                                       echo \"Keeping: \\$IMAGE\"; \
                                   else \
                                       if docker ps --format '{{.Image}}' | grep -Fxq \"\\$IMAGE\"; then \
                                           echo \"Skipping running image: \\$IMAGE\"; \
                                       else \
                                           echo \"Removing: \\$IMAGE\"; \
                                           docker rmi \"\\$IMAGE\" || true; \
                                       fi; \
                                   fi; \
                               done; \
                             \
                             echo ''; \
                             echo 'Removing dangling images...'; \
                             docker image prune -f || true; \
                             \
                             echo ''; \
                             echo 'Images after cleanup:'; \
                             docker images \"\\$REPO\"; \
                             \
                             rm -f \"\\$KEEP_FILE\""
                }
            }
        }
    }


    // =========================================================
    // POST
    // =========================================================

    post {

        success {

            echo """
            ==========================================
            DEPLOYMENT SUCCESSFUL
            ==========================================

            Project : ${PROJECT_NAME}
            Branch  : ${BRANCH_NAME_SAFE}
            Build   : ${BUILD_NUMBER}
            Commit  : ${GIT_SHORT_COMMIT}

            Image:
            ${DOCKER_ORG}/${PROJECT_NAME}:${IMAGE_TAG}

            Server:
            ${DEPLOY_SERVER}

            Port:
            ${APP_PORT}

            Current branch deployment is active.

            Jenkins server:
            Current image retained.

            Application server:
            Current + previous 2 images retained.

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
            Branch  : ${BRANCH_NAME_SAFE}
            Build   : ${BUILD_NUMBER}
            Commit  : ${GIT_SHORT_COMMIT}

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
