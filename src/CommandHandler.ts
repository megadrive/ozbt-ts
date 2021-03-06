import { Command } from "./Command";
import { OzbtApi } from "./Api";
import { Database } from "./Database";
import { CooldownManager } from "./CooldownManager";
import { Permissions, EPermission } from "./Permissions";
import { Logger } from "./Logger";

export interface ICommandHandlerOptions {
    prefix: string;

    cooldownTime?: number;
}

/**
 * Handles all commands for the bot.
 */
export class CommandHandler {
    options: ICommandHandlerOptions;

    commands = new Map<string, Command>();

    cooldowns: CooldownManager;

    api: OzbtApi | null = null;

    /** TwitchJS chat module. */
    chat: any;

    log = Logger.create("CommandHandler");

    constructor(options: ICommandHandlerOptions) {
        this.options = options;

        this.cooldowns = new CooldownManager({
            cooldownTime: options.cooldownTime,
        });

        this.log.info(`Using prefix "${options.prefix}"`);
    }

    /**
     * Verifies if an arbitrary user has permission.
     * @param privmsg PRIVMSG
     * @param command Command to verify.
     * @todo Implement.
     */
    userHasPermission(
        privmsg: any,
        command: Command,
        permission: EPermission
    ): boolean {
        return Permissions.has(privmsg.channel, privmsg, permission);
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
            this.userHasPermission(
                privmsg,
                commandToRun,
                commandToRun.permission
            ) &&
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
                const permission = trigger.permission
                    ? trigger.permission
                    : EPermission.EVERYONE;
                if (
                    database.has(trigger) &&
                    Permissions.has(privmsg.channel, privmsg, permission) &&
                    this.cooldowns.check(privmsg.channel, trigger)
                ) {
                    const responseText = database.get(trigger);
                    const replacedArgsInResponseText = args.reduce(
                        (acc: string, val: string, i: number) => {
                            return acc.replace(
                                new RegExp(`\\{${i + 1}\\}`, "gi"),
                                val
                            );
                        },
                        responseText
                    );
                    this.chat.say(privmsg.channel, replacedArgsInResponseText);
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
            return this.chat.say(channel, message);
        };
    }

    /**
     * Creates a `reply` function that restricts to the triggering channel.
     * @param channel Channel to restrict the command to
     * @returns The created reply function.
     */
    createReplyFunction(channel: string, username: string): Function {
        return (message: string) => {
            return this.chat.say(channel, `@${username}, ${message}`);
        };
    }
}
