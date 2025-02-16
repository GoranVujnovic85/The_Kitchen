# Use Node.js base image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy entire project into the working directory
COPY . .

# Exposed port
EXPOSE 3000

# Command to run when the container starts
CMD ["npm", "run", "dev"]