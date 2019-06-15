"use strict";

import { Command, ICommandRunOptions } from "../Command";
import { EPermission } from "../Permissions";

/**
 * These commands are for debug only, but feel free to use them as
 * a base for your own commands.
 */

export class TestOwnerOnlyCommand extends Command {
    constructor() {
        super({
            name: "testowner",
            triggers: ["testowner"],
            permissionThreshold: EPermission.OWNER,
        });
    }

    async run(options: ICommandRunOptions) {
        options.reply("This should only fire if you are a owner.");
    }
}

export class TestBroadcasterOnlyCommand extends Command {
    constructor() {
        super({
            name: "testcaster",
            triggers: ["testcaster"],
            permissionThreshold: EPermission.BROADCASTER,
        });
    }

    async run(options: ICommandRunOptions) {
        options.reply("This should only fire if you are the broadcaster.");
    }
}

export class TestModeratorOnlyCommand extends Command {
    constructor() {
        super({
            name: "testmod",
            triggers: ["testmod"],
            permissionThreshold: EPermission.MODERATOR,
        });
    }

    async run(options: ICommandRunOptions) {
        options.reply("This should only fire if you are a moderator.");
    }
}
