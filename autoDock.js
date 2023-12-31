#!/usr/bin/env node
const fs = require('fs');
const cli = require('cli');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function generateDockerCompose(baseImages) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `you are writing a Docker Compose file adhering to industry standards. Define services based on the following images: ${baseImages.join(', ')}. Utilize default configurations and incorporate essential specifications such as volumes, ports, networks, health checks, and more for each image and service. Ensure strict adherence to the given images and services, and avoid including any additional services or images beyond the specified ones. dont write comments `;


    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

cli.parse({
    filename: ['f', 'Name of the Docker Compose file to create', 'string', 'docker-compose.yml'],
    baseImage: ['b', 'Base images for services', 'string', []],
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
        const dockerComposeContent = await generateDockerCompose(baseImages);
        fs.writeFileSync(filename, dockerComposeContent, 'utf-8');
        cli.ok(`Docker Compose file '${filename}' created successfully.`);
    } catch (error) {
        cli.error('Error generating Docker Compose file:', error.message);
    }
});
