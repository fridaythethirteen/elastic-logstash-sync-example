FROM node:10.9.0

#WORKDIR /usr/app

#RUN npm install -g webpack webpack-cli rimraf

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY tsconfig.prod.json ./

RUN yarn install

#RUN yarn build

# Bundle app source
COPY . .

EXPOSE 8888 80
