// ---- Why ----

exports.run = ( fishsticks, cmd ) => {
    const msg = cmd.msg.content.toLowerCase();
    if ( msg === `i'm awesome` ) {
        cmd.channel.send( { files: ['./Images/Passives/awesome.gif'] } );
    }
};