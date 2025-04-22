//Imports
const errorMsgPool = require( '../Library/errorMsgs.json' );
const randomFooterPool = require( '../Library/footerMsgs.json' );

//Functions
function generateErrorMsg() {
    const msgNum = Math.floor( Math.random() * errorMsgPool.length );
    return '*' + errorMsgPool[msgNum] + '* ';
}

//Generate a random statement for an embed footer
function randomFooter() {
    const msgNum = Math.floor( Math.random() * randomFooterPool.length );
    return '*' + randomFooterPool[msgNum] + '* ';
}

//Exports
module.exports = {
    generateErrorMsg,
    randomFooter
};