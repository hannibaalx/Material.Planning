#node base image with desired version . version of docker image , not version of node
FROM node:14-alpine3.12 AS build
#ARG ARTIFACTORY_CRED_PAT
# Copy all .json files and src/ directory into the container
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY tslint.json ./
COPY angular.json ./

COPY . /app
#RUN --mount=type=secret,id=npmrc,dst=/root/.npmrc npm ci
#RUN echo "@techops-ui:registry=https://packages.aa.com/artifactory/api/npm/npm-public/" > .npmrc
#RUN echo "@techops:registry=https://packages.aa.com/artifactory/api/npm/npm-public/"> .npmrc
#RUN echo "always-auth=true" > .npmrc
#RUN echo "//packages.aa.com/artifactory/api/npm/npm-public/:_authToken=$ARTIFACTORY_CRED_PAT" > .npmrc 
#
#RUN npm ci
#RUN npm i -g @angular/cli@12.2.17
#RUN npm run build --prod
#RUN rm -f .npmrc
#CMD [ "npm", "start" ]

FROM nginx:latest

COPY --from=build app/dist/ /usr/share/nginx/html

RUN sed -i '9 a \        try_files $uri /index.html;' /etc/nginx/conf.d/default.conf
EXPOSE 80

