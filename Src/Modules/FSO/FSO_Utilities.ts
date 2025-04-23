// ---- Fishsticks Online Systems ----

//Imports
import { MongoClient} from "mongodb";
import Logger from "../Utility/Logger";

//Data
if ( !process.env.RDS ) {
  Logger.log( 'FSO', 'err', "MongoDB connection string not found in environment variables." );
  throw new Error( "MongoDB connection string not found in environment variables." );
}

const client = new MongoClient( process.env.RDS );

//Functions
export async function connect() {
  try {
    await client.connect();
    Logger.log( 'FSO', 'info', "MongoDB connection established." );
  } catch ( error ) {
    Logger.log( 'FSO', 'err', `MongoDB connection failed: ${error}` );
    throw error;
  }
}