// === Sys Logger ===

//Imports
import colors from "colors/safe";

//Exports
export default {
    log(level: string, msg: string) {
        switch (level) {
            case 'proc':
                console.log(colors.green(`[PROC] ${msg}`));
                break;
            case 'info':
                console.info(`[INFO] ${msg}`);
                break;
            case 'warn':
                console.warn(colors.yellow(`[WARN] ${msg}`));
                break;
            case 'err':
                console.error(colors.red(`[ERR] ${msg}`));
                break;
            default:
                console.warn(`[LOGGER] Message was thrown without level:\n${msg}`);
        }
    }
}