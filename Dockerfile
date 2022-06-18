# Dockerfile that outline steps to containerize the fragments API microservice

# use node version 16.15.1
FROM node:16.15.1

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

# Define a working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into /app
COPY package*.json /app/

# Copy the package.json and package-lock.json files into the working dir (/app)
COPY package*.json ./

# Install node dependencies defined in package-lock.json
RUN npm install

# Copy src to /app/src/
COPY ./src ./src

# Start the container by running our server
CMD npm start

# We run our service on port 8080
EXPOSE 8080
