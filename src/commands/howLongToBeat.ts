import { Command, ICommandRunOptions } from "../Command";

const hltb = require("howlongtobeat");
const hltbService = new hltb.HowLongToBeatService();

const ignoredGames = ["IRL", "Casino", "Music", "Creative", "Always On"];

export class HowLongToBeatCommand extends Command {
    constructor() {
        super({
            name: "howlong",
            triggers: ["hltb", "howlong", "howlongtobeat"],
        });
    }

    async run(options: ICommandRunOptions) {
        try {
            const searchTerm = options.arguments.join(" ");
            if (searchTerm) {
                const result = await hltbService.search(searchTerm);
                if (result.length) {
                    const { name, gameplayMain } = result[0];
                    options.reply(
                        `according to HowLongToBeat, ${name} will take roughly ${gameplayMain} hours to complete.`
                    );
                } else {
                    options.reply("no games match your search query.");
                }
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
