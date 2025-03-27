FROM node:20

WORKDIR /app

# Install PostgreSQL client for health checks
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Make entrypoint script executable
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 5000

# Command to run the app
ENTRYPOINT ["./docker-entrypoint.sh"]