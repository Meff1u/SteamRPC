## SteamRPC
Pretty simple script that allows you to display currently playing game on steam with Discord RPC (also with games that supports Steam Rich Presence)

## To fully use this program, you need to have:
- A second account without Steam Guard (created, for example, with a temporary email, it will scrape data from the account you play on)
- A created [Steam API key](https://steamcommunity.com/dev/apikey) (to retrieve game information)
- [Node.js](https://nodejs.org) (v12+)

## Installation
- Download and unzip this repo somewhere on your PC (or just use `git clone https://github.com/Meff1u/SteamRPC`)
- Install required dependecies (`npm i` inside of SteamRPC repo)
- Fill config.json file with:
  - `friendUsername`: Username of your second account
  - `friendPassword`: Password of your second account
  - `apikey`: [Steam API key](https://steamcommunity.com/dev/apikey)
  - `yourSteamID`: ID of your Steam account you play on (that numbers after https://steamcommunity.com/profiles/[...])

## Running
After completing all the steps from the "Installation" section, simply run `node .` from the repository. From now on, your Discord status will be updated according to the game you're playing on Steam.

## Notes
For the program to work fully, you need to:
- Set your main account to public
- Add the second, auxiliary account as a friend
- Remove Steam Guard from the second, auxiliary account (you don't have to, but it will save you from entering the Steam Guard code every time you run the program)
- Enable status visibility in Discord's privacy settings
- Create a [Steam API key](https://steamcommunity.com/dev/apikey)
