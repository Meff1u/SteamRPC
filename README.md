<p align="center">
  <img src="https://github.com/Meff1u/SteamRPC/blob/main/imgs/SteamRPC.png" width="512" alt="SteamRPC" /><br>
  Pretty simple script that allows you to display currently playing game on steam with Discord RPC (also with games that supports Steam Rich Presence)
</p>
<p align="center">
  <a title="Contributors" href="https://github.com/Meff1u/SteamRPC/contributors" target="_blank">
    <img src="https://img.shields.io/github/contributors/Meff1u/SteamRPC.svg?color=blue&label=Contributors&style=for-the-badge" alt="Contributors" />
  </a>
  <a title="Release" href="https://github.com/Meff1u/SteamRPC/releases" target="_blank">
    <img src="https://img.shields.io/github/release/Meff1u/SteamRPC.svg?color=blueviolet&label=Release&style=for-the-badge" alt="Latest Release" />
  </a>
  <a title="Downloads" href="https://github.com/Meff1u/SteamRPC/downloads" target="_blank">
    <img src="https://img.shields.io/github/downloads/Meff1u/SteamRPC/total?color=green&label=Downloads&style=for-the-badge" alt="Downloads" />
  </a><br>
  <a title="Open Issues" href="https://github.com/Meff1u/SteamRPC/issues" target=_blank">
    <img src="https://img.shields.io/github/issues-raw/Meff1u/SteamRPC.svg?color=red&label=Open%20Issues&style=for-the-badge" alt="Open Issues" />
  </a>
  <a title="Closed Issues" href="https://github.com/Meff1u/SteamRPC/issues" target=_blank">
    <img src="https://img.shields.io/github/issues-closed-raw/Meff1u/SteamRPC.svg?color=green&label=Closed%20Issues&style=for-the-badge" alt="Closed Issues" />
  </a><br>
  <a title="Download SteamRPC" href="https://github.com/Meff1u/SteamRPC/releases/latest" target="_blank">
    <img src="https://github.com/Meff1u/SteamRPC/blob/main/imgs/download_button.png" alt="Download SteamRPC" />
  </a>
</p>

---

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
- [Download](https://github.com/Meff1u/SteamRPC/releases/latest) and unzip this repo somewhere on your PC
  - or just use `git clone https://github.com/Meff1u/SteamRPC`
- Install required dependecies
  - `npm i` inside of SteamRPC repo
- Fill config.json file with:
  - `friendUsername`: Username of your second account
  - `friendPassword`: Password of your second account
  - `apikey`: [Steam API key](https://steamcommunity.com/dev/apikey)
  - `profiles`:
    - `name`: Name of profile (can be whatever)
    - `steamID`: ID of your Steam account you want to track

## Running
After completing all the steps from the "Installation" section, click RUN.bat file in the repository (or just run `node .` in the repo directory). From now on, your Discord status will be updated according to the game you're playing on Steam.

## How it looks like
![1](https://i.imgur.com/d4IwPl8.png)
![2](https://i.imgur.com/8P87g7S.png)
![3](https://i.imgur.com/dr1QUBJ.png)
![4](https://i.imgur.com/kELOkIX.png)

## Example config.json file with more than one profile
```json
{
    "friendUsername": "secondaccount",
    "friendPassword": "mySuperSecretPassword",
    "apikey": "XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "profiles": [
        {
            "name": "Profile 1",
            "steamID": "73395478392175938"
        },
        {
            "name": "Profile 2",
            "steamID": "74742228884829948"
        }
    ]
}
```

## Known issues
- When launching the game for the first time in a while, the game logo might not load (instead, the Steam logo will be visible). This is because the game logo is pulled from the API `api.steampowered.com/IPlayerService/GetRecentlyPlayedGames`, so if the game you intend to play isn't on that list, this issue will occur. The logo should appear correctly the next time you launch the game.

  ### First run:
  ![5](https://i.imgur.com/D478eW1.png)
  ### Second run:
  ![6](https://i.imgur.com/Hx4Feqi.png)

- Setting an invalid Steam API key may cause the entire UI to disappear. I’m not sure why this happens, so make sure to use the correct key XD
