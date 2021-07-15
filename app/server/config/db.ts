import pg from 'pg';
import dotenv from 'dotenv';
//dotenv.config({ path: '../.env' });
dotenv.config({ path: '.env' });//the path is relative to the run file.

//setup PostgresSQL database and connect.
export const client = new pg.Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? + process.env.DB_PORT : 5432, 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
client.connect()
    .then(() => console.log(`connected to database: ${process.env.DB_NAME}`))
    .catch(err => {console.error('failed to connect database', err.stack)});

async function testDBConnect() {
    const res = await client.query('SELECT $1::text as message', ['test db query success'])
    console.log(res.rows[0].message) // test db query
    // await client.end()
}
testDBConnect()
