# Dockerfile that outline steps to containerize the fragments API microservice

# use node version 16.15.1
FROM node:16.15.1-alpine

# Install lightweight init system and curl for healthcheck routine
RUN apk --no-cache add dumb-init=1.2.5-r1 \
    && add curl=7.55.0-r2

# Metadata
LABEL maintainer="Shervin Tafreshipour <stafreshipour@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# Default to port 8080
ENV port=8080

# Reduce npm logging level when installing within Docker
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
ENV NPM_CONFIG_COLOR=false

# Optimizing Node.js tooling for production
ENV NODE_ENV production

# Define a working directory
WORKDIR /app

# Ensure 'node' user has access to working directory
RUN chown -R node:node /app

# Copy the package.json and package-lock.json files into /app
COPY package*.json /app/

# Install node dependencies defined in package-lock.json
RUN npm ci --only=production

# Copy src to /app/src/
COPY --chown=node:node ./src ./src

# Copy our HTPASSWD file
COPY --chown=node:node ./tests/.htpasswd ./tests/.htpasswd

# Define a non-root user
USER node

# Start the container by running our server
CMD ["dumb-init", "node", "./src/index.js"]

# We run our service on port 8080
EXPOSE 8080

# Define a healthcheck rountine
HEALTHCHECK --retries=3 --start-period=10s \
  CMD curl --fail http://localhost:8080 || exit 1
