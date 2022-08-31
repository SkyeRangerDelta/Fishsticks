// === FS Base Client ===

// Imports
import {Client, Intents} from "discord.js";
import {FishsticksClient} from "./FishsticksClient";

// Exports
export const Fishsticks = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_TYPING
    ]
}) as FishsticksClient;