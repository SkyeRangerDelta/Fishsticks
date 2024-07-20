// ==== fsoValidationException ====
// Expecting a parameter but found none

module.exports.fsoValidationException = class fsoValidationException extends Error {
    constructor( value ) {
        super( value );
        Error.captureStackTrace( this, fsoValidationException );

        this.name = 'fsoValidationException';
        this.message = 'FSO validation checks failed.';
        this.value = value;
    }
};