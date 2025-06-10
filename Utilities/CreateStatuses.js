// Adds all these statuses to the database

// Imports
import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

// Do the stuff
async function main() {
  config();

  const client = new MongoClient( process.env.MONGO_URI );
  await client.connect()

  if ( !client ) {
    console.error( 'Database connection failed!' );
    process.exit( 1 );
  }

  const db = client.db( 'FishsticksOnline' );

  const statusObjects = [
    { name: 'Contemplating 42.', type: 'custom' },
    { name: 'Why are you looking at my status?', type: 'custom' },
    { name: 'for /help', type: 'watching' }
  ];

  await db.collection( 'FSO_Status' ).insertMany( statusObjects );
}

main().then( r => {
  console.log( 'Statuses created successfully!' );
  process.exit( 0 );
} );
