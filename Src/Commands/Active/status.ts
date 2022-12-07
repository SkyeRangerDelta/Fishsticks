// --- STATUS ---

//Imports
import {CommandInteraction} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {FishsticksClient} from "../../Modules/Core/FishsticksClient";
import Logger from "../../Modules/Utility/Logger";

//Data
const LOCALE = 'Status';
const data = new SlashCommandBuilder()
    .setName('status')
    .setDescription('Displays a report of various system states and variables.');

//Functions
async function run(Fishsticks: FishsticksClient, int: CommandInteraction): Promise<void> {
    Logger.log(LOCALE, 'info', 'Running a status report.');

    //const statusData;
}

//Exports