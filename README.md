# SteamRPC
Pretty simple script that allows you to display currently playing game on steam with Discord RPC (also with games that supports Steam Rich Presence)

## Notes
To fully use this program, you need to:
- Set your main account to public
  - ![7](https://i.imgur.com/WRBX9A8.png)
- Create a second account (for example, with a temporary email, it will scrape data from the account you play on)
- Add the second, auxiliary account as a friend
- Remove Steam Guard from the second, auxiliary account
  - you don't have to, but it will save you from entering the Steam Guard code every time you run the program
- Enable status visibility in Discord's privacy settings
- Create a [Steam API key](https://steamcommunity.com/dev/apikey)
- Install [Node.js](https://nodejs.org) (v12+)

## Installation
- Download and unzip this repo somewhere on your PC
  - or just use `git clone https://github.com/Meff1u/SteamRPC`
- Install required dependecies
  - `npm i` inside of SteamRPC repo
- Fill config.json file with:
  - `friendUsername`: Username of your second account
  - `friendPassword`: Password of your second account
  - `apikey`: [Steam API key](https://steamcommunity.com/dev/apikey)
  - `yourSteamID`: ID of your Steam account you play on
    - that numbers after steamcommunity.com/profiles/[...]

## Running
After completing all the steps from the "Installation" section, simply run `node .` from the repository. From now on, your Discord status will be updated according to the game you're playing on Steam.

## How it looks like
![1](https://i.imgur.com/d4IwPl8.png)
![2](https://i.imgur.com/8P87g7S.png)
![3](https://i.imgur.com/dr1QUBJ.png)
![4](https://i.imgur.com/kELOkIX.png)

## Known issues
When launching the game for the first time in a while, the game logo might not load (instead, the Steam logo will be visible). This is because the game logo is pulled from the API `api.steampowered.com/IPlayerService/GetRecentlyPlayedGames`, so if the game you intend to play isn't on that list, this issue will occur. The logo should appear correctly the next time you launch the game.

### First run:
![5](https://i.imgur.com/D478eW1.png)
### Second run:
![6](https://i.imgur.com/Hx4Feqi.png)
