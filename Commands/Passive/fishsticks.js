// ---- Passive: Fishsticks ----

exports.run = ( fishsticks, cmd ) => {
    if ( !cmd.msg.content.length > 10 ) {
        cmd.msg.delete();
        cmd.channel.send( { content: 'Mmmm, fishsticks....', files: ['./Images/Passives/fsimg.jpg'] } );
    }
};