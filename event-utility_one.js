//----Utilities 1----
//Developer: <AUDWIN THOMAS>

 //UTILITY LOGIC
    //Generate the date
    let currDate = new Date();
 

    //Get date from command
    let time = cmdAlt[2].trim(); //Remove whitespace
    time = time.split(“:”); //Set : as delimiter
 

    //Date format: MM:DD:YYYY:HrHr:MiMi:Meridiem
    //Verify that time even exists
    if ((cmdAlt[2] == undefined || cmdAlt[2] == null) && 
 typeof cmdAlt[2] == typeof “blah”) {
        return msg.reply(“Events don’t get planned like this without a date.
 Hit me with something here.”)
        .then(sent => sent.delete(10000)); //If not, return error response
    }
 

    //Calculate month
    //Verify valid
    if ((time[0] > 0 && time[0] < 13) && time[1] != undefined) {
        event.month = parseInt(time[0]);
    } else {
        return msg.reply(“You know there are only 12 months right?
 (Has to be a unmber too.)”)
        .then(sent => sent.delete(10000));
    }