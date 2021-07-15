import { client } from "./config/db";
import { hashPassword } from "./config/hash";

async function main () {
    let password = await hashPassword("12345678")
    //  await client.query("insert into users (username, email, password) VALUES ('floyd','floydto@gmail.com',$1)",[password]) 
    //  await client.query("insert into users (username, email, password) VALUES ('martin','martin@gmail.com',$1)",[password]) 
    //  await client.query("insert into users (username, email, password) VALUES ('joseph','joseph@gmail.com',$1)",[password]) 
    await client.query("insert into users (username, email, password) VALUES ('joseph','joseph@gmail.com',$1)",[password]) 
} 

main()

