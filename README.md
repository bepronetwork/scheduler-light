# Scheduler-Light API
The Scheduler Microservice is responsible from time to time to scroll the Database for info like biggest bet winners, users with most bets etc.. and store them all digested in a easy way for ms-master to acess that data. 
This microservice is built with Agenda and works like a proactive bot to gather complex data and store it inside the "redis" database in mongodb from which ms-master uses to get API calls like this.

# Getting started

### Project Configuration
The first step is to fork the project onto your machine. After fork, enter the project and in its root folder create an `.env` file. In this file, you put all your sensitive and environment info.

The `.env` variables are in this link, section 3: https://www.notion.so/betprotocol/Scheduler-Information-Wrapper-be0b89ae2c83462397a8a7f57ad02063

Note: In the link above is also the step by step of what is needed to create an online machine of the entire project in Heroku.

### Project Installation

After creating the `.env` file, we now open a terminal in the project's root folder and install all project dependencies with the command:

    npm install

Finally, we started the project with:

    npm start

### Docs

- Endpoint documentation: https://betprotocol.readme.io/reference
- NodeJS installation: https://nodejs.org/en/
- General documentation BEPRO.NETWORK operation: https://www.notion.so/betprotocol/BEPRO-NETWORK-c3d96d49ccc04f49b07ea9ea8fd5c149

