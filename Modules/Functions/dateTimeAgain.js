//---REFACTOR ME OUT OF THIS MESS---

module.exports = {
    rewriteDate,
    rewriteTime,
    rewriteDateTime
}

function rewriteDate(date) {
    return `${date.toDateString()}`
}

function rewriteTime(date) {
    return `${date.getHours()}:${date.getMinutes()}`;
}

function rewriteDateTime(date) {
    return `${rewriteDate(date)} ${rewriteTime(date)}`;
}