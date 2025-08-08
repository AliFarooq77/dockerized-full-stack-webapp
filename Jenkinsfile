pipeline{
    agent any
    environment{
        BACKEND_IMAGE = 'my-laravel-app'
        FRONTEND_IMAGE = 'my-react-app'
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }
    stages{
        stage('Code Clone'){
            steps{
                echo "Cloning the repository"
                git url:"https://github.com/AliFarooq77/dockerized-full-stack-webapp.git", branch:"main"
            }
        }
        stage('Build'){
            steps{
                echo "Building the image"
                sh "docker compose build"
                //sh "docker compose down"
                //sh "docker compose up -d"
            }
        }
        stage('Test'){
            
        }
        stage('Push to DockerHub'){
            steps{
                echo "Pushing the image to Docker Hub"
                withCredentials([usernamePassword(credentialsId:"DockerHub", passwordVariable:"Pass", usernameVariable:"User")]){
                    sh "docker login -u ${env.User} -p ${env.Pass}" 
                    
                    sh "docker tag ${env.BACKEND_IMAGE}:latest muhammadalifarooq/${env.BACKEND_IMAGE}:latest"
                    sh "docker tag ${env.FRONTEND_IMAGE}:latest muhammadalifarooq/${env.FRONTEND_IMAGE}:latest"
                    
                    sh "docker push muhammadalifarooq/${env.BACKEND_IMAGE}:latest"
                    sh "docker push muhammadalifarooq/${env.FRONTEND_IMAGE}:latest"
                }
            }
        }
        stage('Deploy'){
            steps{
                sh "docker compose down && docker compose up -d"
            }
        }
    }
}
