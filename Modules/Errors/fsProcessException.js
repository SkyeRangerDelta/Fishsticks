// ==== fsProcessException ====
// Expecting a parameter but found none

module.exports.fsProcessException = class fsProcessException extends Error {
    constructor( value ) {
        super( value );
        Error.captureStackTrace( this, fsProcessException );

        this.name = 'fsProcessException';
        this.message = 'A required Fishsticks process has caught an error.';
        this.value = value;
    }
};