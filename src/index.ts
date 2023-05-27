import { config } from 'dotenv';

import { djsClient } from './clients/djsClient';
import { guild, user } from './config.json';
import { PresenceUpdateEvent } from './events/presence';
import { ReadyEvent } from './events/readyEvent';
config();

export const globalVariables = {
    guildId: guild,
    user: user,
    callRoute: '/presence',
    port: 3000,
};

// StartUp Fucntion
(async () => {
    await djsClient
        .login(process.env.DISCORD_APP_TOKEN)
        .catch(() => {
            console.log(
                'Failed to authorize the provided discord token, please ensure the token is valid!'
            );
            // eslint-disable-next-line unicorn/no-process-exit
            process.exit(1);
        })
        .then(() => {
            console.log('Authorization to the discord bot was successful!');
        });

    ReadyEvent;
    PresenceUpdateEvent;
})();
