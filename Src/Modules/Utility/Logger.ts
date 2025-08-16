// === Sys Logger ===

//Imports
import colors from "colors/safe";

//Exports
export default {
    log(locale: string, level: string, msg: string) {
        switch (level) {
            case 'proc':
                console.log(colors.green(`[${locale}][PROC] ${msg}`));
                break;
            case 'info':
                console.info(`[${locale}][INFO] ${msg}`);
                break;
            case 'warn':
                console.warn(colors.yellow(`[${locale}][WARN] ${msg}`));
                break;
            case 'err':
                console.error(colors.red(`[${locale}][ERR] ${msg}`));
                break;
            default:
                console.warn(`[LOGGER] Message was thrown without level:\n${msg}`);
        }
    }
}