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

        skipDefaultCheckout(false)
    }

    environment {

        // ==========================================================
        // APPLICATION SERVER
        // ==========================================================

        APP_SERVER = '45.195.229.15'
        DEPLOY_PATH = '/opt/namami-gange-ui'
        APP_PORT = '18085'

        // ==========================================================
        // PROJECT
        // ==========================================================

        PROJECT_NAME = 'namami-gange-ui'
        DOCKER_ORG = 'sunardock'

        // ==========================================================
        // CREDENTIALS
        // ==========================================================

        DOCKER_CREDENTIALS = 'dockerhub-creds'
        SSH_CREDENTIALS = 'new-server-ssh'

        // ==========================================================
        // SONAR
        // ==========================================================

        SONAR_HOME = tool 'SonarScanner'
    }

    stages {

        // ==========================================================
        // CHECKOUT
        // ==========================================================

        stage('Checkout') {

            steps {

                checkout scm

                script {

                    def shortCommit = sh(
                        script: 'git rev-parse --short=7 HEAD',
                        returnStdout: true
                    ).trim()

                    def branchName = env.BRANCH_NAME ?: 'unknown'

                    /*
                     * Convert branch name to Docker-safe value.
                     *
                     * Example:
                     *
                     * feat/ui-changes-typescript-18-sep
                     *
                     * becomes:
                     *
                     * feat-ui-changes-typescript-18-sep
                     */

                    def branchNameSafe = branchName
                        .replaceAll('[^a-zA-Z0-9_.-]', '-')
                        .replaceAll('-+', '-')
                        .replaceAll('^-+', '')
                        .replaceAll('-+$', '')
                        .take(100)

                    if (!branchNameSafe) {
                        branchNameSafe = 'unknown'
                    }

                    /*
                     * Docker image tag format:
                     *
                     * branch-build
                     *
                     * Example:
                     *
                     * feat-ui-changes-typescript-18-sep-4
                     */

                    def imageTag = "${branchNameSafe}-${env.BUILD_NUMBER}"

                    /*
                     * Deployment epoch.
                     *
                     * Used on application server to prevent an older
                     * build from overwriting a newer deployment.
                     */

                    def deployEpoch = "${System.currentTimeMillis()}"

                    env.SHORT_COMMIT = shortCommit
                    env.BRANCH_NAME_SAFE = branchNameSafe
                    env.IMAGE_TAG = imageTag
                    env.DEPLOY_EPOCH = deployEpoch

                    echo """
                    ==========================================
                    BUILD INFORMATION
                    ==========================================

                    Project : ${env.PROJECT_NAME}
                    Branch  : ${branchName}
                    Safe    : ${env.BRANCH_NAME_SAFE}
                    Build   : ${env.BUILD_NUMBER}
                    Commit  : ${env.SHORT_COMMIT}
                    Image   : ${env.DOCKER_ORG}/${env.PROJECT_NAME}:${env.IMAGE_TAG}

                    ==========================================
                    """
                }
            }
        }

        // ==========================================================
        // FRONTEND BUILD
        // ==========================================================

        stage('Build Frontend') {

            steps {

                sh '''
                    set -e

                    echo "Installing dependencies..."

                    npm ci

                    echo "Building frontend..."

                    npm run build

                    if [ -d "build" ]; then
                        echo "React build directory found."
                    elif [ -d "dist" ]; then
                        echo "Vite/dist directory found."
                    else
                        echo "ERROR: Neither build nor dist directory exists."
                        exit 1
                    fi
                '''
            }
        }

        // ==========================================================
        // SONARQUBE
        // ==========================================================

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        "${SONAR_HOME}/bin/sonar-scanner" \
                            -Dsonar.projectKey=namami-gange-ui \
                            -Dsonar.projectName=namami-gange-ui \
                            -Dsonar.sources=. \
                            -Dsonar.exclusions=node_modules/**,build/**,dist/**,coverage/** \
                            -Dsonar.sourceEncoding=UTF-8
                    '''
                }
            }
        }

        
        // ==========================================================
        // DOCKER LOGIN
        // ==========================================================

        stage('Docker Login') {

            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: "${DOCKER_CREDENTIALS}",
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {

                    sh '''
                        set -e

                        echo "Logging in to Docker Hub..."

                        echo "$DOCKER_PASSWORD" | docker login \
                            --username "$DOCKER_USER" \
                            --password-stdin

                        echo "Docker Hub login successful."

                        echo "Authenticated Docker user:"
                        docker info 2>/dev/null | grep -i '^ Username:' || true
                    '''
                }
            }
        }

        // ==========================================================
        // BUILD DOCKER IMAGE
        // ==========================================================

        stage('Build Docker Image') {

            steps {

                sh '''
                    set -e

                    IMAGE="${DOCKER_ORG}/${PROJECT_NAME}:${IMAGE_TAG}"

                    echo "Building Docker image:"
                    echo "$IMAGE"

                    docker build \
                        --pull \
                        -t "$IMAGE" \
                        .

                    echo "Docker image built successfully."

                    docker image inspect "$IMAGE" >/dev/null

                    echo "Image verified:"
                    docker images "$DOCKER_ORG/$PROJECT_NAME" --format \
                        'table {{.Repository}}\\t{{.Tag}}\\t{{.ID}}\\t{{.Size}}'
                '''
            }
        }

        // ==========================================================
        // PUSH DOCKER IMAGE
        // ==========================================================

        
        stage('Push Docker Image') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: "${DOCKER_CREDENTIALS}",
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        set -e
        
                        IMAGE="${DOCKER_ORG}/${PROJECT_NAME}:${IMAGE_TAG}"
        
                        echo "=========================================="
                        echo "DOCKER PUSH"
                        echo "=========================================="
                        echo "Docker user : ${DOCKER_USERNAME}"
                        echo "Repository  : ${DOCKER_ORG}/${PROJECT_NAME}"
                        echo "Image       : ${IMAGE}"
                        echo "=========================================="
        
                        echo "${DOCKER_PASSWORD}" | docker login \
                            --username "${DOCKER_USERNAME}" \
                            --password-stdin
        
                        docker push "${IMAGE}"
        
                        echo "Docker image pushed successfully."
        
                        docker image inspect "${IMAGE}" >/dev/null
        
                        echo "Push verification successful."
                        echo "=========================================="
                    '''
                }
            }
        }

        
        // ==========================================================
        // PREPARE REMOTE DEPLOYMENT SCRIPT
        // ==========================================================

        stage('Prepare Deployment Script') {

            steps {

                script {

                    writeFile(
                        file: 'remote-deploy.sh',
                        text: '''#!/bin/bash

set -e

IMAGE="$1"
IMAGE_TAG="$2"
DEPLOY_EPOCH="$3"
DEPLOY_BRANCH="$4"
DEPLOY_COMMIT="$5"
DEPLOY_BUILD="$6"
DEPLOY_PATH="$7"
APP_PORT="$8"

CONTAINER_NAME="namami-gange-ui"

LOCK_FILE="${DEPLOY_PATH}/.deployment.lock"
EPOCH_FILE="${DEPLOY_PATH}/.deployment_epoch"

mkdir -p "$DEPLOY_PATH"

echo "=========================================="
echo "REMOTE DEPLOYMENT"
echo "=========================================="
echo "Image       : $IMAGE"
echo "Image Tag   : $IMAGE_TAG"
echo "Branch      : $DEPLOY_BRANCH"
echo "Commit      : $DEPLOY_COMMIT"
echo "Build       : $DEPLOY_BUILD"
echo "Port        : $APP_PORT"
echo "Deploy Epoch: $DEPLOY_EPOCH"
echo "=========================================="

exec 200>"$LOCK_FILE"

echo "Waiting for deployment lock..."

flock -x 200

echo "Deployment lock acquired."

CURRENT_EPOCH=0

if [ -f "$EPOCH_FILE" ]; then
    CURRENT_EPOCH=$(cat "$EPOCH_FILE" 2>/dev/null || echo 0)
fi

echo "Current deployed epoch: $CURRENT_EPOCH"
echo "Incoming deployment epoch: $DEPLOY_EPOCH"

if [ "$DEPLOY_EPOCH" -lt "$CURRENT_EPOCH" ]; then

    echo "=========================================="
    echo "OLDER BUILD DETECTED"
    echo "=========================================="
    echo "Current deployment is newer."
    echo "Skipping this deployment."
    echo "=========================================="

    exit 0
fi

echo "Pulling Docker image..."

docker pull "$IMAGE"

echo "Stopping current container if running..."

docker stop "$CONTAINER_NAME" 2>/dev/null || true

echo "Removing current container..."

docker rm -f "$CONTAINER_NAME" 2>/dev/null || true

cat > "${DEPLOY_PATH}/docker-compose.yml" <<EOF
services:

  namami-gange-ui:

    image: ${IMAGE}

    container_name: ${CONTAINER_NAME}

    restart: unless-stopped

    ports:
      - "${APP_PORT}:80"

    labels:
      com.karnics.project: "namami-gange-ui"
      com.karnics.branch: "${DEPLOY_BRANCH}"
      com.karnics.commit: "${DEPLOY_COMMIT}"
      com.karnics.build: "${DEPLOY_BUILD}"
      com.karnics.image-tag: "${IMAGE_TAG}"
      com.karnics.deploy-epoch: "${DEPLOY_EPOCH}"
EOF

cat > "${DEPLOY_PATH}/.env" <<EOF
IMAGE=${IMAGE}
IMAGE_TAG=${IMAGE_TAG}
DEPLOY_BRANCH=${DEPLOY_BRANCH}
DEPLOY_COMMIT=${DEPLOY_COMMIT}
DEPLOY_BUILD=${DEPLOY_BUILD}
DEPLOY_EPOCH=${DEPLOY_EPOCH}
EOF

echo "Starting new container..."

cd "$DEPLOY_PATH"

docker compose up -d --force-recreate

echo "Waiting for container..."

sleep 5

if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then

    echo "ERROR: Container failed to start."

    docker ps -a --filter "name=$CONTAINER_NAME"

    docker logs "$CONTAINER_NAME" --tail 100 2>/dev/null || true

    exit 1
fi

echo "$DEPLOY_EPOCH" > "$EPOCH_FILE"

echo "=========================================="
echo "DEPLOYMENT SUCCESSFUL"
echo "=========================================="

docker ps \
    --filter "name=$CONTAINER_NAME" \
    --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'

echo ""
echo "Branch:"
docker inspect "$CONTAINER_NAME" \
    --format '{{index .Config.Labels "com.karnics.branch"}}'

echo ""
echo "Commit:"
docker inspect "$CONTAINER_NAME" \
    --format '{{index .Config.Labels "com.karnics.commit"}}'

echo ""
echo "Build:"
docker inspect "$CONTAINER_NAME" \
    --format '{{index .Config.Labels "com.karnics.build"}}'

echo "=========================================="
'''
                    )

                    sh 'chmod +x remote-deploy.sh'
                }
            }
        }

        // ==========================================================
        // DEPLOY APPLICATION
        // ==========================================================

        stage('Deploy Application') {

            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: "${SSH_CREDENTIALS}",
                        usernameVariable: 'SSH_USER',
                        passwordVariable: 'SSH_PASSWORD'
                    )
                ]) {

                    sh '''
                        set -e

                        echo "Copying deployment script..."

                        sshpass -p "$SSH_PASSWORD" scp \
                            -o StrictHostKeyChecking=no \
                            remote-deploy.sh \
                            "$SSH_USER@$APP_SERVER:/tmp/namami-gange-ui-deploy.sh"

                        echo "Executing deployment..."

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$APP_SERVER" \
                            "bash /tmp/namami-gange-ui-deploy.sh \
                            '$DOCKER_ORG/$PROJECT_NAME:$IMAGE_TAG' \
                            '$IMAGE_TAG' \
                            '$DEPLOY_EPOCH' \
                            '$BRANCH_NAME_SAFE' \
                            '$SHORT_COMMIT' \
                            '$BUILD_NUMBER' \
                            '$DEPLOY_PATH' \
                            '$APP_PORT'"

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$APP_SERVER" \
                            "rm -f /tmp/namami-gange-ui-deploy.sh"
                    '''
                }
            }
        }

        // ==========================================================
        // HEALTH CHECK
        // ==========================================================

        stage('Health Check') {

            steps {

                sh '''
                    set -e

                    echo "Waiting for application..."

                    sleep 10

                    echo "Checking container..."

                    docker ps \
                        --filter "name=namami-gange-ui"

                    echo "Checking application..."

                    curl \
                        --fail \
                        --max-time 15 \
                        "http://${APP_SERVER}:${APP_PORT}/"

                    echo ""
                    echo "=========================================="
                    echo "APPLICATION HEALTH CHECK PASSED"
                    echo "=========================================="
                '''
            }
        }

        // ==========================================================
        // JENKINS DOCKER CLEANUP
        // KEEP ONLY CURRENT IMAGE
        // ==========================================================

        stage('Jenkins Docker Cleanup') {

            steps {

                sh '''
                    set +e

                    CURRENT_IMAGE="${DOCKER_ORG}/${PROJECT_NAME}:${IMAGE_TAG}"

                    echo "Current image:"
                    echo "$CURRENT_IMAGE"

                    echo ""
                    echo "Images before cleanup:"

                    docker images "$DOCKER_ORG/$PROJECT_NAME" \
                        --format 'table {{.Repository}}\\t{{.Tag}}\\t{{.CreatedAt}}'

                    echo ""
                    echo "Removing old images..."

                    docker images "$DOCKER_ORG/$PROJECT_NAME" \
                        --format '{{.Repository}}:{{.Tag}}' |
                    while read IMAGE
                    do

                        if [ "$IMAGE" = "$CURRENT_IMAGE" ]; then
                            echo "KEEP: $IMAGE"
                        else
                            echo "REMOVE: $IMAGE"
                            docker rmi -f "$IMAGE" 2>/dev/null || true
                        fi

                    done

                    docker image prune -f

                    echo ""
                    echo "Images after cleanup:"

                    docker images "$DOCKER_ORG/$PROJECT_NAME" \
                        --format 'table {{.Repository}}\\t{{.Tag}}\\t{{.CreatedAt}}'
                '''
            }
        }

        // ==========================================================
        // PREPARE APP SERVER CLEANUP SCRIPT
        // KEEP LATEST 3 IMAGES
        // ==========================================================

        stage('Prepare Cleanup Script') {

            steps {

                script {

                    writeFile(
                        file: 'remote-cleanup.sh',
                        text: '''#!/bin/bash

set +e

REPOSITORY="$1"

echo "=========================================="
echo "APPLICATION SERVER IMAGE CLEANUP"
echo "=========================================="

echo "Repository:"
echo "$REPOSITORY"

echo ""
echo "Current running image:"

RUNNING_IMAGE=$(docker inspect namami-gange-ui \
    --format '{{.Config.Image}}' 2>/dev/null)

echo "$RUNNING_IMAGE"

echo ""
echo "Available repository images:"

docker images "$REPOSITORY" \
    --format '{{.Repository}}:{{.Tag}}|{{.CreatedAt}}' |
sort -t'|' -k2,2r

echo ""
echo "Keeping latest 3 images..."

KEEP_IMAGES=$(docker images "$REPOSITORY" \
    --format '{{.Repository}}:{{.Tag}}|{{.CreatedAt}}' |
sort -t'|' -k2,2r |
head -n 3 |
cut -d'|' -f1)

echo ""
echo "Images to keep:"

echo "$KEEP_IMAGES"

echo ""
echo "Checking old images..."

docker images "$REPOSITORY" \
    --format '{{.Repository}}:{{.Tag}}' |
while read IMAGE
do

    if echo "$KEEP_IMAGES" | grep -Fxq "$IMAGE"; then

        echo "KEEP: $IMAGE"

    elif [ "$IMAGE" = "$RUNNING_IMAGE" ]; then

        echo "KEEP RUNNING IMAGE: $IMAGE"

    else

        echo "REMOVE: $IMAGE"

        docker rmi "$IMAGE" 2>/dev/null || true

    fi

done

echo ""
echo "Removing dangling images..."

docker image prune -f

echo ""
echo "=========================================="
echo "CLEANUP COMPLETE"
echo "=========================================="

docker images "$REPOSITORY" \
    --format 'table {{.Repository}}\\t{{.Tag}}\\t{{.CreatedAt}}'
'''
                    )

                    sh 'chmod +x remote-cleanup.sh'
                }
            }
        }

        // ==========================================================
        // APPLICATION SERVER DOCKER CLEANUP
        // ==========================================================

        stage('Application Server Docker Cleanup') {

            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: "${SSH_CREDENTIALS}",
                        usernameVariable: 'SSH_USER',
                        passwordVariable: 'SSH_PASSWORD'
                    )
                ]) {

                    sh '''
                        set -e

                        echo "Copying cleanup script..."

                        sshpass -p "$SSH_PASSWORD" scp \
                            -o StrictHostKeyChecking=no \
                            remote-cleanup.sh \
                            "$SSH_USER@$APP_SERVER:/tmp/namami-gange-ui-cleanup.sh"

                        echo "Executing cleanup..."

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$APP_SERVER" \
                            "bash /tmp/namami-gange-ui-cleanup.sh \
                            '$DOCKER_ORG/$PROJECT_NAME'"

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$APP_SERVER" \
                            "rm -f /tmp/namami-gange-ui-cleanup.sh"
                    '''
                }
            }
        }
    }

    // ==============================================================
    // POST ACTIONS
    // ==============================================================

    post {

        always {

            sh '''
                docker logout || true
            '''

            cleanWs()
        }

        success {

            echo """
            ==========================================
            DEPLOYMENT SUCCESSFUL
            ==========================================

            Project : ${PROJECT_NAME}
            Branch  : ${BRANCH_NAME}
            Build   : ${BUILD_NUMBER}
            Commit  : ${SHORT_COMMIT}
            Image   : ${DOCKER_ORG}/${PROJECT_NAME}:${IMAGE_TAG}

            Application:
            http://${APP_SERVER}:${APP_PORT}

            ==========================================
            """
        }

        failure {

            echo """
            ==========================================
            DEPLOYMENT FAILED
            ==========================================

            Project : ${PROJECT_NAME}
            Branch  : ${BRANCH_NAME}
            Build   : ${BUILD_NUMBER}
            Commit  : ${SHORT_COMMIT}
            Image   : ${DOCKER_ORG}/${PROJECT_NAME}:${IMAGE_TAG}

            Please check the Jenkins console log.

            ==========================================
            """
        }
    }
}
