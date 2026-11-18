
pipeline {

    agent any

    tools {
        nodejs 'node-22'
    }

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '3'))
        skipDefaultCheckout(false)
        disableConcurrentBuilds()
    }

    environment {
        APP_SERVER = '45.195.229.15'

        PROJECT_NAME = 'namami-gange-ui'
        DOCKER_ORG = 'sunardock'

        DOCKER_CREDENTIALS = 'dockerhub-creds'
        SSH_CREDENTIALS = 'new-server-ssh'

        SONAR_HOME = tool 'SonarScanner'
    }

    stages {

        // ==========================================================
        // 1. CHECKOUT AND BRANCH CONFIGURATION
        // ==========================================================

        stage('Checkout') {
            steps {
                checkout scm

                script {

                    def rawBranchName = env.BRANCH_NAME ?: 'unknown'

                    def branchName = rawBranchName
                        .trim()
                        .replaceFirst('(?i)^refs/heads/', '')
                        .replaceFirst('(?i)^origin/', '')
                        .toLowerCase()

                    echo "Raw branch name        : '${rawBranchName}'"
                    echo "Normalized branch name : '${branchName}'"

                    // Get current Git commit.
                    def shortCommit = sh(
                        script: 'git rev-parse --short=7 HEAD',
                        returnStdout: true
                    ).trim()

                    if (!shortCommit) {
                        error('Unable to determine Git commit ID.')
                    }

                    // Generate Docker-safe branch name.
                    def branchNameSafe = branchName
                        .replaceAll('[^a-zA-Z0-9_.-]', '-')
                        .replaceAll('-+', '-')
                        .replaceAll('^-+', '')
                        .replaceAll('-+$', '')
                        .take(100)

                    if (!branchNameSafe) {
                        branchNameSafe = 'unknown'
                    }

                    // Initialize dynamic environment variables.
                    env.SHORT_COMMIT = shortCommit
                    env.BRANCH_NAME_SAFE = branchNameSafe

                    env.SHOULD_DEPLOY = 'false'
                    env.DEPLOY_PATH = ''
                    env.APP_PORT = ''
                    env.CONTAINER_NAME = ''
                    env.IMAGE_TAG = ''
                    env.DEPLOY_EPOCH = ''

                    // DEV deployment configuration.
                    if (branchName == 'dev') {

                        env.SHOULD_DEPLOY = 'true'
                        env.DEPLOY_PATH = '/opt/namami-gange-ui-dev'
                        env.APP_PORT = '18086'
                        env.CONTAINER_NAME = 'namami-gange-ui-dev'

                    }

                    // UAT deployment configuration.
                    else if (branchName == 'uat') {

                        env.SHOULD_DEPLOY = 'true'
                        env.DEPLOY_PATH = '/opt/namami-gange-ui'
                        env.APP_PORT = '18085'
                        env.CONTAINER_NAME = 'namami-gange-ui'

                    }

                    // Other branches: build and SonarQube only.
                    else {

                        echo """
==========================================
NON-DEPLOYMENT BRANCH
==========================================

Branch: ${branchName}

Frontend build and SonarQube analysis
will run.

Docker publishing and deployment
will be skipped.

==========================================
"""
                    }

                    // Generate deployment image tag and epoch.
                    if (env.SHOULD_DEPLOY == 'true') {

                        env.IMAGE_TAG = "${branchNameSafe}-${env.BUILD_NUMBER}"
                        env.DEPLOY_EPOCH = "${System.currentTimeMillis()}"

                        if (!env.DEPLOY_PATH ||
                            !env.APP_PORT ||
                            !env.CONTAINER_NAME ||
                            !env.IMAGE_TAG) {

                            error("Incomplete deployment configuration for ${branchName}")
                        }
                    }

                    echo """
==========================================
BUILD INFORMATION
==========================================

Project          : ${env.PROJECT_NAME}
Raw Branch       : ${rawBranchName}
Normalized Branch: ${branchName}
Commit           : ${env.SHORT_COMMIT}
Build            : ${env.BUILD_NUMBER}
Deployment       : ${env.SHOULD_DEPLOY}
Deploy Path      : ${env.DEPLOY_PATH}
Container        : ${env.CONTAINER_NAME}
Port             : ${env.APP_PORT}
Image Tag        : ${env.IMAGE_TAG}

==========================================
"""

                    // Fail early if DEV or UAT deployment is not enabled.
                    if ((branchName == 'dev' || branchName == 'uat') &&
                        env.SHOULD_DEPLOY != 'true') {

                        error("Deployment was not enabled for branch: ${branchName}")
                    }
                }
            }
        }

        // ==========================================================
        // 2. FRONTEND BUILD
        // ==========================================================

        stage('Build Frontend') {
            steps {
                sh '''
                    set -eu

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

                    echo "Frontend build successful."
                '''
            }
        }

        // ==========================================================
        // 3. SONARQUBE ANALYSIS
        // ==========================================================

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        set -eu

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
        // 4. DOCKER LOGIN
        // Only DEV and UAT
        // ==========================================================

        stage('Docker Login') {

            when {
                expression {
                    env.SHOULD_DEPLOY == 'true'
                }
            }

            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: "${DOCKER_CREDENTIALS}",
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        set -eu
                        set +x

                        printf '%s' "$DOCKER_PASSWORD" | docker login \
                            --username "$DOCKER_USER" \
                            --password-stdin

                        echo "Docker Hub login successful."
                    '''
                }
            }
        }

        // ==========================================================
        // 5. BUILD DOCKER IMAGE
        // ==========================================================

        stage('Build Docker Image') {

            when {
                expression {
                    env.SHOULD_DEPLOY == 'true'
                }
            }

            steps {
                sh '''
                    set -eu

                    IMAGE="${DOCKER_ORG}/${PROJECT_NAME}:${IMAGE_TAG}"

                    echo "Building image: $IMAGE"

                    docker build \
                        --pull \
                        -t "$IMAGE" \
                        .

                    docker image inspect "$IMAGE" >/dev/null

                    echo "Docker image built successfully."

                    docker images "$DOCKER_ORG/$PROJECT_NAME" \
                        --format 'table {{.Repository}}\\t{{.Tag}}\\t{{.ID}}\\t{{.Size}}'
                '''
            }
        }

        // ==========================================================
        // 6. PUSH DOCKER IMAGE
        // ==========================================================

        stage('Push Docker Image') {

            when {
                expression {
                    env.SHOULD_DEPLOY == 'true'
                }
            }

            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: "${DOCKER_CREDENTIALS}",
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        set -eu
                        set +x

                        IMAGE="${DOCKER_ORG}/${PROJECT_NAME}:${IMAGE_TAG}"

                        printf '%s' "$DOCKER_PASSWORD" | docker login \
                            --username "$DOCKER_USERNAME" \
                            --password-stdin

                        docker push "$IMAGE"

                        echo "Docker image pushed successfully."
                    '''
                }
            }
        }

        // ==========================================================
        // 7. PREPARE REMOTE DEPLOYMENT SCRIPT
        // ==========================================================

        stage('Prepare Deployment Script') {

            when {
                expression {
                    env.SHOULD_DEPLOY == 'true'
                }
            }

            steps {
                script {

                    writeFile(
                        file: 'remote-deploy.sh',
                        text: '''#!/bin/bash

set -euo pipefail

IMAGE="$1"
IMAGE_TAG="$2"
DEPLOY_EPOCH="$3"
DEPLOY_BRANCH="$4"
DEPLOY_COMMIT="$5"
DEPLOY_BUILD="$6"
DEPLOY_PATH="$7"
APP_PORT="$8"
CONTAINER_NAME="$9"

LOCK_FILE="${DEPLOY_PATH}/.deployment.lock"
EPOCH_FILE="${DEPLOY_PATH}/.deployment_epoch"

mkdir -p "$DEPLOY_PATH"

echo "=========================================="
echo "REMOTE DEPLOYMENT"
echo "=========================================="
echo "Image        : $IMAGE"
echo "Branch       : $DEPLOY_BRANCH"
echo "Commit       : $DEPLOY_COMMIT"
echo "Build        : $DEPLOY_BUILD"
echo "Container    : $CONTAINER_NAME"
echo "Port         : $APP_PORT"
echo "=========================================="

exec 200>"$LOCK_FILE"

flock -x 200

CURRENT_EPOCH=0

if [ -f "$EPOCH_FILE" ]; then
    CURRENT_EPOCH=$(cat "$EPOCH_FILE" 2>/dev/null || echo 0)
fi

if [ "$DEPLOY_EPOCH" -lt "$CURRENT_EPOCH" ]; then
    echo "Older build detected. Deployment skipped."
    exit 0
fi

echo "Pulling Docker image..."

docker pull "$IMAGE"

echo "Stopping existing container..."

docker stop "$CONTAINER_NAME" 2>/dev/null || true
docker rm -f "$CONTAINER_NAME" 2>/dev/null || true

echo "Creating Compose configuration..."

cat > "${DEPLOY_PATH}/docker-compose.yml" <<EOF
services:

  web:

    image: ${IMAGE}

    container_name: ${CONTAINER_NAME}

    restart: unless-stopped

    ports:
      - "${APP_PORT}:80"

    extra_hosts:
      - "host.docker.internal:host-gateway"

    labels:
      com.karnics.project: "namami-gange-ui"
      com.karnics.environment: "${DEPLOY_BRANCH}"
      com.karnics.branch: "${DEPLOY_BRANCH}"
      com.karnics.commit: "${DEPLOY_COMMIT}"
      com.karnics.build: "${DEPLOY_BUILD}"
      com.karnics.image-tag: "${IMAGE_TAG}"
      com.karnics.deploy-epoch: "${DEPLOY_EPOCH}"
EOF

cd "$DEPLOY_PATH"

docker compose config >/dev/null

cat > "${DEPLOY_PATH}/.env" <<EOF
IMAGE=${IMAGE}
IMAGE_TAG=${IMAGE_TAG}
DEPLOY_BRANCH=${DEPLOY_BRANCH}
DEPLOY_COMMIT=${DEPLOY_COMMIT}
DEPLOY_BUILD=${DEPLOY_BUILD}
DEPLOY_EPOCH=${DEPLOY_EPOCH}
EOF

echo "Starting application..."

docker compose up -d --force-recreate web

CONTAINER_RUNNING="false"

for i in $(seq 1 12); do

    STATUS=$(docker inspect \
        --format '{{.State.Status}}' \
        "$CONTAINER_NAME" 2>/dev/null || echo "missing")

    RUNNING=$(docker inspect \
        --format '{{.State.Running}}' \
        "$CONTAINER_NAME" 2>/dev/null || echo "false")

    echo "Attempt $i/12 - Status: $STATUS"

    if [ "$STATUS" = "running" ] && [ "$RUNNING" = "true" ]; then
        CONTAINER_RUNNING="true"
        break
    fi

    if [ "$STATUS" = "exited" ] || [ "$STATUS" = "dead" ]; then
        break
    fi

    sleep 5
done

if [ "$CONTAINER_RUNNING" != "true" ]; then

    echo "ERROR: Container failed to start."

    docker ps -a --filter "name=$CONTAINER_NAME"

    docker logs "$CONTAINER_NAME" --tail 100 2>/dev/null || true

    exit 1
fi

EXTRA_HOSTS=$(docker inspect "$CONTAINER_NAME" \
    --format '{{json .HostConfig.ExtraHosts}}')

echo "ExtraHosts: $EXTRA_HOSTS"

if ! echo "$EXTRA_HOSTS" | grep -q "host.docker.internal:host-gateway"; then
    echo "ERROR: host.docker.internal mapping is missing."
    exit 1
fi

echo "$DEPLOY_EPOCH" > "$EPOCH_FILE"

echo "=========================================="
echo "DEPLOYMENT SUCCESSFUL"
echo "=========================================="

docker ps --filter "name=$CONTAINER_NAME"

docker inspect "$CONTAINER_NAME" \
    --format 'Branch: {{index .Config.Labels "com.karnics.branch"}}'

docker inspect "$CONTAINER_NAME" \
    --format 'Commit: {{index .Config.Labels "com.karnics.commit"}}'

docker inspect "$CONTAINER_NAME" \
    --format 'Image: {{.Config.Image}}'

echo "=========================================="
'''
                    )

                    sh 'chmod +x remote-deploy.sh'
                }
            }
        }

        // ==========================================================
        // 8. DEPLOY APPLICATION
        // ==========================================================

        stage('Deploy Application') {

            when {
                expression {
                    env.SHOULD_DEPLOY == 'true'
                }
            }

            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: "${SSH_CREDENTIALS}",
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'SSH_USER'
                    )
                ]) {
                    sh '''
                        set -eu

                        DEPLOY_SCRIPT="/tmp/${CONTAINER_NAME}-deploy.sh"

                        scp \
                            -i "$SSH_KEY" \
                            -o IdentitiesOnly=yes \
                            -o BatchMode=yes \
                            -o StrictHostKeyChecking=yes \
                            -o ConnectTimeout=15 \
                            remote-deploy.sh \
                            "$SSH_USER@$APP_SERVER:$DEPLOY_SCRIPT"

                        ssh \
                            -i "$SSH_KEY" \
                            -o IdentitiesOnly=yes \
                            -o BatchMode=yes \
                            -o StrictHostKeyChecking=yes \
                            -o ConnectTimeout=15 \
                            "$SSH_USER@$APP_SERVER" \
                            "bash '$DEPLOY_SCRIPT' \
                            '$DOCKER_ORG/$PROJECT_NAME:$IMAGE_TAG' \
                            '$IMAGE_TAG' \
                            '$DEPLOY_EPOCH' \
                            '$BRANCH_NAME_SAFE' \
                            '$SHORT_COMMIT' \
                            '$BUILD_NUMBER' \
                            '$DEPLOY_PATH' \
                            '$APP_PORT' \
                            '$CONTAINER_NAME'"

                        ssh \
                            -i "$SSH_KEY" \
                            -o IdentitiesOnly=yes \
                            -o BatchMode=yes \
                            -o StrictHostKeyChecking=yes \
                            "$SSH_USER@$APP_SERVER" \
                            "rm -f '$DEPLOY_SCRIPT'"

                        echo "Deployment command completed."
                    '''
                }
            }
        }

        // ==========================================================
        // 9. HEALTH CHECK
        // ==========================================================

        stage('Health Check') {

            when {
                expression {
                    env.SHOULD_DEPLOY == 'true'
                }
            }

            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: "${SSH_CREDENTIALS}",
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'SSH_USER'
                    )
                ]) {
                    sh '''
                        set -eu

                        sleep 5

                        echo "Checking container..."

                        ssh \
                            -i "$SSH_KEY" \
                            -o IdentitiesOnly=yes \
                            -o BatchMode=yes \
                            -o StrictHostKeyChecking=yes \
                            "$SSH_USER@$APP_SERVER" \
                            "docker ps --filter 'name=^/${CONTAINER_NAME}$' \
                            --format 'table {{.Names}}\\t{{.Image}}\\t{{.Status}}\\t{{.Ports}}'"

                        echo "Checking application URL..."

                        curl \
                            --fail \
                            --max-time 15 \
                            "http://${APP_SERVER}:${APP_PORT}/"

                        echo ""
                        echo "APPLICATION HEALTH CHECK PASSED"
                    '''
                }
            }
        }

        // ==========================================================
        // 10. JENKINS DOCKER CLEANUP
        // Remove only current branch images.
        // ==========================================================

        stage('Jenkins Docker Cleanup') {

            when {
                expression {
                    env.SHOULD_DEPLOY == 'true'
                }
            }

            steps {
                sh '''
                    set -eu

                    CURRENT_IMAGE="${DOCKER_ORG}/${PROJECT_NAME}:${IMAGE_TAG}"
                    BRANCH_PREFIX="${BRANCH_NAME_SAFE}-"

                    echo "Current image: $CURRENT_IMAGE"
                    echo "Branch prefix: $BRANCH_PREFIX"

                    docker images "$DOCKER_ORG/$PROJECT_NAME" \
                        --format '{{.Tag}}' |
                    while IFS= read -r TAG; do

                        [ -z "$TAG" ] && continue
                        [ "$TAG" = "<none>" ] && continue

                        case "$TAG" in
                            "$BRANCH_PREFIX"*)
                                IMAGE="${DOCKER_ORG}/${PROJECT_NAME}:${TAG}"

                                if [ "$IMAGE" = "$CURRENT_IMAGE" ]; then
                                    echo "KEEP: $IMAGE"
                                else
                                    echo "REMOVE: $IMAGE"
                                    docker rmi "$IMAGE" || \
                                        echo "WARNING: Could not remove $IMAGE"
                                fi
                                ;;
                            *)
                                echo "SKIP OTHER BRANCH IMAGE: $TAG"
                                ;;
                        esac

                    done

                    echo "Jenkins Docker cleanup completed."
                '''
            }
        }

        // ==========================================================
        // 11. PREPARE APPLICATION SERVER CLEANUP SCRIPT
        // Keep running image + newest two for this environment.
        // ==========================================================

        stage('Prepare Cleanup Script') {

            when {
                expression {
                    env.SHOULD_DEPLOY == 'true'
                }
            }

            steps {
                script {

                    writeFile(
                        file: 'remote-cleanup.sh',
                        text: '''#!/bin/bash

set -euo pipefail

REPOSITORY="$1"
CONTAINER_NAME="$2"
BRANCH_PREFIX="$3"

echo "=========================================="
echo "APPLICATION SERVER IMAGE CLEANUP"
echo "=========================================="

echo "Repository: $REPOSITORY"
echo "Container : $CONTAINER_NAME"
echo "Prefix    : $BRANCH_PREFIX"

RUNNING_IMAGE=$(docker inspect "$CONTAINER_NAME" \
    --format '{{.Config.Image}}' 2>/dev/null || true)

if [ -z "$RUNNING_IMAGE" ]; then
    echo "ERROR: Running container not found."
    exit 1
fi

echo "Running image: $RUNNING_IMAGE"

mapfile -t IMAGE_RECORDS < <(

    while IFS= read -r TAG; do

        [ -z "$TAG" ] && continue
        [ "$TAG" = "<none>" ] && continue

        case "$TAG" in
            "$BRANCH_PREFIX"*) ;;
            *) continue ;;
        esac

        IMAGE="${REPOSITORY}:${TAG}"

        CREATED=$(docker image inspect \
            --format '{{.Created}}' "$IMAGE" 2>/dev/null) || continue

        CREATED_EPOCH=$(date -d "$CREATED" +%s 2>/dev/null) || continue

        printf '%s|%s\\n' "$CREATED_EPOCH" "$IMAGE"

    done < <(
        docker image ls "$REPOSITORY" \
            --format '{{.Tag}}' | sort -u
    )

)

mapfile -t IMAGE_RECORDS < <(
    printf '%s\\n' "${IMAGE_RECORDS[@]}" |
        sort -t '|' -k1,1nr
)

KEEP_FILE=$(mktemp)

cleanup_temp() {
    rm -f "$KEEP_FILE"
}

trap cleanup_temp EXIT

echo "$RUNNING_IMAGE" >> "$KEEP_FILE"

KEPT_COUNT=1

for RECORD in "${IMAGE_RECORDS[@]}"; do

    IMAGE="${RECORD#*|}"

    if grep -Fxq "$IMAGE" "$KEEP_FILE"; then
        continue
    fi

    if [ "$KEPT_COUNT" -lt 3 ]; then
        echo "$IMAGE" >> "$KEEP_FILE"
        KEPT_COUNT=$((KEPT_COUNT + 1))
    fi

done

echo ""
echo "Images to keep:"
cat "$KEEP_FILE"

CONTAINER_IMAGE_IDS=$(
    docker ps -aq |
    xargs -r docker inspect --format '{{.Image}}' 2>/dev/null ||
    true
)

while IFS= read -r TAG; do

    [ -z "$TAG" ] && continue
    [ "$TAG" = "<none>" ] && continue

    case "$TAG" in
        "$BRANCH_PREFIX"*) ;;
        *) continue ;;
    esac

    IMAGE="${REPOSITORY}:${TAG}"

    if grep -Fxq "$IMAGE" "$KEEP_FILE"; then
        echo "KEEP: $IMAGE"
        continue
    fi

    IMAGE_ID=$(docker image inspect \
        --format '{{.Id}}' "$IMAGE" 2>/dev/null || true)

    [ -z "$IMAGE_ID" ] && continue

    if printf '%s\\n' "$CONTAINER_IMAGE_IDS" | grep -Fxq "$IMAGE_ID"; then
        echo "SKIP: Image used by another container: $IMAGE"
        continue
    fi

    echo "REMOVE: $IMAGE"

    docker rmi "$IMAGE" || {
        echo "WARNING: Could not remove $IMAGE"
    }

done < <(
    docker image ls "$REPOSITORY" \
        --format '{{.Tag}}' | sort -u
)

echo ""
echo "APPLICATION SERVER CLEANUP COMPLETED"

docker images "$REPOSITORY" \
    --format 'table {{.Repository}}\\t{{.Tag}}\\t{{.CreatedAt}}'
'''
                    )

                    sh 'chmod +x remote-cleanup.sh'
                }
            }
        }

        // ==========================================================
        // 12. APPLICATION SERVER DOCKER CLEANUP
        // ==========================================================

        stage('Application Server Docker Cleanup') {

            when {
                expression {
                    env.SHOULD_DEPLOY == 'true'
                }
            }

            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: "${SSH_CREDENTIALS}",
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'SSH_USER'
                    )
                ]) {
                    sh '''
                        set -eu

                        CLEANUP_SCRIPT="/tmp/${CONTAINER_NAME}-cleanup.sh"

                        scp \
                            -i "$SSH_KEY" \
                            -o IdentitiesOnly=yes \
                            -o BatchMode=yes \
                            -o StrictHostKeyChecking=yes \
                            -o ConnectTimeout=15 \
                            remote-cleanup.sh \
                            "$SSH_USER@$APP_SERVER:$CLEANUP_SCRIPT"

                        ssh \
                            -i "$SSH_KEY" \
                            -o IdentitiesOnly=yes \
                            -o BatchMode=yes \
                            -o StrictHostKeyChecking=yes \
                            "$SSH_USER@$APP_SERVER" \
                            "bash '$CLEANUP_SCRIPT' \
                            '$DOCKER_ORG/$PROJECT_NAME' \
                            '$CONTAINER_NAME' \
                            '${BRANCH_NAME_SAFE}-'"

                        ssh \
                            -i "$SSH_KEY" \
                            -o IdentitiesOnly=yes \
                            -o BatchMode=yes \
                            -o StrictHostKeyChecking=yes \
                            "$SSH_USER@$APP_SERVER" \
                            "rm -f '$CLEANUP_SCRIPT'"

                        echo "Application server cleanup completed."
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
                docker logout >/dev/null 2>&1 || true
            '''

            cleanWs()
        }

        success {
            script {

                if (env.SHOULD_DEPLOY == 'true') {

                    echo """
==========================================
DEPLOYMENT SUCCESSFUL
==========================================

Project : ${env.PROJECT_NAME}
Branch  : ${env.BRANCH_NAME}
Build   : ${env.BUILD_NUMBER}
Commit  : ${env.SHORT_COMMIT}
Image   : ${env.DOCKER_ORG}/${env.PROJECT_NAME}:${env.IMAGE_TAG}
Port    : ${env.APP_PORT}

==========================================
"""

                } else {

                    echo """
==========================================
BUILD SUCCESSFUL - NO DEPLOYMENT
==========================================

Project : ${env.PROJECT_NAME}
Branch  : ${env.BRANCH_NAME}
Build   : ${env.BUILD_NUMBER}
Commit  : ${env.SHORT_COMMIT}

Frontend build and SonarQube analysis
completed successfully.

Docker publishing and deployment skipped.

==========================================
"""
                }
            }
        }

        failure {
            echo """
==========================================
PIPELINE FAILED
==========================================

Project : ${env.PROJECT_NAME}
Branch  : ${env.BRANCH_NAME}
Build   : ${env.BUILD_NUMBER}
Commit  : ${env.SHORT_COMMIT}

Please check Jenkins console output.

==========================================
"""
        }
    }
}
