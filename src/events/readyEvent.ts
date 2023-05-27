import { globalVariables } from '..';
import { appRun } from '../app/app';
import { activityTypes, apiData } from '../app/appData';
import { djsClient } from '../clients/djsClient';

export const ReadyEvent = djsClient.on('ready', async () => {
    console.log(`The application ${djsClient.user?.username} is now ready!`);
    const guild = djsClient.guilds.cache.get(globalVariables.guildId);

    if (!guild) throw new Error('The guild required for this was not found!');

    const user = guild?.members.cache.get(globalVariables.user);

    if (!user) throw new Error('The user required for this was not found!');

    apiData.username = user.user.username;
    apiData.image = user.user.displayAvatarURL({ extension: 'png' });

    if (user.presence?.activities) {
        if (user.presence.activities[0]?.name) {
            const activityType = user.presence?.activities[0].type
                ? // eslint-disable-next-line sonarjs/no-nested-template-literals
                  `${activityTypes[`${user.presence?.activities[0].type}`]}`
                : '';

            apiData.activity = `${activityType}${user.presence?.activities[0]?.state}`;
        }

        apiData.status =
            user.presence?.clientStatus?.desktop ||
            user.presence?.clientStatus?.mobile ||
            user.presence?.clientStatus?.web ||
            'offline';
    }

    appRun();
});
