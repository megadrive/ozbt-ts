import { Ozbt } from "./Ozbt";

import { Uptime as UptimeCommand } from "./commands/uptime";
import { Lucky as LuckyCommand } from "./commands/lucky";
import {
    ChannelCommandAdd,
    ChannelCommandFind,
    ChannelCommandDelete,
    ChannelCommandEdit,
} from "./commands/channelCommands";
import { HowLongToBeatCommand } from "./commands/howLongToBeat";

const options = require("env-smart").load();
options.channels = options.channels
    .split(/[,|]/)
    .map((channel: string) =>
        !channel.startsWith("#") ? "#" + channel : channel
    )
    .filter((channel: string) => channel !== undefined);

const bot = new Ozbt(options);

bot.commandHandler
    .add(new UptimeCommand())
    .add(new LuckyCommand())
    .add(new ChannelCommandAdd())
    .add(new ChannelCommandEdit())
    .add(new ChannelCommandDelete())
    .add(new ChannelCommandFind())
    .add(new HowLongToBeatCommand());
