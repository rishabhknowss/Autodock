#!/usr/bin/env node

const fs = require('fs');
const cli = require('cli');

cli.parse({
    filename: ['f', 'Name of the Dockerfile to create', 'string', 'Dockerfile'],
    baseImage: ['b', 'Base image for the Dockerfile', 'string', 'node:14'],
    appDirectory: ['d', 'Directory containing your app files', 'string', 'app'],
});

cli.main(function (args, options) {
    const filename = options.filename;
    const baseImage = options.baseImage;
    const appDirectory = options.appDirectory;

    const dockerfileContent = `
FROM ${baseImage}


WORKDIR /${appDirectory}


COPY . .


CMD ["npm", "start"]`;

    fs.writeFileSync(filename, dockerfileContent, 'utf-8');
    console.log(`Dockerfile '${filename}' created successfully.`);
});
