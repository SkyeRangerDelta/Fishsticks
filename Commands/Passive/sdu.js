// ---- Passive: SDU ----

exports.run = ( fishsticks, cmd ) => {
    cmd.msg.delete();
    cmd.channel.send( { content: '*In the criminal justice system, bot based offenses are considered especially heinous. In this Discord, the dedicated detectives who investigate these vicious felonies are members of an elite squad known as the Special Developers Unit. These are their stories.* GLUNG GLUNG', files: ['./Images/Passives/fs_defense.png'] } );
};