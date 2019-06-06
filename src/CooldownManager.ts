import { Command } from "./Command";

interface ICooldownManagerOptions {
    /** In seconds. Default: 30 */
    cooldownTime?: number;
}

export class CooldownManager {
    cooldowns = new Map<string, Map<string, number>>();
    cooldownTime: number = 30;

    constructor(options?: ICooldownManagerOptions) {
        if (options && options.cooldownTime) {
            this.cooldownTime = options.cooldownTime;
        }
    }

    /**
     * Set a channel's command cooldown.
     * @param channel Channel the command belongs to
     * @param command Command trigger to check
     */
    set(channel: string, command: string): void {
        if (!this.cooldowns.has(channel)) {
            this.cooldowns.set(channel, new Map());
        }

        const commands = this.cooldowns.get(channel) as Map<string, number>;
        commands.set(command, Date.now());
    }

    /**
     * Check if a channel's command is oaky to use.
     * @param channel Channel the command belongs to
     * @param command Command trigger to check
     */
    check(channel: string, command: string): boolean {
        /**
         * Channel has no records, no commands used since startup.
         * Early fail.
         */
        if (!this.cooldowns.has(channel)) {
            return true;
        }

        /**
         * If no command record, hasn't been used since startup.
         * Early fail.
         */
        const commands = this.cooldowns.get(channel);
        if (commands) {
            const cooldown = commands.get(command);
            if (cooldown) {
                const difference = (Date.now() - cooldown) / 1000;
                return difference > this.cooldownTime;
            } else {
                // No record.
                return true;
            }
        }

        return true;
    }
}
