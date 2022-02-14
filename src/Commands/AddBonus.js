const Discord = require("discord.js");
const Command = require("../Utils/Command");
const { User } = require("../Database/Models");

module.exports = new Command({
    name: "addbonus",
    description: "Adiciona bonus de convites ao usuário.",
    category: "Configurações",
    options: [
        {
            name: "user",
            description: "Usuário que terá bonus adicionado",
            type: "USER",
            required: true
        },
        {
            name: "bonus",
            description: "Quantia de convites que serão adicionados",
            type: "INTEGER",
            minValue: 1,
            required: true
        }
    ],
    run: async (client, interaction) => {
        if(!interaction.memberPermissions.has('ADMINISTRATOR')) {
            const embed = new Discord.MessageEmbed()
                .setColor('#FF0000')
                .setTitle('Sem permissão!')
                .setDescription('Você não tem permissão para executar esse comando!')
                .setFooter({
                    text: `©️ KoddyDev#1004 - All Rights Reserved ©️`,
                })
                
            interaction.editReply({ embeds: [embed]})
        }

        const user = interaction.options.getMember("user")
        const bonus = interaction.options.getInteger("bonus")

        const userData = await User.findOne({ where: { userId: user.id } }) || await User.create({ userId: user.id, guildId: user.guild.id, inviterId: 'null', invites: 0, bonus: 0, leave: 0 });

        await userData.increment({
            bonus: bonus
        })
        
        const embed = new Discord.MessageEmbed()
            .setTitle(`Sistema de Convites`)
            .setDescription(`
            👋 Olá, ${interaction.user.username}!

            Você adicionou **${bonus}** convites bonus!
            Agora ele possui **${(userData.bonus + bonus)}** convites bonus!
            `)
            .setColor("AQUA")
            .setFooter({
                text: `©️ KoddyDev#1004 - All Rights Reserved ©️`,
            })

        interaction.editReply({ embeds: [embed] })
    }
});
