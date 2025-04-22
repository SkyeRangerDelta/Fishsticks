// ---- Plaid ----

exports.run = ( fishsticks, cmd ) => {
    cmd.msg.delete();
    cmd.channel.send( { files: ['./Images/Passives/plaid.gif'] } );
};