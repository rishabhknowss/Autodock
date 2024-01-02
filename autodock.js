#!/usr/bin/env node
const fs = require('fs');
const cli = require('cli');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function generateDockerCompose(baseImages) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Generate a Docker Compose file for ${baseImages.join(', ')} images. Define the necessary services, networks, and volumes to ensure the proper functioning of the application. Specify the appropriate configurations for inter-service communication, port exposure, and data persistence. Use the latest version of the Docker Compose file format and every service. Ensure strict adherence to the given images and services, and AVOID including any additional services or images beyond the specified ones. Don't write comments.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

async function generateDockerfile(baseImages) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Generate a Dockerfile for a ${baseImages} application. Include necessary instructions, ports, dependencies, and configurations to create a Docker image for the specified base image. Use best practices for creating efficient and secure Docker images. Don't write comments.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

cli.parse({
    filename: ['f', 'Name of the file to create', 'string', 'docker-compose.yml'],
    baseImage: ['b', 'Base images for services or Dockerfile', 'string', []],
});

cli.main(async function (args, options) {

    const filename = options.filename;
    const baseImages = Array.isArray(options.baseImage) ? options.baseImage : [options.baseImage];

    if (baseImages.length === 0) {
        cli.error('Please provide at least one base image using the -b option.');
        cli.getUsage();
        return;
    }

    try {
        if (filename.endsWith('.yaml') || filename.endsWith('.yml')) {
            // Generate Docker Compose file
            const dockerComposeContent = await generateDockerCompose(baseImages);
            fs.writeFileSync((filename), dockerComposeContent, 'utf-8');
            cli.ok(`Docker Compose file '${filename}' created successfully.`);
        } else if (filename.toLowerCase().endsWith('dockerfile')) {
            // Generate Dockerfile
            if (baseImages.length === 1) {
                const dockerfileContent = await generateDockerfile(baseImages[0]);
                fs.writeFileSync((filename), dockerfileContent, 'utf-8');
                cli.ok(`Dockerfile '${filename}' created successfully for ${baseImages[0]}.`);
            } else {
                cli.error('When specifying a Dockerfile, provide only one base image using the -b option.');
                cli.getUsage();
            }
        } else {
            cli.error('Unsupported file format. Use .yaml, .yml for Docker Compose or .dockerfile for Dockerfile.');
            cli.getUsage();
        }
    } catch (error) {
        cli.error('Error generating file:', error.message);
    }
});