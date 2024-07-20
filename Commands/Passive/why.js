// ---- Why ----

exports.run = ( fishsticks, cmd ) => {
    if ( cmd.msg.content === 'why' ) {
        cmd.channel.send( { files: ['./Images/Passives/why.gif'] } );
    }
};