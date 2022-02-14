const { Client, CommandInteraction } = require("discord.js")

module.exports = class Command {
    constructor({
        name = '',
        description = '',
        category = '',
        options = [],
        run = 
        /**
         * 
         * @param {Client} client 
         * @param {CommandInteraction} interaction 
         */
        (client, interaction) => { },
    }) {
        this.name = name,
        this.description = description,
        this.category = category,
        this.options = options,
        this.run = run
    }
}

    