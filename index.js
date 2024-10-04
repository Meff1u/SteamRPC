const SteamUser = require('steam-user');
const axios = require('axios');
const { Client } = require("@xhayper/discord-rpc");
const chalk = require('chalk');

const { friendUsername, friendPassword, apikey, profiles } = require('./config.json');

let yourSteamID;

const rpc = new Client({ transport: 'ipc', clientId: '533646105918046219' });

const client = new SteamUser();

const logOnOptions = {
    accountName: friendUsername,
    password: friendPassword
};

const steamImg = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2048px-Steam_icon_logo.svg.png';

console.log(chalk.cyan('[Steam] Attempting to log on...'));
client.logOn(logOnOptions);

rpc.login();

rpc.on('ready', () => {
    console.log(chalk.greenBright(`[RPC] Discord RPC connected to ${rpc.user.username} (${rpc.user.id})`));
});

client.on('loggedOn', async () => {
    console.log(chalk.greenBright('[Steam] Logged in'));
    client.setPersona(SteamUser.EPersonaState.Online);

    await waitForFriendsList();
    yourSteamID = await chooseProfile(profiles);
    console.log(chalk.greenBright(`[Steam] Tracking profile with Steam ID: ${yourSteamID}`));

    const isFriend = await checkIfFriend(yourSteamID);
    if (!isFriend) {
        console.log(chalk.yellow(`[Steam] User with SteamID ${yourSteamID} is not in your friends list.`));
        return;
    }

    client.on('user', async (steamID, user) => {
        if (steamID == yourSteamID && user.persona_state && user.gameid != 0) {
            console.log(chalk.cyan(`[Steam] User data received for ${user.player_name} (${steamID})`));
            const gameID = user.gameid || 'No game ID';
            const richPresence = user.rich_presence_string;

            let gameName = 'No game';
            let gameImage = 'No image';
            if (gameID !== 'No game ID') {
                try {
                    const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${gameID}`);
                    if (response.data[gameID].success) {
                        gameName = response.data[gameID].data.name;
                        gameImage = await getGameIconURL(gameID);

                        await rpc.user?.setActivity({
                            state: richPresence || 'Playing a game',
                            details: gameName,
                            largeImageKey: gameImage,
                            largeImageText: gameName,
                            smallImageKey: steamImg,
                            smallImageText: 'Steam',
                            instance: false,
                            startTimestamp: Date.now()
                        });
                        console.log(chalk.greenBright('[RPC] Updated presence with game details:', gameName));
                    }
                } catch (error) {
                    console.error(chalk.redBright('[Steam] Error fetching game details:', error));
                }
            }
        }
        if (steamID == yourSteamID && user.gameid == 0) {
            rpc.user?.clearActivity();
        }
    });
});

function waitForFriendsList() {
    return new Promise((resolve) => {
        client.once('friendsList', () => {
            console.log(chalk.greenBright('[Steam] Friends list received'));
            resolve();
        });
    });
}

async function checkIfFriend(steamID) {
    try {
        const friends = client.myFriends;
        return friends.hasOwnProperty(steamID);
    } catch (error) {
        console.error(chalk.redBright('[Steam] Error checking friends list:', error));
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
        console.error(chalk.redBright('[Steam] Error fetching game icon:', error));
    }
}

async function chooseProfile(profiles) {
    if (profiles.length === 1) {
        return profiles[0].steamID;
    } else {
        console.log(chalk.yellow('[Steam] Choose a steam profile to track:'));
        profiles.forEach((profile, index) => {
            console.log(chalk.yellow(`[${index + 1}] ${profile.name} (${profile.steamID})`));
        });
        const profileIndex = await askForProfileIndex(profiles.length);
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

client.on('error', (err) => {
    console.error(chalk.redBright('Error:', err));
});