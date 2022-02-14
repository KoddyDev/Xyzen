const Discord = require("discord.js");
const Command = require("../Utils/Command");
const { User } = require("../Database/Models");

module.exports = new Command({
    name: "reminvites",
    description: "Remove bonus de convites ao usuário.",
    category: "Invites",
    options: [
        {
            name: "user",
            description: "Usuário que terá convites removidos",
            type: "USER",
            required: true
        },
        {
            name: "invites",
            description: "Quantia de convites que serão removidos",
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
            return
        }

        const user = interaction.options.getMember("user")
        const invites = interaction.options.getInteger("invites")

        const userData = await User.findOne({ where: { userId: user.id } }) || await User.create({ userId: user.id, guildId: user.guild.id, inviterId: 'null', invites: 0, bonus: 0, leave: 0 });

        if(invites > userData.invites) {
            const embed = new Discord.MessageEmbed()
                .setColor('#FF0000')
                .setTitle('❎ | Erro')
                .setDescription('O usuário não possui convites suficientes!')
                .setFooter({
                    text: `©️ KoddyDev#1004 - All Rights Reserved ©️`,
                })
                
            interaction.editReply({ embeds: [embed]})
            return
        }

        await userData.decrement({
            invites: invites
        })
        
        const embed = new Discord.MessageEmbed()
            .setTitle(`Sistema de Convites`)
            .setDescription(`
            👋 Olá, ${interaction.user.username}!

            O membro ${user.displayName} perdeu ${invites} convites!
            Agora ele possui ${(userData.invites - invites)} convites!
            `)
            .setColor("AQUA")
            .setFooter({
                text: `©️ KoddyDev#1004 - All Rights Reserved ©️`,
            })
            
        interaction.editReply({ embeds: [embed]})
    }
})
