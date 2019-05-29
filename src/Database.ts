import Enmap from "enmap";

export class Database {
    /**
     * Gets a database.
     *
     * @param name Name of the database to get.
     * @param fetchAll Whether or not to fetch all entries.
     * @returns Promise resolves when database is ready.
     */
    getDatabase(name: string, fetchAll?: boolean): Enmap {
        return new Enmap({
            name,
            autoFetch: true,
            fetchAll: fetchAll ? fetchAll : false,
        });
    }
}
