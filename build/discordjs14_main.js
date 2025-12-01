"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('node:path');
const discord_js_1 = require("discord.js");
const fs = __importStar(require("fs"));
require('dotenv').config(); // get our passwords and such
const BOT_VERSION = "0";
const BOT_KEY = process.env["TOKEN"];
const CLIENT_ID = process.env["CLIENT_ID"];
const client = new discord_js_1.Client({
    intents: [discord_js_1.GatewayIntentBits.MessageContent, discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.GuildMembers, discord_js_1.GatewayIntentBits.GuildMessageReactions]
});
client.slashCommands = new discord_js_1.Collection();
client.commands = new discord_js_1.Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
client.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
    //interaction can be used in place of message, they share the same info, except author -> user
    //you have to reply to the interaction or else it sends an error message, even if it was executed fine
    //regular / command
    if (interaction.isChatInputCommand()) {
        if (!interaction.client.commands.get(interaction.commandName)) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
        try {
            //parse cmd name
            let cmd = interaction.commandName;
            // COMMAND: HELLO
            if (cmd == 'hello') {
                // check for relevant permissions for this command
                if (!interaction.guild?.members.me?.permissionsIn(interaction.channelId).has(discord_js_1.PermissionsBitField.Flags.SendMessages)) {
                    interaction.reply({ content: 'Bot does not have permission to **send messages** in this channel. :frowning2:', ephemeral: true });
                    return;
                }
                if (!interaction.guild?.members.me?.permissionsIn(interaction.channelId).has(discord_js_1.PermissionsBitField.Flags.EmbedLinks)) {
                    interaction.reply({ content: 'Bot does not have permission to **embed links** in this channel. :frowning2:', ephemeral: true });
                    return;
                }
                if (!interaction.guild?.members.me?.permissionsIn(interaction.channelId).has(discord_js_1.PermissionsBitField.Flags.ViewChannel)) {
                    interaction.reply({ content: 'Bot does not have permission to **view channel** in this channel. :frowning2:', ephemeral: true });
                    return;
                }
                if (!interaction.guild?.members.me?.permissionsIn(interaction.channelId).has(discord_js_1.PermissionsBitField.Flags.ReadMessageHistory)) {
                    interaction.reply({ content: 'Bot does not have permission to **read message history** in this channel. :frowning2:', ephemeral: true });
                    return;
                }
                // execute the command
                interaction.reply({ content: 'Bot says hello!', ephemeral: false });
            }
            // COMMAND: DEFAULT
            else
                await interaction.editReply({ content: 'There was an error while executing this command.' });
        }
        catch (error) {
            console.error(`main interaction loop error: ${error}`);
            if (error)
                await interaction.editReply({ content: 'There was an error while executing this command.' });
        }
    }
});
client.on('ready', async () => {
    // ## SLASH COMMANDS
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        }
        else
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
    console.log(`${client.user?.username} Online -- Version: ${BOT_VERSION}`);
});
client.on('error', async (err) => {
    console.log("A main routine error has occured with the client. This is probably a network timeout (?).");
    console.log(err);
});
// login
client.login(BOT_KEY);
