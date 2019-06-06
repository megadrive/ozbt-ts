import { Command } from "./Command";
import { OzbtApi } from "./Api";
import { Database } from "./Database";
import { CooldownManager } from "./CooldownManager";

export interface ICommandHandlerOptions {
    prefix: string;
}

/**
 * Handles all commands for the bot.
 */
export class CommandHandler {
    options: ICommandHandlerOptions;

    commands = new Map<string, Command>();

    cooldowns = new CooldownManager();

    api: OzbtApi | null = null;

    /** TwitchJS chat module. */
    chat: any;

    constructor(options: ICommandHandlerOptions) {
        this.options = options;
    }

    /**
     * Verifies if an arbitrary user has permission.
     * @param userTags the `tags` property from a PRIVMSG event.
     * @param command Command to verify.
     * @todo Implement.
     */
    userHasPermission(userTags: any, command: Command): boolean {
        return true;
    }

    /**
     * Adds a command to the handler.
     * @param command Command instance to add.
     */
    add(command: Command): CommandHandler {
        this.commands.set(command.name, command);
        return this;
    }

    /**
     * Checks a message for a trigger.
     * @param messageToCheck
     * @returns {Command|null} the command found or `null` on no matches.
     */
    check(messageToCheck: string): Command | null {
        const commandsArray = Array.from(this.commands);

        const matchedCommands = commandsArray
            .map((mappedCommand: [string, Command]) => {
                const command = mappedCommand[1];
                const triggers = [command.trigger, ...command.aliases];
                const found = triggers.some(trigger => {
                    return messageToCheck.startsWith(
                        `${this.options.prefix}${trigger}`
                    );
                });
                if (found) {
                    return command;
                }
            })
            .filter(command => {
                return command !== undefined;
            }) as Command[];

        return matchedCommands.length ? matchedCommands[0] : null;
    }

    /**
     * `TwitchJS` onMessage.
     *
     * `this` in this context refers to the `CommandHandler` object.
     * @param privmsg PRIVMSG supplied by `TwitchJS`.
     */
    onMessage(privmsg: any): void {
        const commandToRun = this.check(privmsg.message);
        const [trigger, ...args] = privmsg.message.split(" ");

        if (
            commandToRun &&
            this.userHasPermission(privmsg.badges, commandToRun) &&
            this.cooldowns.check(privmsg.channel, commandToRun.trigger)
        ) {
            commandToRun.run({
                api: this.api,
                arguments: args,
                channel: privmsg.channel,
                raw: privmsg,
                say: this.createSayFunction(privmsg.channel),
                reply: this.createReplyFunction(
                    privmsg.channel,
                    privmsg.username
                ),
            });

            this.cooldowns.set(privmsg.channel, commandToRun.trigger);
        } else {
            // Could be a custom command! Wowser!
            const database = new Database().getDatabase(privmsg.channel);
            database.defer.then(() => {
                if (
                    database.has(trigger) &&
                    this.cooldowns.check(privmsg.channel, trigger)
                ) {
                    const responseText = database.get(trigger);
                    this.chat.say(privmsg.channel, responseText);
                    this.cooldowns.set(privmsg.channel, trigger);
                }
            });
        }
    }

    /**
     * Creates a `say` function that restricts to the triggering channel.
     * @param channel Channel to restrict the command to
     * @returns The created say function.
     */
    createSayFunction(channel: string): Function {
        return (message: string, mention?: string) => {
            if (mention) message += ` @${mention.replace(/@/g, "")}`;
            this.chat.say(channel, message);
        };
    }

    /**
     * Creates a `reply` function that restricts to the triggering channel.
     * @param channel Channel to restrict the command to
     * @returns The created reply function.
     */
    createReplyFunction(channel: string, username: string): Function {
        return (message: string) => {
            this.chat.say(channel, `@${username}, ${message}`);
        };
    }
}
