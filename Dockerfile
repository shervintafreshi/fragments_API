# Dockerfile that outline steps to containerize the fragments API microservice

# use node version 16.15.1
FROM node:16.15.1-alpine

# Install lightweight init system
RUN apk add dumb-init
RUN apk add curl

# Metadata
LABEL maintainer="Shervin Tafreshipour <stafreshipour@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# Default to port 8080
ENV port=8080

# Reduce npm logging level when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Optimizing Node.js tooling for production
ENV NODE_ENV production

# Define a working directory
WORKDIR /app

# Ensure 'node' user has access to working directory
RUN chown -R node:node /app

# Copy the package.json and package-lock.json files into /app
COPY --chown=node:node package*.json /app/

# Install node dependencies defined in package-lock.json
RUN npm ci --only=production

# Copy src to /app/src/
COPY --chown=node:node ./src ./src

# Copy our HTPASSWD file
COPY --chown=node:node ./tests/.htpasswd ./tests/.htpasswd

# Define a non-root user
USER node

# Start the container by running our server
CMD ["dumb-init", "node", "server.js"]

# We run our service on port 8080
EXPOSE 8080

# Define a healthcheck rountine
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl --fail localhost:4444 || exit 1
