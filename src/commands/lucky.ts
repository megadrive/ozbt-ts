"use strict";

import { Command, ICommandRunOptions } from "../Command";
import Chance from "chance";
const chance = new Chance();

export class Lucky extends Command {
    constructor() {
        super({
            name: "lucky",
            triggers: ["lucky"],
        });
    }

    run(options: ICommandRunOptions) {
        const [bet, ...args] = options.arguments;
        const acceptableBets = ["heads", "tails"];

        const hoorays = ["Wowsers!", "Hooray!", "jfc"];

        if (!bet || !acceptableBets.includes(bet.toLowerCase())) {
            options.say("You must bet heads or tails! Example: !lucky heads");
            return;
        }

        let heads = 0;
        let tails = 0;

        for (var i = 0; i < 10000; i++) {
            const result = chance.coin();
            if (result === "heads") {
                heads++;
            } else {
                tails++;
            }
        }

        let say = `${
            options.raw.username
        } bet on ${bet.toLowerCase()} and ... `;

        if (heads > tails && bet.toLowerCase() === "heads") {
            say += `won!`;
        } else if (heads < tails && bet.toLowerCase() === "tails") {
            say += `won!`;
        } else {
            say += "lost..";
        }

        say += ` ${
            hoorays[chance.integer({ min: 0, max: hoorays.length - 1 })]
        } Results - heads: ${heads}, tails: ${tails}.`;

        options.say(
            `/timeout ${
                options.raw.username
            } 1s In russia, roulette roulettes you.`
        );
        options.say(say);
    }
}
