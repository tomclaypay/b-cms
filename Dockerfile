FROM node:18-alpine

# create destination directory
RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

# copy the app, note .dockerignore
COPY . /usr/src/nuxt-app/
RUN yarn install

# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

ARG API_URL
ENV API_URL ${API_URL}

# build
RUN yarn build

# expose port on container
EXPOSE 3000

# start the app
CMD [ "yarn", "start" ]
