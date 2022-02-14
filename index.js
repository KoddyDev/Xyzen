const Discord = require("discord.js")
const { MessageEmbed } = require("discord.js");
const Connector = require("./src/Database/Connector");
const { GuildConfig, User } = require("./src/Database/Models");

const commands = require("./src/Handlers/Handler")
const Utils = require("./src/Utils")

const invites = new Map();

const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_INVITES",
        "GUILD_MEMBERS",
        "GUILD_INVITES"
    ]
})

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag} (${client.user.id})`)
    Connector.authenticate().then(() => {
        console.log("Database connected!")
        GuildConfig.init(Connector);
        GuildConfig.sync({ force: false });
        
        User.init(Connector);
        User.sync({ force: false });
    })

    commands.all(client)

    client.guilds.cache.forEach(async (guild) => {
      guild.invites.fetch().then(firstInvites => {
      invites.set(guild.id, new Map(firstInvites.map((invite) => [invite.code, invite.uses])));
      }).catch(async err => {
        if(err.message == 'Missing Permissions') {
          const m = await guild.fetchOwner()
  
          m.send(`Estou sem permissão de gerencionar convites!\nMe adicione pelo link: https://discord.com/api/oauth2/authorize?client_id=853005201300389918&permissions=8&scope=bot%20applications.invite_splash`).catch(err => {

          })
          console.log(`Missing Permissions de ${guild.name} - ${guild.id} - ${m.user.tag} - ${m.user.id}`)
        }
      })
    })
})

client.on("interactionCreate", async i => {
    if(i.isCommand()) {
        const findC = Utils.commands.origin.get(i.commandName)

        if(!findC) return;
            await i.deferReply({
                fetchReply: true
            })

        findC.run(client, i)
    }
})

client.on("inviteDelete", (invite) => {
    invites.get(invite.guild.id).delete(invite.code);
  }).on("inviteCreate", (invite) => {
    invites.get(invite.guild.id).set(invite.code, invite.uses);
  })

  client.on("guildCreate", (guild) => {
    guild.invites.fetch().then(guildInvites => {
      invites.set(guild.id, new Map(guildInvites.map((invite) => [invite.code, invite.uses])));
    }).catch(async err => {
      if(err.message == 'Missing Permissions') {
        const m = await guild.fetchOwner()

        m.send(`Estou sem permissão de gerencionar convites!\nMe adicione pelo link: https://discord.com/api/oauth2/authorize?client_id=853005201300389918&permissions=8&scope=bot%20applications.invite_splash`).catch(err => {
          
        })
        console.log(`Missing Permissions de ${guild.name} - ${guild.id} - ${m.user.tag} - ${m.user.id}`)
      }
    })
    commands.one(client, guild.id)
  }).on("guildDelete", (guild) => {
    invites.delete(guild.id);
  });

  client.on("guildMemberAdd", member => {
    member.guild.invites.fetch().then(async newInvites => {
        
        const findSettings = await GuildConfig.findOne({ where: { guildId: member.guild.id } })
        
        if(!findSettings) return;

      const oldInvites = invites.get(member.guild.id);
      const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));
      invites.set(member.guild.id, new Map(newInvites.map((invite) => [invite.code, invite.uses])));
      const inviter = client.users.cache.get(invite.inviter.id);
      
      const logChannel = member.guild.channels.cache.get(findSettings.joinMessageChannel)

      if(!logChannel) return;
      if(!inviter) return

      let findI = await User.findOne({ where: { guildId: member.guild.id, userId: inviter.id } })
      
      if(!findI) findI = await User.create({ guildId: member.guild.id, userId: inviter.id, invites: 0, bonus: 0, leave: 0 }) 
      
      findI.increment({
          invites: 1
      })

      let findU = await User.findOne({ where: { guildId: member.guild.id, userId: member.user.id } })

      if(!findU) findU = await User.create({ guildId: member.guild.id, userId: member.user.id, inviterId: inviter.id, invites: 0, bonus: 0, leave: 0 })
      
      await findU.update({ guildId: member.guild.id, userId: member.user.id, inviterId: inviter.id, invites: 0, bonus: 0, leave: 0 })
    
      const joinMessage = JSON.parse(findSettings.joinMessage)

      const embed = new MessageEmbed()
      .setTitle(joinMessage.title)
      .setDescription(joinMessage.description.replace("{member}", member.user.toString()).replace("{inviter}", inviter.toString()).replace("{invites}", (findI.invites + 1)).replace("{bonus}", findI.bonus).replace("{leave}", findI.leave))
      .setColor(joinMessage.color)
      .setFooter({
          text: `©️ KoddyDev#1004 - All Rights Reserved ©️`,
      })

      logChannel.send({ embeds: [embed] })
    }).catch(async err => {
      if(err.message == 'Missing Permissions') {
        const m = await member.guild.fetchOwner()

        m.send(`Estou sem permissão de gerencionar convites!\nMe adicione pelo link: https://discord.com/api/oauth2/authorize?client_id=853005201300389918&permissions=8&scope=bot%20applications.invite_splash`).catch(err => null)
        console.log(`Missing Permissions de ${member.guild.name} - ${member.guild.id} - ${m.user.tag} - ${m.user.id}`)
      }
    })
  });

  client.on("guildMemberRemove", async member => {
      const findSettings = await GuildConfig.findOne({ where: { guildId: member.guild.id } })
      const findM = await User.findOne({ where: { guildId: member.guild.id, userId: member.user.id } })
      if(!findSettings) return
      if(!findM) return

      const findInviter = await User.findOne({ where: { guildId: member.guild.id, userId: findM.inviterId } })
      if(!findInviter) return

      const logChannel = member.guild.channels.cache.get(findSettings.leaveMessageChannel)
      if(!logChannel) return

      const leaveMessage = JSON.parse(findSettings.leaveMessage)

      await findM.destroy()
      await findInviter.update({
          invites: findInviter.invites - 1,
          leave: findInviter.leave + 1
      })


      const embed = new MessageEmbed()
      .setTitle(leaveMessage.title)
      .setDescription(leaveMessage.description.replace("{member}", member.user.tag).replace("{inviter}", `<@${findInviter.userId}>`).replace("{invites}", (findInviter.invites).toString()).replace("{bonus}", findInviter.bonus).replace("{leave}", (findInviter.leave).toString()))
      .setColor(leaveMessage.color)
      .setFooter({
          text: `©️ KoddyDev#1004 - All Rights Reserved ©️`,
      })

      logChannel.send({ embeds: [embed] })
  })


client.login("ODUzMDA1MjAxMzAwMzg5OTE4.YMPFAA.08y-XPj46PUMb-TWGb6zfuTtUec")