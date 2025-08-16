// === FS Base Client ===

// Imports
import { Client, GatewayIntentBits } from "discord.js";
import { FishsticksClient } from "./FishsticksClient";

// Exports
export const Fishsticks = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageTyping
    ]
}) as FishsticksClient;