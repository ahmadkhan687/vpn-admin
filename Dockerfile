# Use the official Node.js image as a base image
FROM node:18.17.0

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies (Next, React, etc.)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (this creates the .next folder)
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
