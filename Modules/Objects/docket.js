// ---- DOCKET OBJECT ----
//The docket object

//Imports
const { systemTimestamp } = require('../Utility/Utils_Time');

//Class
class DocketItem {
    constructor(cmd) {
        this.id = cmd.msg.id;
        this.title = '';
        this.date = systemTimestamp(new Date());
        this.description = cmd.content[1];
        this.sticky = false;
        this.closed = false;
        this.author = cmd.msg.member.displayName;
    }

    //Edit this docket point
    async edit(cmd) {

    }

    //Delete this docket point
    async delete(num) {

    }
}