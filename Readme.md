# AutoDock

AutoDock is a command-line tool for generating Docker Compose files based on specified base images using Google Generative AI

## Installation

```
npm install autodock
```
## Setup
Add your api in .env file

## Usage

```
autodock -b "ubuntu,redis"
```
 or
```
autodock -b "ubuntu,redis" -f "custom-compose.yml"
```
Personalise your images