// ---- Passive: I've got time (got) ----

exports.run = ( fishsticks, cmd ) => {
    if ( cmd.msg.content.toLowerCase() === 'got time' || cmd.msg.content.toLowerCase() === 'got time?' ) {
        cmd.msg.reply( { content: `Yeah, I've got time.`, files: ['./Images/Passives/gotTime.gif'] } );
    }
};