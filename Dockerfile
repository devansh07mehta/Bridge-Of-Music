# Use an official Node runtime as a parent image
FROM node:16-buster

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install 7zip and other necessary dependencies for electron-builder
RUN apt-get update && \
    apt-get install -y p7zip-full libx11-dev libxkbfile-dev libsecret-1-dev libxss1 libgconf-2-4 libnss3 libatk-bridge2.0-0

# Copy the rest of the application files to the working directory
COPY . .

# Build the application
RUN npm run dist

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]
