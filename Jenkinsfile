pipeline {
    agent any

    environment {
        // =========================================================
        // SERVER / APPLICATION SETTINGS
        // =========================================================
        APP_SERVER = '45.195.229.15'
        DEPLOY_DIR = '/opt/namami-gange-ui'

        // Docker image
        DOCKER_IMAGE = 'sunardock/namami-gange-ui'

        // Port on application server
        APP_PORT = '18085'

        // Jenkins SSH credential
        SSH_CREDENTIAL_ID = 'new-server-ssh'

        // Build number becomes image tag
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        // =========================================================
        // CHECKOUT
        // =========================================================
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // =========================================================
        // INSTALL / BUILD
        // =========================================================
        stage('Build Frontend') {
            steps {
                sh '''
                    set -e

                    echo "========================================="
                    echo "Building Namami Gange UI"
                    echo "========================================="

                    npm ci
                    npm run build

                    echo "Frontend build completed successfully."
                '''
            }
        }

        // =========================================================
        // BUILD DOCKER IMAGE
        // =========================================================
        stage('Build Docker Image') {
            steps {
                sh '''
                    set -e

                    echo "========================================="
                    echo "Building Docker Image"
                    echo "========================================="

                    docker build \
                        -t ${DOCKER_IMAGE}:${IMAGE_TAG} \
                        -t ${DOCKER_IMAGE}:latest \
                        .

                    echo ""
                    echo "Docker images created:"
                    docker images ${DOCKER_IMAGE}
                '''
            }
        }

        // =========================================================
        // SAVE CURRENT IMAGE
        // =========================================================
        stage('Save Docker Image') {
            steps {
                sh '''
                    set -e

                    echo "========================================="
                    echo "Saving Docker Image"
                    echo "========================================="

                    mkdir -p deploy-package

                    docker save \
                        ${DOCKER_IMAGE}:${IMAGE_TAG} \
                        -o deploy-package/namami-gange-ui-${IMAGE_TAG}.tar

                    echo "Image saved successfully."
                    ls -lh deploy-package/namami-gange-ui-${IMAGE_TAG}.tar
                '''
            }
        }

        // =========================================================
        // CREATE DEPLOYMENT FILE
        // =========================================================
        stage('Create Deployment Files') {
            steps {
                sh '''
                    set -e

                    mkdir -p deploy-package

                    cat > deploy-package/docker-compose.yml <<EOF
services:
  namami-gange-ui:
    image: ${DOCKER_IMAGE}:\${IMAGE_TAG}
    container_name: namami-gange-ui
    restart: unless-stopped
    ports:
      - "${APP_PORT}:80"
    extra_hosts:
      - "host.docker.internal:host-gateway"
EOF

                    echo "docker-compose.yml created:"
                    cat deploy-package/docker-compose.yml
                '''
            }
        }

        // =========================================================
        // TRANSFER TO APPLICATION SERVER
        // =========================================================
        stage('Transfer To Application Server') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: "${SSH_CREDENTIAL_ID}",
                        usernameVariable: 'SSH_USER',
                        passwordVariable: 'SSH_PASSWORD'
                    )
                ]) {
                    sh '''
                        set -e

                        echo "========================================="
                        echo "Preparing Application Server"
                        echo "========================================="

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$APP_SERVER" \
                            "mkdir -p $DEPLOY_DIR/images"

                        echo "Application directory ready."

                        echo ""
                        echo "Transferring Docker image..."

                        sshpass -p "$SSH_PASSWORD" scp \
                            -o StrictHostKeyChecking=no \
                            deploy-package/namami-gange-ui-${IMAGE_TAG}.tar \
                            "$SSH_USER@$APP_SERVER:$DEPLOY_DIR/images/"

                        echo ""
                        echo "Transferring docker-compose.yml..."

                        sshpass -p "$SSH_PASSWORD" scp \
                            -o StrictHostKeyChecking=no \
                            deploy-package/docker-compose.yml \
                            "$SSH_USER@$APP_SERVER:$DEPLOY_DIR/"

                        echo ""
                        echo "Files transferred successfully."
                    '''
                }
            }
        }

        // =========================================================
        // DEPLOY ON APPLICATION SERVER
        // =========================================================
        stage('Deploy Application') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: "${SSH_CREDENTIAL_ID}",
                        usernameVariable: 'SSH_USER',
                        passwordVariable: 'SSH_PASSWORD'
                    )
                ]) {
                    sh '''
                        set -e

                        echo "========================================="
                        echo "Deploying Namami Gange UI"
                        echo "Build: ${IMAGE_TAG}"
                        echo "========================================="

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$APP_SERVER" \
                            "cd $DEPLOY_DIR && \
                             docker load -i images/namami-gange-ui-${IMAGE_TAG}.tar && \
                             echo 'IMAGE_TAG=${IMAGE_TAG}' > .env && \
                             docker compose up -d --force-recreate"

                        echo ""
                        echo "Application deployed successfully."
                    '''
                }
            }
        }

        // =========================================================
        // VERIFY APPLICATION
        // =========================================================
        stage('Health Check') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: "${SSH_CREDENTIAL_ID}",
                        usernameVariable: 'SSH_USER',
                        passwordVariable: 'SSH_PASSWORD'
                    )
                ]) {
                    sh '''
                        set -e

                        echo "========================================="
                        echo "Health Check"
                        echo "========================================="

                        sleep 10

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$APP_SERVER" \
                            "docker ps --filter name=namami-gange-ui"

                        echo ""
                        echo "Testing HTTP response..."

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$APP_SERVER" \
                            "curl -f http://127.0.0.1:${APP_PORT}/"

                        echo ""
                        echo "Health check PASSED."
                    '''
                }
            }
        }

        // =========================================================
        // APPLICATION SERVER IMAGE CLEANUP
        //
        // KEEP:
        //   Current image
        //   Previous image
        //   Previous previous image
        //
        // TOTAL = 3 IMAGES
        // =========================================================
        stage('Application Server Image Cleanup') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: "${SSH_CREDENTIAL_ID}",
                        usernameVariable: 'SSH_USER',
                        passwordVariable: 'SSH_PASSWORD'
                    )
                ]) {
                    sh '''
                        set -e

                        echo "========================================="
                        echo "Application Server Image Cleanup"
                        echo "========================================="

                        sshpass -p "$SSH_PASSWORD" ssh \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$APP_SERVER" \
                            "DOCKER_IMAGE='$DOCKER_IMAGE' bash -s" <<'REMOTE_SCRIPT'

set -e

echo ""
echo "Images before cleanup:"
docker images "\$DOCKER_IMAGE" --format '{{.Repository}}:{{.Tag}}' | sort -Vr

echo ""
echo "Keeping current + previous 2 images..."

# Get image tags, ignore latest
TAGS=\$(docker images "\$DOCKER_IMAGE" \
    --format '{{.Tag}}' | \
    grep -E '^[0-9]+$' | \
    sort -nr)

COUNT=0

for TAG in \$TAGS; do

    COUNT=\$((COUNT + 1))

    if [ "\$COUNT" -le 3 ]; then
        echo "KEEP: \$DOCKER_IMAGE:\$TAG"
    else
        echo "REMOVE: \$DOCKER_IMAGE:\$TAG"

        # Never remove an image currently used by a running container
        if docker ps --format '{{.Image}}' | grep -q "^\\\$DOCKER_IMAGE:\$TAG\$"; then
            echo "SKIP: \$DOCKER_IMAGE:\$TAG is currently running"
        else
            docker rmi "\$DOCKER_IMAGE:\$TAG" || true
        fi
    fi

done

echo ""
echo "Images after cleanup:"
docker images "\$DOCKER_IMAGE" --format '{{.Repository}}:{{.Tag}}' | sort -Vr

REMOTE_SCRIPT

                        echo ""
                        echo "Application server cleanup completed."
                    '''
                }
            }
        }

        // =========================================================
        // JENKINS SERVER IMAGE CLEANUP
        //
        // KEEP ONLY CURRENT BUILD IMAGE
        // =========================================================
        stage('Jenkins Image Cleanup') {
            steps {
                sh '''
                    set -e

                    echo "========================================="
                    echo "Jenkins Server Image Cleanup"
                    echo "========================================="

                    echo ""
                    echo "Images before cleanup:"
                    docker images ${DOCKER_IMAGE}

                    # Remove all numeric build-tagged images except
                    # the current BUILD_NUMBER.
                    OLD_TAGS=$(docker images ${DOCKER_IMAGE} \
                        --format '{{.Tag}}' | \
                        grep -E '^[0-9]+$' | \
                        grep -v "^${IMAGE_TAG}$" || true)

                    for TAG in $OLD_TAGS; do
                        echo "Removing Jenkins image: ${DOCKER_IMAGE}:${TAG}"
                        docker rmi "${DOCKER_IMAGE}:${TAG}" || true
                    done

                    # Remove dangling images created during build
                    docker image prune -f || true

                    echo ""
                    echo "Images after cleanup:"
                    docker images ${DOCKER_IMAGE}
                '''
            }
        }

        // =========================================================
        // CLEAN WORKSPACE
        // =========================================================
        stage('Workspace Cleanup') {
            steps {
                sh '''
                    rm -rf deploy-package
                '''
            }
        }
    }

    // =============================================================
    // POST ACTIONS
    // =============================================================
    post {

        success {
            echo '''
=========================================
DEPLOYMENT SUCCESSFUL
=========================================
Application:
Namami Gange UI

Server:
45.195.229.15

URL:
http://45.195.229.15:18085

Current Image:
sunardock/namami-gange-ui:${IMAGE_TAG}

Application Server:
KEEP CURRENT + LAST 2 IMAGES

Jenkins Server:
KEEP CURRENT IMAGE ONLY
=========================================
'''
        }

        failure {
            echo '''
=========================================
DEPLOYMENT FAILED
=========================================
Check the Jenkins console output.
=========================================
'''
        }
    }
}
