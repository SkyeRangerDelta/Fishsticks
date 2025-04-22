// ---- Passive: Schwartz ----

exports.run = ( fishsticks, cmd ) => {
    cmd.msg.delete();
    cmd.channel.send( { content: 'May da schwartz be wid you.', files: ['./Images/Passives/schwartz.gif'] } );
};