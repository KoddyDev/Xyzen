/*
 * 
 * Author: ! KoddyDev#0001 
 * ©️ Copyright 2020 - 2021 ©️
 * 
 */

const { Client } = require("discord.js");
const { glob } = require("glob");
const { promisify } = require("util");
const Utils = require("../Utils");

const globPromise = promisify(glob);

module.exports.all = async (client) => {

    return new Promise(async (i) => {
      try {
        const slashCommands = await globPromise(
          `${process.cwd()}/src/Commands/*.js`
        );

        var ArrayCommands = []

        slashCommands.map((value) => {
          delete require.cache[require.resolve(value)]
          
          const file = require(value)
          
          Utils.commands.origin.set(file.name, {
            ...file,
            type: 'origin'
          })
          
          ArrayCommands.push({
            name: file.name,
            description: file.description,
            options: file.options,
            permissions: file.permissions
          })
          
        })

        client.guilds.cache.map(g => {

            g.commands.set(ArrayCommands)
          .then((c) => {
            c.forEach(f => {
              f.permissions.set({
                permissions: ArrayCommands.find(x => x.name == f.name).permissions || []
              })
            })
        }).catch(err => {
          if(err.message == 'Missing Access') {
            client.users.cache.get(g.ownerId)?.send(`Estou sem permissão de adicionar Comandos Slash!\nMe adicione pelo link: https://discord.com/api/oauth2/authorize?client_id=853005201300389918&permissions=8&scope=bot%20applications.commands`).catch(err => {
          
            })
          }
      })
        })

      return Promise.resolve()
    } catch (err) {
      if(err.message == 'Missing Access') {
        const g = client.guilds.cache.get(guildId)

        client.users.cache.get(g.ownerId)?.send(`Estou sem permissão de adicionar Comandos Slash!\nMe adicione pelo link: https://discord.com/api/oauth2/authorize?client_id=853005201300389918&permissions=8&scope=bot%20applications.commands`).catch(err => {
          
        })
      } else {
        console.log(err.message)
      }
    }
    })
};

module.exports.one = async (client, guildId) => {

  return new Promise(async (i) => {
    try {
      const slashCommands = await globPromise(
        `${process.cwd()}/src/Commands/*.js`
      );

      var ArrayCommands = []

      slashCommands.map((value) => {
        delete require.cache[require.resolve(value)]
        
        const file = require(value)
        
        Utils.commands.origin.set(file.name, {
          ...file,
          type: 'origin'
        })
        
        ArrayCommands.push({
          name: file.name,
          description: file.description,
          options: file.options,
          permissions: file.permissions
        })
        
      })

      const g = client.guilds.cache.get(guildId)

          g.commands.set(ArrayCommands)
        .then((c) => {
          c.forEach(f => {
            f.permissions.set({
              permissions: ArrayCommands.find(x => x.name == f.name).permissions || []
            })
          })
        }).catch(err => {
          if(err.message == 'Missing Access') {
            client.users.cache.get(g.ownerId)?.send(`Estou sem permissão de adicionar Comandos Slash!\nMe adicione pelo link: https://discord.com/api/oauth2/authorize?client_id=853005201300389918&permissions=8&scope=bot%20applications.commands`).catch(err => {

            })
            console.log(g.name + ' - ' + g.ownerId)
          }
      })

    return Promise.resolve()
    } catch (err) {
      if(err.message == 'Missing Access') {
        const g = client.guilds.cache.get(guildId)

        client.users.cache.get(g.ownerId)?.send(`Estou sem permissão de adicionar Comandos Slash!\nMe adicione pelo link: https://discord.com/api/oauth2/authorize?client_id=853005201300389918&permissions=8&scope=bot%20applications.commands`).catch(err => {
          
        })
      }
    }
  })
};