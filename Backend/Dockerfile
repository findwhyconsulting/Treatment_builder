FROM node:22.11.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE ${PORT}
CMD ["npm", "start"]



# FROM node:22.11.0
# RUN mkdir -p /var/www/treatmentbuilderbackend/
# COPY package*.json ./var/www/treatmentbuilderbackend/
# WORKDIR /var/www/treatmentbuilderbackend/
# RUN npm install -g npm@10.9.0 nodemon
# RUN npm install
# ENV PATH /var/www/treatmentbuilderbackend/node_modules/.bin:$PATH
# COPY . .
# EXPOSE ${PORT}
# CMD ["npm", "bin/start.js"]
