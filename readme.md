## Locally 

### Initial Setup

Clone the repo (requirements: git installed)



### Complile & Run

directory: D:/Important_Things/Applications/DiscordJS/BarbieTrivia/

tsc -p tsconfig.json    // build the typescript

node ./build/main.js




## Debugging Notes

Note: Modal Interactions & Unknown Interaction Error
When modals time out or are canceled, sometimes an Unknown Interaction Error exception gets thrown and would kill the bot.
This (https://stackoverflow.com/questions/77286277/unknown-interaction-error-with-discord-js-v14-after-cancelling-and-retrying-a-mo) post explains the issue.
It helps knowing the primary causes of DiscordAPIError[10062]: Unknown interaction:
    - Initial response took more than 3 seconds ➞ defer the response *.
    - Wrong interaction object inside a collector.
    - Two processes handling the same command (the first consumes the interaction, so it won't be valid for the other instance)
    * Note: you cannot defer modal or autocomplete value responses
