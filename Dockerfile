
FROM NODE


WORKDIR /app


COPY . .


CMD ["npm", "start"]