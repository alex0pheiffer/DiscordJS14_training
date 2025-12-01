const { SlashCommandBuilder} = require('discord.js');
import { ChatInputCommandInteraction } from "discord.js";
import { CommandOption } from "../command_interface";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setDescription('Says hello!'),
    async execute(interaction: ChatInputCommandInteraction) {
        //nothing here
    },
};