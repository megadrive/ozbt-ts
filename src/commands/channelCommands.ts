"use strict";

import { Command, ICommandRunOptions } from "../Command";
import { Database } from "../Database";

/**
 * Adds a command. Moderators and broadcasters only.
 */
export class ChannelCommandAdd extends Command {
    constructor() {
        super({
            name: "addcom",
            triggers: ["addcom"],
        });
    }

    /**
     * Expected input: !addcom [trigger] [...words]
     */
    async run(options: ICommandRunOptions) {
        try {
            const [trigger, ...text] = options.arguments;
            if (trigger && text.length > 0) {
                // check for command existance
                const commands = new Database().getDatabase(options.channel);
                await commands.defer;

                if (commands.has(trigger)) {
                    throw "Trigger already exists!";
                } else {
                    commands.set(trigger, text.join(" "));
                    options.reply(
                        `command ${trigger} has been created with the response: ${text.join(
                            " "
                        )}`
                    );
                }
            } else {
                throw "Command requires a trigger and text: !addcom [trigger] [text to add]";
            }
        } catch (error) {
            if (error instanceof Error) {
                options.say("JS Error occurred, check console.");
                console.error(error);
            } else {
                options.say(error);
            }
        }
    }
}

/**
 * Deletes a command. Moderators and broadcasters only.
 */
export class ChannelCommandDelete extends Command {
    constructor() {
        super({
            name: "delcom",
            triggers: ["delcom"],
        });
    }

    /**
     * Expected input: !delcom [trigger]
     */
    async run(options: ICommandRunOptions) {
        try {
            const [trigger] = options.arguments;
            if (trigger) {
                const commands = new Database().getDatabase(options.channel);
                await commands.defer;

                if (commands.has(trigger)) {
                    commands.delete(trigger);
                    options.reply(`command ${trigger} has been deleted.`);
                } else {
                    options.reply(`no command with the trigger ${trigger}.`);
                }
            } else {
                throw "Command requires a trigger to delete: !delcom [trigger]";
            }
        } catch (error) {
            if (error instanceof Error) {
                options.say("JS Error occurred, check console.");
                console.error(error);
            } else {
                options.say(error);
            }
        }
    }
}

/**
 * Finds a comment. For everyone!
 */
export class ChannelCommandFind extends Command {
    constructor() {
        super({
            name: "findcom",
            triggers: ["findcom", "find"],
        });
    }

    /**
     * Expected input: !findcom [searchTerm]
     */
    async run(options: ICommandRunOptions) {
        try {
            const [searchTerm] = options.arguments;
            if (searchTerm) {
                // check for command existance
                const commands = new Database().getDatabase(
                    options.channel,
                    true
                );
                await commands.defer;

                if (commands.size > 0) {
                    const matched = commands
                        .keyArray()
                        .map(trigger =>
                            (trigger as string)
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                                ? trigger
                                : undefined
                        )
                        .filter(element => element !== undefined);

                    options.reply(
                        `${matched.length} found: ${matched
                            .slice(0, 30)
                            .join(", ")}`
                    );
                } else {
                    options.reply(
                        `no commands match your search term: ${searchTerm}.`
                    );
                }
            } else {
                throw "Command requires a trigger and text: !find [searchTerm]";
            }
        } catch (error) {
            if (error instanceof Error) {
                options.say("JS Error occurred, check console.");
                console.error(error);
            } else {
                options.say(error);
            }
        }
    }
}
