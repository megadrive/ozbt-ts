import { CommandHandler } from "./CommandHandler";
import { OzbtApi } from "./Api";
import { Logger } from "./Logger";

const TwitchJS = require("twitch-js").default; // awaiting types

interface IOzbtOptions {
    /** Whether to connect immediately. */
    connectImmediately?: boolean;

    /** Prefix to use for command triggers. Default: ! */
    prefix?: string;

    /** oauth string if you want the bot to say, timeout, ban etc.. */
    oauth?: string;

    /** username of the account if using oauth */
    username?: string;

    /** Channels to join. */
    channels?: string[];

    /** Client-ID for API requests. */
    clientId?: string;

    /** Owner username of the bot. */
    owner?: string;

    /** Default cooldown period between commands in seconds. */
    commandCooldown: number;
}

export class Ozbt {
    commandHandler: CommandHandler;
    twitch: any;
    chatConstants: any;
    api: OzbtApi | null = null;
    owner: string | null = null;
    log = Logger.create("ozbt");

    constructor(options: IOzbtOptions) {
        if (options.prefix === undefined) {
            options.prefix = "!";
        }

        this.commandHandler = new CommandHandler({
            prefix: options.prefix,
        });

        // Log in to Twitch
        const { chat, chatConstants } = new TwitchJS({
            token: options.oauth,
            username: options.username,
        });
        this.twitch = chat;
        this.chatConstants = chatConstants;

        if (options.owner) {
            this.owner = options.owner;
        }

        if (options.clientId) {
            this.commandHandler.api = new OzbtApi({
                clientId: options.clientId,
            });
        }
        this.commandHandler.chat = chat;

        if (options.connectImmediately) {
            this.connect().then(() => {
                this.log.info(`Logged in as ${options.username}.`);

                if (options.channels) {
                    this.joinChannels(options.channels);
                }
            });
        }
    }

    async connect(): Promise<void> {
        try {
            await this.twitch.connect();
            // Any message on a channel.
            this.twitch.on("PRIVMSG", (privmsg: any) => {
                this.commandHandler.onMessage.call(
                    this.commandHandler,
                    privmsg
                );
            });
        } catch (error) {
            this.log.error(`Could not connect to Twitch: ${error}`);
            process.exit(1);
        }
    }

    async joinChannels(channels: string[]): Promise<void> {
        try {
            channels.forEach(async channel => {
                this.log.info(`Joining ${channel}`);
                await this.twitch.join(channel);
                this.log.info(`Joined  ${channel}`);
            });
        } catch (error) {
            throw new Error("Could not join channels: " + channels);
        }
    }
}
