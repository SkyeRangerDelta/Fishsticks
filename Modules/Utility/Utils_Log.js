// -- Log System --

//Imports
const colors = require( 'colors' );

//Exports
module.exports = {
	log: function log( level, msg ) {
		switch ( level ) {
			case 'info':
				console.log( '[INFO] ' + msg );
				break;
			case 'warn':
				console.log( colors.yellow( '[WARN] ' + msg ) );
				break;
			case 'err':
				console.log( colors.red( '[ERROR] ' + msg ) );
				break;
			case 'proc':
				console.log( colors.green( '[SUCCESS] ' + msg ) );
				break;
			default:
				console.log( colors.bgYellow( '[UNKNOWN ERROR] ' + msg ) );
		}
	}
};