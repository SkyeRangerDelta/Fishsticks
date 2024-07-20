// ---- Dark Helmet ----

exports.run = ( fishsticks, cmd ) => {
    if ( cmd.msg.content.toLowerCase() === 'dark helmet' ) {
        cmd.channel.send( { files: ['./Images/Passives/helmet.gif'] } );
    }
};