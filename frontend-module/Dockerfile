FROM node:10.15.0

# Create app directory
RUN mkdir -p /src/app
WORKDIR /src/app

# Install app dependencies
COPY package.json /src/app/
COPY . /src/app

RUN npm install
#RUN npm install -g http-server

# Bundle app source

# Build and optimize react app
#RUN npm run build

EXPOSE 3000

# defined in package.json
#CMD [ "npm", "run", "start:server" ]
CMD [ "npm", "start" ]
