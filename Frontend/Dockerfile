# Build stage
FROM node:16 AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the rest of the frontend files
COPY . .

# Build the production version
RUN npm run build

# Serve stage
FROM node:16-slim

# Set working directory
WORKDIR /app

# Copy built files from the build stage
COPY --from=build /app/dist ./dist

# Install serve to run the app
RUN npm install -g serve

# Expose the port
EXPOSE 3000

# Command to serve the app
CMD ["serve", "-s", "dist", "-l", "3000"]