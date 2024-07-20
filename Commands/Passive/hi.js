// ---- Passive: Hi ----

exports.run = ( fishsticks, cmd ) => {
    if ( cmd.msg.content.length > 2 ) {
        cmd.channel.send( 'Hi There!' );
    }
};