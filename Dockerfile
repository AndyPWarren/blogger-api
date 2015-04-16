#
# FirstMate Core Docker File
# Builds a docker image to run the FirstMate-API application, which includes API services
#

FROM spectrakey/nodejs

# Install app dependencies
WORKDIR /app
ADD package.json /app/package.json
RUN npm install

# Bundle app source
ADD . /app


EXPOSE  1337
CMD ["npm", "start"]
