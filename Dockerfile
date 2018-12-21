FROM node:alpine
WORKDIR /home/node/app
COPY package.json ./
RUN npm install && \
    npm cache clean --force
COPY server.js ./
CMD node server.js
