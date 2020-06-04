//---Parses Server Shard---

module.exports = {
    statusReader
};

function statusReader(status) {
    switch (status) {
        case 0:
            return "ONLINE";
        case 1:
            return "CONNECTING";
        case 2:
            return "RECONNECTING";
        case 3:
            return "IDLE";
        case 4:
            return "NEARLY";
        case 5:
            return "OFFLINE";
        case 6:
            return "PENDING DOCKING";
        case 7:
            return "IDENTIFYING";
        case 8:
            return "RESUMING";
        default:
            return "UNKNOWN";
    }
}