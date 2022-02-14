const Discord = require('discord.js')
const { GuildConfig } = require('../Database/Models')
const Command = require('../Utils/Command')

module.exports = new Command({
    name: 'config',
    description: 'Configure-me em seu servidor!',
    category: 'Configurações',
    options: [
        {
            name: 'channel',
            description: 'Efetue as configurações do sistema de convite em relação aos canais!',
            type: 'SUB_COMMAND'
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

        const s = interaction.options.getSubcommand(true)

        if(s == 'channel') {
            const findG = await GuildConfig.findOne({ where: { guildId: interaction.guild.id } }) || await GuildConfig.create({ guildId: interaction.guild.id })

            const embed = new Discord.MessageEmbed()
                .setTitle("Configurações de canais")
                .setDescription(`
                👋 Olá, ${interaction.user.username}!
                
                Qual é o canal que será enviado a mensagem de membro convidado?`)
                .setColor("AQUA")
                .setFooter({
                    text: `©️ KoddyDev#1004 - All Rights Reserved ©️`,
                })

                interaction.editReply({ embeds: [embed]})

            let c = interaction.channel.createMessageCollector({
                filter: m => m.author.id == interaction.user.id
            }).on("collect", async m => {
                const channelJoin = m.mentions.channels.first()

                if(!channelJoin || channelJoin.type !== 'GUILD_TEXT' && channelJoin.type !== 'GUILD_NEWS') {
                    const embed = new Discord.MessageEmbed()
                        .setColor('#FF0000')
                        .setTitle('Canal inválido!')
                        .setDescription('Você deve mencionar um canal de texto ou de notícias!')
                        .setFooter({
                            text: `©️ KoddyDev#1004 - All Rights Reserved ©️`,
                        })

                    m.reply({ embeds: [embed]})
                    return
                }

                c.stop()

                const embed = new Discord.MessageEmbed()
                    .setTitle("Configurações de canais")
                    .setDescription(`
                    👋 Olá, ${interaction.user.username}!

                    Qual é o canal que será enviado a mensagem de membro saiu do servidor?`)
                    .setColor("AQUA")
                    .setFooter({
                        text: `©️ KoddyDev#1004 - All Rights Reserved ©️`,
                    })

                m.reply({ embeds: [embed]})

                let c2 = interaction.channel.createMessageCollector({
                    filter: m => m.author.id == interaction.user.id
                }).on("collect", async m => {
                    const channelLeave = m.mentions.channels.first()

                    if(!channelLeave || channelLeave.type !== 'GUILD_TEXT' && channelLeave.type !== 'GUILD_NEWS') {
                        const embed = new Discord.MessageEmbed()
                            .setColor('#FF0000')
                            .setTitle('Canal inválido!')
                            .setDescription('Você deve mencionar um canal de texto ou de notícias!')
                            .setFooter({
                                text: `©️ KoddyDev#1004 - All Rights Reserved ©️`,
                            })

                        m.reply({ embeds: [embed]})

                        return;
                    }

                    c2.stop()

                    const embed = new Discord.MessageEmbed()
                        .setTitle("Configurações de canais")
                        .setDescription(`
                        👋 Olá, ${interaction.user.username}!

                        Qual é o titulo da mensagem de convite?`)
                        .setColor("AQUA")
                        .setFooter({
                            text: `©️ KoddyDev#1004 - All Rights Reserved ©️`,
                        })

                    m.reply({ embeds: [embed]})

                    let c4 = interaction.channel.createMessageCollector({
                        filter: m => m.author.id == interaction.user.id
                    }).on("collect", async m => {
                        const title = m.content

                        if(!title) {
                            const embed = new Discord.MessageEmbed()
                                .setColor('#FF0000')
                                .setTitle('Título inválido!')
                                .setDescription('Você deve mencionar um título válido!')
                                .setFooter({
                                    text: `©️ KoddyDev#1004 - All Rights Reserved ©️`,
                                })
                                
                            m.reply({ embeds: [embed]})
                            return;
                        }

                        c4.stop()

                        const embed = new Discord.MessageEmbed()
                            .setTitle("Configurações de canais")
                            .setDescription(`
                            👋 Olá, ${interaction.user.username}!

                            Qual é a descrição da embed de quando um membro entrar?
                            Exemplo: O membro {member} acaba de entrar no servidor!\nConvidado por: {inviter} ({invites} convites, {bonus} bonus, {leave} saíram)`)
                            .setColor("AQUA")
                            .setFooter({
                                text: `©️ KoddyDev#1004 - All Rights Reserved ©️`,
                            })

                        m.reply({ embeds: [embed]})

                        let c5 = interaction.channel.createMessageCollector({
                            filter: m => m.author.id == interaction.user.id
                        }).on("collect", async m => {
                            const descriptionJoin = m.content

                            if(!descriptionJoin) {
                                const embed = new Discord.MessageEmbed()
                                    .setColor('#FF0000')
                                    .setTitle('Descrição inválida!')
                                    .setDescription('Você deve mencionar uma descrição válida!')
                                    .setFooter({
                                        text: `©️ KoddyDev#1004 - All Rights Reserved ©️`,
                                    })
                                    
                                m.reply({ embeds: [embed]})
                                return;
                            }

                            c5.stop()

                            const embed = new Discord.MessageEmbed()
                                .setTitle("Configurações de canais")
                                .setDescription(`
                                👋 Olá, ${interaction.user.username}!

                                Qual é a descrição da embed de quando um membro sair?
                                Exemplo: O membro {member} acaba de entrar no servidor!\nConvidado por: {inviter} ({invites} convites, {bonus} bonus, {leave} saíram)`)
                                .setColor("AQUA")
                                .setFooter({
                                    text: `©️ KoddyDev#1004 - All Rights Reserved ©️`,
                                })

                            m.reply({ embeds: [embed]})

                            let c6 = interaction.channel.createMessageCollector({
                                filter: m => m.author.id == interaction.user.id
                            }).on("collect", async m => {
                                const descriptionLeave = m.content

                                if(!descriptionLeave) {
                                    const embed = new Discord.MessageEmbed()
                                        .setColor('#FF0000')
                                        .setTitle('Descrição inválida!')
                                        .setDescription('Você deve mencionar uma descrição válida!')
                                        .setFooter({
                                            text: `©️ KoddyDev#1004 - All Rights Reserved ©️`,
                                        })
                                            
                                    m.reply({ embeds: [embed]})
                                    return;
                                }

                                c6.stop()

                                const jsonJoin = {
                                    title,
                                    description: descriptionJoin,
                                    color: '#00ff00'
                                }
                                const jsonLeave = {
                                    title,
                                    description: descriptionLeave,
                                    color: '#ff0000'
                                }
                                    
                                await findG.update({
                                    joinMessageChannel: channelJoin.id,
                                    leaveMessageChannel: channelLeave.id,
                                    joinMessage: JSON.stringify(jsonJoin),
                                    leaveMessage: JSON.stringify(jsonLeave)
                                })

                                const embed = new Discord.MessageEmbed()
                                    .setTitle("Configurações de canais")
                                    .setDescription(`
                                    👋 Olá, ${interaction.user.username}!

                                    Configurações salvas com sucesso!`)
                                    .setColor("AQUA")
                                    .setFooter({
                                        text: `©️ KoddyDev#1004 - All Rights Reserved ©️`,
                                    })

                                 m.reply({ embeds: [embed]})
                            })
                        })
                    })
                })
            })
        }
    }
})