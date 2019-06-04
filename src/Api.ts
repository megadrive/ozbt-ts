import fetch from "node-fetch";
import { URLSearchParams } from "url";

interface IOzbtApiOptions {
    clientId: string;
}

export class OzbtApi {
    options: IOzbtApiOptions;

    constructor(options: IOzbtApiOptions) {
        this.options = options;
    }

    async get(endpoint: string, params?: URLSearchParams) {
        try {
            const paramsString = params ? "?" + params.toString() : "";
            const response = await fetch(
                "https://api.twitch.tv/helix/" + endpoint + paramsString,
                {
                    headers: {
                        "Client-ID": this.options.clientId,
                    },
                }
            );

            const json = await response.json();
            return json.data;
        } catch (error) {
            console.warn(error);
        }
    }
}
