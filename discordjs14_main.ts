const path = require('node:path');
import { ButtonInteraction, CacheType, Channel, ChatInputCommandInteraction, Client, Collection, EmbedBuilder, Events, GatewayIntentBits, Interaction, PermissionsBitField, StringSelectMenuInteraction, TextChannel } from "discord.js";
import * as fs from "fs";
import { Command, SlashCommand } from "./command_interface";
require('dotenv').config() // get our passwords and such

const BOT_VERSION = "0"
const BOT_KEY = process.env["TOKEN"];
const CLIENT_ID = process.env["CLIENT_ID"];


const client = new Client({  
    intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions] 
});
client.slashCommands = new Collection<string, SlashCommand>();
client.commands = new Collection<string, Command>();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.js'));

client.on(Events.InteractionCreate, async (interaction: Interaction<CacheType>) => {
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
                if (!interaction.guild?.members.me?.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.SendMessages)) {
                    (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **send messages** in this channel. :frowning2:', ephemeral: true});
                    return;
                }   
                if (!interaction.guild?.members.me?.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.EmbedLinks)) {
                    (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **embed links** in this channel. :frowning2:', ephemeral: true});
                    return;
                }   
                if (!interaction.guild?.members.me?.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.ViewChannel)) {
                    (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **view channel** in this channel. :frowning2:', ephemeral: true});
                    return;
                }   
                if (!interaction.guild?.members.me?.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.ReadMessageHistory)) {
                    (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **read message history** in this channel. :frowning2:', ephemeral: true});
                    return;
                }   
                
                // execute the command
                (<ChatInputCommandInteraction>interaction).reply({content: 'Bot says hello!', ephemeral: false});
                
            }
            // COMMAND: DEFAULT
            else await interaction.editReply({ content: 'There was an error while executing this command.'});

        } catch (error) {
            console.error(`main interaction loop error: ${error}`);
            if (error) await interaction.editReply({ content: 'There was an error while executing this command.'});
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
        else console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
    console.log(`${client.user?.username} Online -- Version: ${BOT_VERSION}`);
});

client.on('error', async(err: any) => {
    console.log("A main routine error has occured with the client. This is probably a network timeout (?).");
    console.log(err);
});

// login
client.login(BOT_KEY);
