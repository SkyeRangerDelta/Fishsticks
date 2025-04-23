// === Fishsticks Client ===

// Imports
import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, Collection, CommandInteraction, Guild, GuildMember } from "discord.js";
import { MongoClient } from "mongodb";

// Exports
export interface FishsticksClient extends Client {
    CMD_INDEX: Collection<
        String,
            {
                name: String,
                data: SlashCommandBuilder,
                ownerOnly?: boolean,
                run: (Fishsticks: FishsticksClient, int: CommandInteraction) => Promise<void>;
                help: () => void;
            }
        >;
    CCG: Guild,
    MEMBER: GuildMember,
    FSO_CONNECTION: MongoClient
}