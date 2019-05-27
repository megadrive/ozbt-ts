import Enmap from "enmap";

export class Database {
    /**
     * Gets a database.
     *
     * @param name Name of the database to get.
     * @returns Promise resolves when database is ready.
     */
    getDatabase(name: string): Enmap {
        const enmap = new Enmap({
            name,
            autoFetch: true,
            fetchAll: false,
        });
        return enmap;
    }
}
