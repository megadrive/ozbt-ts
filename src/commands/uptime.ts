"use strict";

import { Command, ICommandRunOptions } from "../Command";
import twas from "twas";

export class Uptime extends Command {
    constructor() {
        super({
            name: "uptime",
            triggers: ["uptime"],
        });
    }

    async run(options: ICommandRunOptions) {
        const { api } = options;
        const [argChannelToCheck, ...restOfArgs] = options.arguments;

        const channelToCheck = argChannelToCheck
            ? argChannelToCheck
            : options.channel.slice(1);

        const streamInfo = await api.get(
            "streams?user_login=" + channelToCheck
        );

        if (streamInfo.length > 0) {
            const when = twas(Date.parse(streamInfo[0].started_at));

            options.say(`${channelToCheck} started streaming about ${when}.`);
        } else {
            options.say(`${channelToCheck} is offline.`);
        }
    }
}
