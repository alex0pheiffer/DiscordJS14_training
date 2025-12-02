## Locally 

### Initial Setup

This repo is written in Typescript, a strongly-typed version of Javascript, and uses tsc (typescript compile) and node (npm / node) programs to generate the scripts and run.

##### Clone the repo (requirements: git installed)

In a terminal:

git clone https://github.com/alex0pheiffer/DiscordJS14_training.git

##### Install required dependencies (requirements: node installed, js installed)

In the terminal, inside the cloned directory (DiscordJS14_training):

npm install -g npm@latest

npm install -g typescript

npm i

##### Create your .env file

Under the main directory, create a new file ".env"

Add the following parameters:

TOKEN=""

CLIENT_ID=""

##### Create your application on discord developer

https://discord.com/developers/applications

Create a new application with the name of your bot.

Copy the application_id into CLIENT_ID (under general) and the token into TOKEN (under bot).

##### Compile the typescript

tsc -p tsconfig.json

##### Run the command to create the existing commands

TBD.

### Complile & Run

In the terminal, in the cloned directory (DiscordJS14_training)

tsc -p tsconfig.json

node ./build/discordjs14_main.js

## Debugging Notes

Note: Modal Interactions & Unknown Interaction Error
When modals time out or are canceled, sometimes an Unknown Interaction Error exception gets thrown and would kill the bot.
This (https://stackoverflow.com/questions/77286277/unknown-interaction-error-with-discord-js-v14-after-cancelling-and-retrying-a-mo) post explains the issue.
It helps knowing the primary causes of DiscordAPIError[10062]: Unknown interaction:
    - Initial response took more than 3 seconds ➞ defer the response *.
    - Wrong interaction object inside a collector.
    - Two processes handling the same command (the first consumes the interaction, so it won't be valid for the other instance)
    * Note: you cannot defer modal or autocomplete value responses

