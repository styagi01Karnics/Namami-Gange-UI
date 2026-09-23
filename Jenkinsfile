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

        // Do not allow two builds of the same branch job
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
                        script: "git rev-parse --short=7 HEAD",
                        returnStdout: true
                    ).trim()

                    def branchName = sh(
                        script: "git rev-parse --abbrev-ref HEAD",
                        returnStdout: true
                    ).trim()

                    /*
                     * Docker-safe and globally unique enough:
                     *
                     * BUILD_NUMBER + commit SHA
                     *
                     * Example:
                     * 15-a81f92c
                     */

                    env.GIT_SHORT_COMMIT = shortCommit

                    env.BRANCH_NAME_SAFE = branchName
                        .replaceAll('[^a-zA-Z0-9_.-]', '-')
                        .take(40)

                    env.IMAGE_TAG = "${BUILD_NUMBER}-${shortCommit}"

                    // Deployment ordering marker.
                    // Used on the application server so an older build
                    // cannot replace a newer deployment.
                    env.DEPLOY_EPOCH = "${System.currentTimeMillis()}"
                }

                sh '''
                    echo "=========================================="
                    echo "SOURCE CHECKOUT"
                    echo "=========================================="

                    echo "Branch:"
                    git branch --show-current || true

                    echo ""
                    echo "Commit:"
                    git log -1 --oneline || true

                    echo ""
                    echo "Branch Name:"
                    echo "$BRANCH_NAME_SAFE"

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

                    echo ""
                    echo "Created image:"
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
        //
        // Important:
        //
        // All branches use the SAME:
        //
        // container name:
        // namami-gange-ui
        //
        // port:
        // 18085
        //
        // Therefore only one branch can be active.
        //
        // A remote flock prevents simultaneous deployments.
        // DEPLOY_EPOCH prevents an older build from replacing
        // a deployment that was already made by a newer build.
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

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USERNAME@$DEPLOY_SERVER" \
                            "mkdir -p '$DEPLOY_PATH'"

                        echo ""
                        echo "Starting remote deployment lock..."

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USERNAME@$DEPLOY_SERVER" \
                            "bash -s" <<REMOTE_SCRIPT
set -e

DEPLOY_PATH='${DEPLOY_PATH}'
IMAGE='${IMAGE}'
IMAGE_TAG='${IMAGE_TAG}'
APP_PORT='${APP_PORT}'
DEPLOY_EPOCH='${DEPLOY_EPOCH}'
BRANCH_NAME='${BRANCH_NAME_SAFE}'

LOCK_FILE='/tmp/namami-gange-ui-deploy.lock'
DEPLOYMENT_FILE="\$DEPLOY_PATH/.deployment_epoch"

(
    flock -x 200

    echo "=========================================="
    echo "REMOTE DEPLOYMENT"
    echo "=========================================="

    echo "Branch:"
    echo "\$BRANCH_NAME"

    echo "Image:"
    echo "\$IMAGE"

    echo "Deployment ID:"
    echo "\$DEPLOY_EPOCH"

    echo ""
    echo "Checking previous deployment..."

    if [ -f "\$DEPLOYMENT_FILE" ]; then

        PREVIOUS_EPOCH=\$(cat "\$DEPLOYMENT_FILE" 2>/dev/null || echo "0")

        echo "Previous deployment ID:"
        echo "\$PREVIOUS_EPOCH"

        if [ "\$DEPLOY_EPOCH" -le "\$PREVIOUS_EPOCH" ]; then

            echo ""
            echo "This build is older than the current deployment."
            echo "Skipping deployment."

            exit 0
        fi

    else

        echo "No previous deployment found."

    fi


    echo ""
    echo "Pulling new image..."

    docker pull "\$IMAGE"


    echo ""
    echo "Stopping currently running Namami-Gange UI..."

    docker stop namami-gange-ui 2>/dev/null || true


    echo ""
    echo "Removing currently running container..."

    docker rm namami-gange-ui 2>/dev/null || true


    echo ""
    echo "Creating deployment directory..."

    mkdir -p "\$DEPLOY_PATH"


    echo ""
    echo "Creating docker-compose.yml..."

    cat > "\$DEPLOY_PATH/docker-compose.yml" <<COMPOSE
services:

  namami-gange-ui:

    image: \$IMAGE

    container_name: namami-gange-ui

    restart: unless-stopped

    ports:
      - "\$APP_PORT:80"

    extra_hosts:
      - "host.docker.internal:host-gateway"

COMPOSE


    echo ""
    echo "Creating .env..."

    cat > "\$DEPLOY_PATH/.env" <<ENV
IMAGE_TAG=\$IMAGE_TAG
DEPLOY_BRANCH=\$BRANCH_NAME
DEPLOY_EPOCH=\$DEPLOY_EPOCH
ENV


    echo ""
    echo "Starting new application..."

    cd "\$DEPLOY_PATH"

    docker compose up -d --force-recreate


    echo ""
    echo "Saving deployment marker..."

    echo "\$DEPLOY_EPOCH" > "\$DEPLOYMENT_FILE"


    echo ""
    echo "Current application container:"

    docker ps \
        --filter "name=namami-gange-ui" \
        --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'


    echo ""
    echo "Deployment completed."

) 200>"\$LOCK_FILE"
REMOTE_SCRIPT
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
        // JENKINS / DEVOPS SERVER CLEANUP
        //
        // Keep ONLY the current image.
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

                            echo "Keeping current image:"
                            echo "$IMAGE"

                        else

                            echo "Removing old Jenkins image:"
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
        //
        // Keep latest 3 images:
        //
        // CURRENT
        // PREVIOUS 1
        // PREVIOUS 2
        //
        // Cleanup is based on image creation time.
        // Running image is NEVER deleted.
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
                            "bash -s" <<REMOTE_CLEANUP
set +e

REPO='${DOCKER_ORG}/${PROJECT_NAME}'

echo "Repository:"
echo "\$REPO"

echo ""
echo "Images before cleanup:"

docker images "\$REPO"


echo ""
echo "Selecting latest 3 images..."

KEEP_FILE="/tmp/namami-gange-ui-keep.txt"

docker images "\$REPO" \
    --format '{{.CreatedAt}}|{{.Tag}}' |
grep -v '|<none>' |
sort -r |
head -3 |
cut -d'|' -f2 |
sort -u > "\$KEEP_FILE"


echo ""
echo "Images/tags to keep:"

cat "\$KEEP_FILE"


echo ""
echo "Cleaning old images..."


docker images "\$REPO" \
    --format '{{.Repository}}:{{.Tag}}' |
while read IMAGE
do

    [ -z "\$IMAGE" ] && continue

    TAG="\${IMAGE##*:}"


    if grep -Fxq "\$TAG" "\$KEEP_FILE"; then

        echo "Keeping:"
        echo "\$IMAGE"

        continue

    fi


    # Never remove an image currently used by a running container.

    if docker ps \
        --format '{{.Image}}' |
        grep -Fxq "\$IMAGE"; then

        echo "Skipping running image:"
        echo "\$IMAGE"

        continue

    fi


    echo "Removing old image:"
    echo "\$IMAGE"

    docker rmi "\$IMAGE" || true

done


echo ""
echo "Removing dangling images..."

docker image prune -f || true


echo ""
echo "Images after cleanup:"

docker images "\$REPO"


rm -f "\$KEEP_FILE"

REMOTE_CLEANUP
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

            Image   : ${DOCKER_ORG}/${PROJECT_NAME}:${IMAGE_TAG}

            Server  : ${DEPLOY_SERVER}
            Port    : ${APP_PORT}

            Latest branch deployment is active.

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
