# Dockerfile
FROM node:alpine

# create & set working directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# install dependencies
RUN npm install

# copy source files
COPY . .

# build the app
RUN npm run build

# start app
EXPOSE 9087
CMD npm run start
