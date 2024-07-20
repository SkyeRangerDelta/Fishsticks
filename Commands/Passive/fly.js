// ---- Fly you Fools ----

exports.run = ( fishsticks, cmd ) => {
    const msg = cmd.msg.content.toLowerCase();
    if ( msg === 'fly you fools' || msg === 'fly you fools!' ) {
        cmd.channel.send( { files: ['./Images/Passives/flyFools.gif'] } );
    }
};