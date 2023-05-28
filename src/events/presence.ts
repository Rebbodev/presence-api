import { globalVariables } from '..';
import { io } from '../app/app';
import { activityTypes, apiData } from '../app/appData';
import { djsClient } from '../clients/djsClient';

export const PresenceUpdateEvent = djsClient.on(
    'presenceUpdate',
    async (oldPresence, newPresence) => {
        if (newPresence.user?.id !== globalVariables.user) return;

        apiData.username = newPresence.user.username;
        apiData.image = newPresence.user.displayAvatarURL({ extension: 'png' });

        if (newPresence.activities) {
            if (newPresence.activities[0]?.name) {
                const activityType = newPresence.activities[0].type
                    ? // eslint-disable-next-line sonarjs/no-nested-template-literals
                      `${activityTypes[`${newPresence.activities[0].type}`]}`
                    : '';

                apiData.activity = `${activityType}${newPresence.activities[0]?.state}`;
            }

            apiData.status =
                newPresence.clientStatus?.desktop ||
                newPresence.clientStatus?.mobile ||
                newPresence.clientStatus?.web ||
                'offline';
        }

        io.emit('presence', apiData);
    }
);
