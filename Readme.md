# AutoDock

AutoDock is a command-line tool for generating Docker and Docker Compose files based on specified base images using Google Generative AI

## Installation

```
npm install autodock
```

## Setup

To use AutoDock, you need to set up your environment by creating a .env file with your [Gemini Pro](ht
tps://ai.google.dev/) API key:
```
API_KEY="YOUR_GEMINI_PRO_KEY"
```

## Usage

```
autodock -f "Dockerfile" -b "node"
```
Personalize your Docker Compose file by specifying multiple base images:
```
autodock -f "docker-compose.yml" -b "ubuntu,"node","redis"
```

## Docker build

```
docker build -t test-app .
```
```
docker run -p 3000:3000 test-app
```

### Uninstall

```
npm unistall autodock
```



