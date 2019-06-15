import { Permissions, EPermission } from "../src/Permissions";

const options = require("env-smart").load({
    replace: false,
    directory: __dirname,
});

const channel = "#megadriving";

const privmsg = {
    ownerBroadcaster: {
        channel: "#megadriving",
        username: "megadriving",
        tags: { mod: "0" },
    },
    moderator: {
        channel: "#megadriving",
        username: "iamamoderator",
        tags: { mod: "1" },
    },
    user: {
        channel: "#megadriving",
        username: "a_user",
        tags: { mod: "0" },
    },
};

test("owner of bot should match .env", () => {
    expect(
        Permissions.has(channel, privmsg.ownerBroadcaster, EPermission.OWNER)
    ).toBeTruthy();
});

test("broadcaster should match passed user", () => {
    expect(
        Permissions.has(
            channel,
            privmsg.ownerBroadcaster,
            EPermission.BROADCASTER
        )
    ).toBeTruthy();
});

describe("moderator", () => {
    test("user is broadcaster/moderator", () => {
        expect(
            Permissions.has(
                channel,
                privmsg.ownerBroadcaster,
                EPermission.MODERATOR
            )
        ).toBeTruthy();
        expect(
            Permissions.has(channel, privmsg.moderator, EPermission.MODERATOR)
        ).toBeTruthy();
        expect(
            Permissions.has(channel, privmsg.user, EPermission.MODERATOR)
        ).toBeFalsy();
    });
    test("user is broadcaster/moderator", () => {
        expect(
            Permissions.has(
                channel,
                privmsg.ownerBroadcaster,
                EPermission.MODERATOR
            )
        ).toBeTruthy();
        expect(
            Permissions.has(channel, privmsg.moderator, EPermission.MODERATOR)
        ).toBeTruthy();
        expect(
            Permissions.has(channel, privmsg.user, EPermission.MODERATOR)
        ).toBeFalsy();
    });
});
