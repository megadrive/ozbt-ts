import fetch from "node-fetch";

interface IOzbtApiOptions {
    clientId: string;
}

export class OzbtApi {
    options: IOzbtApiOptions;

    constructor(options: IOzbtApiOptions) {
        this.options = options;
    }

    async get(endpoint: string) {
        try {
            const response = await fetch(
                "https://api.twitch.tv/helix/" + endpoint,
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
