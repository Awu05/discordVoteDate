FROM node:20-alpine

RUN apk update && apk upgrade && apk add --no-cache curl yarn git

COPY . .

# RUN git clone https://github.com/Awu05/discordVoteDate.git

# WORKDIR /discordVoteDate

RUN yarn install

CMD ["/bin/sh", "entrypoint.sh"]