const options = require("env-smart").load();

export enum EPermission {
    EVERYONE = 1,
    MODERATOR,
    BROADCASTER,
    OWNER,
}

/**
 * Manages permissions for users.
 */
export class Permissions {
    static isOwner(privmsg: any) {
        return options.owner === privmsg.username;
    }

    static isBroadcaster(channel: string, privmsg: any) {
        return channel.slice(1) === privmsg.username;
    }

    /**
     * Whether a user id mod.
     * @param tags A user's tags.
     */
    static isMod(tags: any) {
        return tags.mod === "1";
    }

    static has(
        channel: string,
        privmsg: any,
        expectedPermission?: EPermission
    ): boolean {
        if (
            !expectedPermission ||
            expectedPermission === EPermission.EVERYONE
        ) {
            return true;
        }

        // Owner can do owner commands, but not broadcaster commands.
        if (
            expectedPermission === EPermission.OWNER &&
            Permissions.isOwner(privmsg)
        ) {
            return true;
        }

        // Broadcaster can do all commands.
        if (Permissions.isBroadcaster(channel, privmsg)) {
            return true;
        }

        if (
            expectedPermission === EPermission.MODERATOR &&
            (Permissions.isBroadcaster(channel, privmsg) ||
                Permissions.isMod(privmsg.tags))
        ) {
            return true;
        }

        return false;
    }
}
