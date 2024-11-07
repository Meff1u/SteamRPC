process.title = "SteamRPC 1.1.4 by Meffiu";
console.clear();

import SteamUser from 'steam-user';
import axios from 'axios';
import { Client } from "@xhayper/discord-rpc";
import chalk from 'chalk';
import LogUpdate from "log-update";
import fs from 'fs';

import config from './config.json' assert { type: 'json' };

const { friendUsername, friendPassword, apikey, profiles } = config;

let yourSteamID,
    logSteamStatus = chalk.cyan('Attemping to log on...'),
    logRPCStatus = chalk.cyan('Connecting...'),
    logChosenProfile = '',
    logGameDetails = '',
    logDebug = '',
    invalidApi = false;

const titleText = fs.readFileSync('title.txt', 'utf8');

const rpc = new Client({ transport: 'ipc', clientId: '533646105918046219' });

const client = new SteamUser();

const logOnOptions = {
    accountName: friendUsername,
    password: friendPassword
};

const steamImg = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2048px-Steam_icon_logo.svg.png';

refreshWindow();
client.logOn(logOnOptions);

rpc.login();

rpc.on('ready', () => {
    logRPCStatus = chalk.greenBright(`Connected to ${rpc.user.username} (${rpc.user.id})`);
    refreshWindow();
});

client.on('loggedOn', async () => {
    if (!client._loginSession) {
        logDebug += chalk.redBright('Failed to log in, check your credentials in config.json file.\n');
        refreshWindow();
        return;
    }
    if (!apikey || invalidApi) {
        logDebug += chalk.redBright('API key is missing or invalid. Check config.json file.\n');
        refreshWindow();
        return;
    }
    if (profiles.length === 0 || !profiles[0].steamID) {
        logDebug += chalk.redBright('No steam profiles to track in config.json file.\n');
        refreshWindow();
        return;
    }


    logSteamStatus = chalk.greenBright(`Logged in (${client._loginSession._accountName})`);
    refreshWindow();
    client.setPersona(SteamUser.EPersonaState.Online);

    logGameDetails = chalk.yellow('Waiting for friends list...');
    refreshWindow();
    await waitForFriendsList();

    yourSteamID = await chooseProfile(profiles);
    logGameDetails = chalk.yellow('Waiting for game activity...');
    refreshWindow();

    const isFriend = await checkIfFriend(yourSteamID);
    if (!isFriend) {
        logDebug += chalk.yellow(`User with SteamID ${yourSteamID} is not in your friends list.\n`);
        refreshWindow();
        return;
    }

    client.on('user', async (steamID, user) => {
        if (steamID == yourSteamID && user.persona_state && user.gameid != 0) {
            const gameID = user.gameid || 'No game ID';
            const richPresence = user.rich_presence_string || 'Playing a game';

            let gameName = 'No game';
            let gameImage = 'No image';
            if (gameID !== 'No game ID') {
                try {
                    const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${gameID}`);
                    if (response.data[gameID].success) {
                        gameName = response.data[gameID].data.name;
                        gameImage = await getGameIconURL(gameID);

                        await rpc.user?.setActivity({
                            state: richPresence,
                            details: gameName,
                            largeImageKey: gameImage,
                            largeImageText: gameName,
                            smallImageKey: steamImg,
                            smallImageText: 'Steam',
                            instance: false,
                            startTimestamp: Date.now(),
                            buttons: [{ label: 'View game', url: `https://store.steampowered.com/app/${gameID}` }, { label: 'Download SteamRPC', url: `https://github.com/Meff1u/SteamRPC` }]
                        });
                        logGameDetails = chalk.greenBright(`${gameName} | ${richPresence}`);
                        refreshWindow();
                    }
                } catch (error) {
                    logDebug += chalk.redBright(`Error fetching game details: ${error}\n`);
                    refreshWindow();
                }
            }
        }
        if (steamID == yourSteamID && user.gameid == 0) {
            rpc.user?.clearActivity();
            logGameDetails = chalk.yellow('Waiting for game activity...');
            refreshWindow();
        }
    });
});

function waitForFriendsList() {
    return new Promise((resolve) => {
        client.once('friendsList', () => {
        	logGameDetails = chalk.yellow('Friends list received!');
        	refreshWindow();
            resolve();
        });
    });
}

async function checkIfFriend(steamID) {
    try {
        const friends = client.myFriends;
        return friends.hasOwnProperty(steamID);
    } catch (error) {
        logDebug += chalk.redBright(`Error checking friends list: ${error}\n`);
        refreshWindow();
        return false;
    }
}

async function getGameIconURL(gameID) {
    try {
        const response = await axios.get(`https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apikey}&steamid=${yourSteamID}&format=json`);
        if (response.data.response.games) {
            const game = response.data.response.games.find(game => game.appid == gameID);
            if (game) {
                return `https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${gameID}/${game.img_icon_url}.jpg`;
            }
        }
        return null;
    } catch (error) {
        if (error.message.includes('403')) {
            logDebug += chalk.redBright('API key is invalid\n');
            invalidApi = true;
        } else {
            logDebug += chalk.redBright(`Error fetching game icon: ${error}\n`);
        }
        refreshWindow();
    }
}

async function chooseProfile(profiles) {
    if (profiles.length === 1) {
        logChosenProfile = chalk.greenBright(`${profiles[0].name} (${profiles[0].steamID})`);
        return profiles[0].steamID;
    } else {
        let profilesToChoose = '';
        profiles.forEach((profile, index) => {
            profilesToChoose += `[${index + 1}] ${profile.name} (${profile.steamID})\n`;
        });
        console.clear();
        LogUpdate(
            titleText + '\n\n' +
            `${chalk.yellow('[Steam] Choose a steam profile to track:')}\n` +
            profilesToChoose
        );
        const profileIndex = await askForProfileIndex(profiles.length);
        logChosenProfile = chalk.greenBright(`${profiles[profileIndex - 1].name} (${profiles[profileIndex - 1].steamID})`);
        return profiles[profileIndex - 1].steamID;
    }
}

function askForProfileIndex(max) {
    return new Promise((resolve) => {
        process.stdin.once('data', (data) => {
            const index = parseInt(data.toString().trim());
            if (index > 0 && index <= max) {
                resolve(index);
            } else {
                console.log(chalk.redBright('[Steam] Invalid profile index, try again.'));
                resolve(askForProfileIndex(max));
            }
        });
    });
}

function refreshWindow() {
    LogUpdate.clear();
    LogUpdate(
        titleText + '\n\n' +
        `${chalk.white('[Steam status]')} ${logSteamStatus}\n` +
        `${chalk.white('[RPC status]')} ${logRPCStatus}\n` +
        `${chalk.white('[Chosen profile]')} ${logChosenProfile}\n` +
        `${chalk.white('[Game details]')} ${logGameDetails}\n\n` +
        `${chalk.white('[Debug]\n')} ${logDebug}\n\n` +
        `${chalk.gray('Press Ctrl + C to exit')}`
    );
}

client.on('error', (err) => {
    logDebug += chalk.redBright(`Error: ${err}\n`);
    refreshWindow();
});