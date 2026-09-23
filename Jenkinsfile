```groovy
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

                    /*
                     * Example:
                     *
                     * BUILD_NUMBER = 18
                     * COMMIT       = a81f92c
                     *
                     * IMAGE TAG:
                     *
                     * 18-a81f92c
                     */

                    env.IMAGE_TAG = "${BUILD_NUMBER}-${shortCommit}"

                    /*
                     * Used to make sure an older build cannot
                     * replace a newer deployment.
                     */

                    env.DEPLOY_EPOCH = "${System.currentTimeMillis()}"
                }

                sh '''
                    set -e

                    echo "=========================================="
                    echo "SOURCE CHECKOUT"
                    echo "=========================================="

                    echo "Branch:"
                    echo "$BRANCH_NAME_SAFE"

                    echo ""
                    echo "Commit:"
                    git log -1 --oneline

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

                    echo "Installing dependencies..."

                    npm ci

                    echo ""
                    echo "Building application..."

                    npm run build

                    echo ""
                    echo "Checking generated build files..."

                    if [ -d "build" ]; then

                        echo "Build directory found:"
                        du -sh build

                    elif [ -d "dist" ]; then

                        echo "Dist directory found:"
                        du -sh dist

                    else

                        echo "ERROR: build/ or dist/ directory not found."
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

                    echo "Image:"
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
        // CREATE REMOTE DEPLOYMENT SCRIPT
        //
        // This avoids nested Groovy/SSH/heredoc quoting.
        // =========================================================

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
BRANCH_NAME="$4"
DEPLOY_PATH="$5"
APP_PORT="$6"

LOCK_FILE="/tmp/namami-gange-ui-deploy.lock"
DEPLOYMENT_FILE="$DEPLOY_PATH/.deployment_epoch"

echo "=========================================="
echo "REMOTE DEPLOYMENT"
echo "=========================================="

echo "Branch:"
echo "$BRANCH_NAME"

echo "Image:"
echo "$IMAGE"

echo "Deployment ID:"
echo "$DEPLOY_EPOCH"

echo ""

mkdir -p "$DEPLOY_PATH"


(
    flock -x 200

    echo "Deployment lock acquired."

    # ---------------------------------------------------------
    # Check current deployment
    # ---------------------------------------------------------

    if [ -f "$DEPLOYMENT_FILE" ]; then

        PREVIOUS_EPOCH=$(cat "$DEPLOYMENT_FILE" 2>/dev/null || echo "0")

        echo "Previous deployment ID:"
        echo "$PREVIOUS_EPOCH"

        echo "Current deployment ID:"
        echo "$DEPLOY_EPOCH"

        if [ "$DEPLOY_EPOCH" -le "$PREVIOUS_EPOCH" ]; then

            echo ""
            echo "This deployment is older than the active deployment."
            echo "Deployment skipped."

            exit 0
        fi

    else

        echo "No previous deployment found."

    fi


    # ---------------------------------------------------------
    # Pull image
    # ---------------------------------------------------------

    echo ""
    echo "Pulling image..."

    docker pull "$IMAGE"


    # ---------------------------------------------------------
    # Stop existing container
    # ---------------------------------------------------------

    echo ""
    echo "Stopping existing container..."

    docker stop namami-gange-ui 2>/dev/null || true


    # ---------------------------------------------------------
    # Remove existing container
    # ---------------------------------------------------------

    echo ""
    echo "Removing existing container..."

    docker rm namami-gange-ui 2>/dev/null || true


    # ---------------------------------------------------------
    # Create docker-compose.yml
    # ---------------------------------------------------------

    echo ""
    echo "Creating docker-compose.yml..."

    cat > "$DEPLOY_PATH/docker-compose.yml" <<COMPOSE
services:
  namami-gange-ui:
    image: $IMAGE
    container_name: namami-gange-ui
    restart: unless-stopped
    ports:
      - "$APP_PORT:80"
    extra_hosts:
      - "host.docker.internal:host-gateway"
COMPOSE


    # ---------------------------------------------------------
    # Create deployment metadata
    # ---------------------------------------------------------

    echo ""
    echo "Creating deployment metadata..."

    cat > "$DEPLOY_PATH/.env" <<ENV
IMAGE_TAG=$IMAGE_TAG
DEPLOY_BRANCH=$BRANCH_NAME
DEPLOY_EPOCH=$DEPLOY_EPOCH
ENV


    echo "$DEPLOY_EPOCH" > "$DEPLOYMENT_FILE"


    # ---------------------------------------------------------
    # Start application
    # ---------------------------------------------------------

    echo ""
    echo "Starting application..."

    cd "$DEPLOY_PATH"

    docker compose up -d --force-recreate


    # ---------------------------------------------------------
    # Show status
    # ---------------------------------------------------------

    echo ""
    echo "Application status:"

    docker ps \
        --filter name=namami-gange-ui \
        --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'


    echo ""
    echo "Remote deployment completed successfully."

) 200>"$LOCK_FILE"
'''
                    )

                    sh 'chmod +x remote-deploy.sh'
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

                        REMOTE_SCRIPT="/tmp/namami-gange-ui-deploy.sh"

                        echo "Uploading deployment script..."

                        sshpass -p "$SSH_PASSWORD" scp \
                            -o StrictHostKeyChecking=no \
                            remote-deploy.sh \
                            "$SSH_USERNAME@$DEPLOY_SERVER:$REMOTE_SCRIPT"


                        echo ""
                        echo "Executing deployment script..."

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USERNAME@$DEPLOY_SERVER" \
                            "bash $REMOTE_SCRIPT \
                            '$DOCKER_ORG/$PROJECT_NAME:$IMAGE_TAG' \
                            '$IMAGE_TAG' \
                            '$DEPLOY_EPOCH' \
                            '$BRANCH_NAME_SAFE' \
                            '$DEPLOY_PATH' \
                            '$APP_PORT'"


                        echo ""
                        echo "Removing remote deployment script..."

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USERNAME@$DEPLOY_SERVER" \
                            "rm -f $REMOTE_SCRIPT"


                        echo ""
                        echo "Deployment command completed."
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

                        echo "Waiting for application..."

                        sleep 10


                        echo ""
                        echo "Container status:"

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USERNAME@$DEPLOY_SERVER" \
                            "docker ps \
                            --filter name=namami-gange-ui \
                            --format 'table {{.Names}}\\t{{.Image}}\\t{{.Status}}\\t{{.Ports}}'"


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
        //
        // Keep ONLY current image
        // =========================================================

        stage('Jenkins Docker Cleanup') {

            steps {

                sh '''
                    set +e

                    echo "=========================================="
                    echo "JENKINS DOCKER CLEANUP"
                    echo "=========================================="

                    REPO="${DOCKER_ORG}/${PROJECT_NAME}"
                    CURRENT="${IMAGE_TAG}"

                    echo "Repository:"
                    echo "$REPO"

                    echo ""
                    echo "Current tag:"
                    echo "$CURRENT"

                    echo ""
                    echo "Images before cleanup:"

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
        // CREATE REMOTE CLEANUP SCRIPT
        // =========================================================

        stage('Prepare Cleanup Script') {

            steps {

                script {

                    writeFile(
                        file: 'remote-cleanup.sh',
                        text: '''#!/bin/bash

set +e

REPO="$1"

KEEP_FILE="/tmp/namami-gange-ui-keep.txt"

echo "=========================================="
echo "APPLICATION SERVER DOCKER CLEANUP"
echo "=========================================="

echo "Repository:"
echo "$REPO"


echo ""
echo "Images before cleanup:"

docker images "$REPO"


# ---------------------------------------------------------
# Get latest 3 images by Docker creation date
# ---------------------------------------------------------

echo ""
echo "Selecting latest 3 images..."

docker images "$REPO" \
    --format '{{.ID}}|{{.CreatedAt}}|{{.Tag}}' |
    sort -t'|' -k2,2r |
    head -3 |
    cut -d'|' -f3 |
    sort -u > "$KEEP_FILE"


echo ""
echo "Keeping tags:"

cat "$KEEP_FILE"


# ---------------------------------------------------------
# Remove old images
# ---------------------------------------------------------

echo ""
echo "Cleaning old images..."

docker images "$REPO" \
    --format '{{.Repository}}:{{.Tag}}' |
while read IMAGE
do

    [ -z "$IMAGE" ] && continue

    TAG="${IMAGE##*:}"


    if grep -Fxq "$TAG" "$KEEP_FILE"; then

        echo "Keeping:"
        echo "$IMAGE"

        continue

    fi


    # Never remove an image used by a running container.

    if docker ps --format '{{.Image}}' | grep -Fxq "$IMAGE"; then

        echo "Skipping running image:"
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


rm -f "$KEEP_FILE"
'''
                    )

                    sh 'chmod +x remote-cleanup.sh'
                }
            }
        }


        // =========================================================
        // APPLICATION SERVER CLEANUP
        //
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

                        REMOTE_SCRIPT="/tmp/namami-gange-ui-cleanup.sh"


                        echo "Uploading cleanup script..."

                        sshpass -p "$SSH_PASSWORD" scp \
                            -o StrictHostKeyChecking=no \
                            remote-cleanup.sh \
                            "$SSH_USERNAME@$DEPLOY_SERVER:$REMOTE_SCRIPT"


                        echo ""
                        echo "Executing cleanup..."

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USERNAME@$DEPLOY_SERVER" \
                            "bash $REMOTE_SCRIPT '$DOCKER_ORG/$PROJECT_NAME'"


                        echo ""
                        echo "Removing remote cleanup script..."

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USERNAME@$DEPLOY_SERVER" \
                            "rm -f $REMOTE_SCRIPT"
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
            Branch  : ${BRANCH_NAME_SAFE}
            Build   : ${BUILD_NUMBER}
            Commit  : ${GIT_SHORT_COMMIT}

            Image:
            ${DOCKER_ORG}/${PROJECT_NAME}:${IMAGE_TAG}

            Server:
            ${DEPLOY_SERVER}

            Port:
            ${APP_PORT}

            Only the latest deployment is running.

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
```
