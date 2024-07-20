// ---- Passive: Grenade ----

exports.run = ( fishsticks, cmd ) => {
    cmd.msg.delete();
    cmd.channel.send( 'Thou holy hand grenade?', { files: ['./Images/Passives/grenade1.gif'] } );
};