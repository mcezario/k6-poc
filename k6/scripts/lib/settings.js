import sql from 'k6/x/sql';

export async function populateKVsFromDatabase(kv, db) {
    let settings = sql.query(db, "SELECT key, value FROM settings;");
    for (const row of settings) {
        await kv.set(row.key, row.value);
    }
}