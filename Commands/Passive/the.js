// ---- Blanket 'the' handler ----

exports.run = ( fishsticks, cmd ) => {
    const msg = cmd.msg.content.toLowerCase();

    if ( msg.includes( 'meaning of life' ) || msg.includes( 'meaning of everything' ) || msg.includes( 'meaning of the universe' ) ) {
        cmd.channel.send( { files: ['./Images/Passives/42.gif'] } );
    }
    else if ( msg.includes( 'worst' ) ) {
        cmd.channel.send( { files: ['./Images/Passives/dipper.gif'] } );
    }
    else if ( msg.includes( 'duchess approves' ) ) {
        cmd.channel.send( { files: ['./Images/Passives/duchess.gif'] } );
    }
};