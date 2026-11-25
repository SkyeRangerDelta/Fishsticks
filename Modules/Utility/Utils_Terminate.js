// ---- Utils Terminate ----

//Exports
module.exports = {
  terminate
};

//Functions
async function terminate( fishsticks ) {
  if ( fishsticks.FSO_CONNECTION ) {
    await fishsticks.FSO_CONNECTION.close();
  }

  if ( fishsticks ) {

    if ( !fishsticks.CONSOLE ) {
      fishsticks.CONSOLE = await fishsticks.channels.fetch( '420001817825509377' )
        .catch( err => {
          console.log( err, '[FATAL] No console channel was found!' );
        });
    }

    await fishsticks.CONSOLE.send( '[Auxiliary Override] Controller terminating.' );
    fishsticks.destroy();
  }
  else {
    console.log( '[Auxiliary Override] Controller terminating.' );
  }

  process.exit( 1 );
}
