// ==== InvalidParameterException ====
// Expecting a parameter but found none

module.exports.InvalidParameterException = class InvalidParameterException extends Error {
    constructor(value) {
        super(value);
        Error.captureStackTrace(this, InvalidParameterException);

        this.name = 'InvalidParameterException';
        this.message = 'Parameter was invalid.';
        this.value = value;
    }
};