const SteamUser = require('steam-user');
const axios = require('axios');
const { Client } = require("@xhayper/discord-rpc");

const { friendUsername, friendPassword, apikey, yourSteamID } = require('./config.json');

const rpc = new Client({ transport: 'ipc', clientId: '533646105918046219' });

const client = new SteamUser();

const logOnOptions = {
    accountName: friendUsername,
    password: friendPassword
};

const steamImg = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2048px-Steam_icon_logo.svg.png';

console.log('[Steam] Attempting to log on...');
client.logOn(logOnOptions);

rpc.login();

rpc.on('ready', () => {
    console.log('[RPC] Discord RPC connected');
});

client.on('loggedOn', () => {
    console.log('[Steam] Logged in');
    client.setPersona(SteamUser.EPersonaState.Online);
});

client.on('user', async (steamID, user) => {
    console.log(`[Steam] User data received for ${user.player_name} (${steamID})`);
    if (steamID == yourSteamID && user.persona_state && user.gameid != 0) {
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
                    console.log('[RPC] Updated presence with game details:', gameName);
                }
            } catch (error) {
                console.error('[Steam] Error fetching game details:', error);
            }
        }
    }
    if (steamID == yourSteamID && user.gameid == 0) {
        rpc.user?.clearActivity();
    }
});

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
        console.error('[Steam] Error fetching game icon:', error);
    }
}

client.on('error', (err) => {
    console.error('Error:', err);
});