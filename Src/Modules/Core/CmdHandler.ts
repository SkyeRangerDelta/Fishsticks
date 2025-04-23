// === COMMAND HANDLER ===

//Imports
import * as fs from "fs";
import logger from "../Utility/Logger";
import path from "path";
import { FishsticksClient } from "./FishsticksClient";
import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v10";

import { FSID, CCGID } from './SysIDs.json';

//Exports
const cmdIndexer = {
    indexCommands
};

export default cmdIndexer;

//Data
const LOCALE = 'CMD-HANDLER';

//Functions
async function indexCommands(Fishsticks: FishsticksClient): Promise<void> {
    const cmdJSON: object[] = [];

    const cmdPath = path.join(__dirname + '../../', 'Commands/Active');
    const cmdIndex = fs.readdirSync(cmdPath).filter(f => f.endsWith('.js'));
    for (const command of cmdIndex) {
        const cPath = `../../Commands/Active/${command}`;
        await import (cPath).then(c => {
            const cmd = c.default;
            logger.log(LOCALE, 'info', `[CMD-INDEXER] Indexing ${cmd.name}`);
            cmdJSON.push(cmd.data.toJSON());
            Fishsticks.CMD_INDEX.set(cmd.data.name, cmd);
        })
    }

    logger.log(LOCALE, 'info', '[CMD-INDEXER] Beginning command registration...');
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN as string);
    try {
        await rest.put(
            Routes.applicationGuildCommands(
                FSID as string,
                CCGID as string
            ),
            { body: cmdJSON }
        );
        logger.log(LOCALE, 'proc', '[CMD-INDEXER] Command registration finished.');
    }
    catch (cmdRegistrationError) {
        logger.log(LOCALE, 'err', '[CMD-INDEXER] ERROR UPDATING/REGISTERING COMMANDS.\n' + cmdRegistrationError);
        Fishsticks.destroy();
        process.exit();
    }
}