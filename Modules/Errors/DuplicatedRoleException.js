// ==== DuplicatedRoleExcpetion ====
// Should be thrown when the role checker determines a duplicate entry

//Error class
module.exports.DuplicatedRoleException = class DuplicatedRoleException extends Error {
    constructor( value ) {
        super( value );
        Error.captureStackTrace( this, DuplicatedRoleException );

        this.name = 'DuplicatedRoleException';
        this.value = value;

        if ( value == -1 ) {
            this.message = 'Role name already exists.';
        }
        else if ( value == -2 ) {
            this.message = 'Role name already exists in a game name entry.';
        }
        else if ( value == -3 ) {
            this.message = 'Role game already exists in a role name entry.';
        }
        else if ( value == -4 ) {
            this.message = 'Game name already exists.';
        }
        else {
            this.message = 'Unknown error.';
        }
    }
};