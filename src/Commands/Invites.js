const Discord = require("discord.js");
const Command = require("../Utils/Command");
const { User } = require("../Database/Models");

module.exports = new Command({
    name: "invites",
    description: "Mostra o total de convites que o usuário possui.",
    category: "Configurações",
    options: [
        {
            name: "user",
            description: "Mostra o total de convites que o usuário possui.",
            type: "USER",
            requided: false
        }
    ],
    run: async (client, interaction) => {
        const user = interaction.options.getMember("user") || interaction.member;
        const userData = await User.findOne({ where: { userId: user.id } }) || await User.create({ userId: user.id, guildId: user.guild.id, inviterId: 'null', invites: 0, bonus: 0, leave: 0 });

        const embed = new Discord.MessageEmbed()
            .setTitle(`Sistema de Convites`)
            .setDescription(`
            👋 Olá, ${interaction.user.username}!

            ${user.id == interaction.user.id ? 'Você' : 'O membro ' + user.toString()} possue **${userData.invites}** convites!
            
            **${userData.bonus}** convites bonus!
            **${userData.leave}** pessoas sairam, que foram convidadas por ${user.id == interaction.user.id ? 'você' : 'ele'}!
            
            **${(userData.invites + userData.bonus)}** convites no total!`)
            .setColor("AQUA")
            .setFooter({
                text: `©️ KoddyDev#1004 - All Rights Reserved ©️`,
            })


        interaction.editReply({ embeds: [embed] })
    }
})