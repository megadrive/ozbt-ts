"use strict";

import { Command, ICommandRunOptions } from "../Command";
import twas from "twas";
import { URLSearchParams } from "url";
import { EPermission } from "../Permissions";

export class Uptime extends Command {
    constructor() {
        super({
            name: "uptime",
            triggers: ["uptime"],
            permissionThreshold: EPermission.EVERYONE,
        });
    }

    async run(options: ICommandRunOptions) {
        const { api } = options;
        const [argChannelToCheck, ...restOfArgs] = options.arguments;

        const channelToCheck = argChannelToCheck
            ? argChannelToCheck
            : options.channel.slice(1);

        const params = new URLSearchParams();
        params.append("user_login", channelToCheck);
        const streamInfo = await api.get("streams", params);

        if (streamInfo.length > 0) {
            const when = twas(Date.parse(streamInfo[0].started_at));

            options.say(`${channelToCheck} started streaming about ${when}.`);
        } else {
            options.say(`${channelToCheck} is offline.`);
        }
    }
}
