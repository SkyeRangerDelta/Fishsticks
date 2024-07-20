// ---- So It Begins ----

exports.run = ( fishsticks, cmd ) => {
    const msg = cmd.msg.content.toLowerCase();
    if ( msg === 'so it begins' || msg === 'waste of time' ) {
        cmd.channel.send( { files: ['./Images/Passives/timeWaste.gif'] } );
    }
};