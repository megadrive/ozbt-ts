import { CommandHandler } from "./CommandHandler";

/**
 * Options for a Command, meant to be overridden.
 */
export interface ICommandOptions {
    /** The name of the command. */
    name: string;

    /**
     * Triggers, first element will be set as the main trigger, with the rest set as aliases.
     */
    triggers: string[];
}

export interface ICommandRunOptions {
    /** List of arguments. `join.(" ")` if you want a string. */
    arguments: string[];

    /** Channel this command originated from, including the # prefix. */
    channel: string;

    /** Reference to the OzbtApi */
    api: any;

    /** Say something to the channel. */
    say: Function;

    /** Reply to the person, prepending @theirusername */
    reply: Function;

    /** The raw message object. */
    raw: any;
}

export enum ECommandPermission {
    EVERYBODY = 0,
    MODERATORS,
    BROADCASTER,
}

/**
 * Represents a Command, which is run after a trigger is seen in chat.
 */
export class Command {
    name: string;
    trigger: string;
    aliases: string[];
    /** CommandHandler, is set when added to a handler. */
    handler: CommandHandler | null;
    options: ICommandOptions;

    /**
     * Creates an instance of Command.
     */
    constructor(options: ICommandOptions) {
        this.options = options;

        this.name = options.name;
        [this.trigger, ...this.aliases] = options.triggers;

        this.handler = null;
    }

    /**
     * Runs the command.
     */
    run(options: ICommandRunOptions) {
        console.warn("You should override this in your inherited Command.");
    }
}
