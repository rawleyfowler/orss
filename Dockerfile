FROM node
WORKDIR /orss
COPY package.json /orss/package.json
COPY yarn.lock /orss/yarn.lock

EXPOSE ${ORSS_PORT}
CMD [ -d "node_modules" ] && yarn dev || yarn && yarn dev