# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose the port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
