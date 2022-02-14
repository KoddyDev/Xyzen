/*
 * 
 * Author: ! KoddyDev#0001 
 * ©️ Copyright 2020 - 2021 ©️
 * 
 */

const { Sequelize } = require("sequelize")

    module.exports = new Sequelize({
      dialect: 'sqlite',
      storage: './database.sqlite',
      logging: false
    })