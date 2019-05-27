import { Ozbt } from "./Ozbt";

import { Uptime } from "./commands/uptime";
import { Lucky } from "./commands/lucky";
import {
    ChannelCommandAdd,
    ChannelCommandFind,
    ChannelCommandDelete,
} from "./commands/channelCommands";
import { HowLongToBeatCommand } from "./commands/howLongToBeat";

const config = require("../config.json");

const bot = new Ozbt(config);

bot.commandHandler
    .add(new Uptime())
    .add(new Lucky())
    .add(new ChannelCommandAdd())
    .add(new ChannelCommandDelete())
    .add(new ChannelCommandFind())
    .add(new HowLongToBeatCommand());
