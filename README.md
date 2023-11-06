# discordVoteDate

A discord bot to help people decide on a date and time to do an activity. The bot can only display a max of 10 options.

![image](https://github.com/Awu05/discordVoteDate/assets/12676790/a0e0200a-a9cc-4794-9d2a-21614e910dbb)


## Description

This bot was mainly intented to be used in Maplestory and is centered around the server reset time.
But it can be adapted to be used for other things or in other games too.

## Getting Started

### Dependencies

* Requirements: Docker
  * If you want to compile and/or modify the code, you will need NodeJS installed.

### Installing and Executing

* Clone the repo `git clone https://github.com/Awu05/discordVoteDate.git`
* Go into the repo you just cloned `cd discordVoteDate`
* Modify the docker-compose2.yaml file and fill in the missing fields: "TOKEN" and "CLIENT_ID". You will also need to rename the docker-compose2.yaml file to `docker-compose.yaml`
  * You can find the token and client_id by creating a discord developer account and then creating a new bot.
* Once you have updated the docker-compose file, you can run the docker-compose with `docker-compose up -d` to start the docker container.
