//=====================================| Import the Module |=====================================\\
const { Client } = require("discord.js");

//==========< SETTINGS >==========\\
const Config = require("../../Structures/Settings/config.json");

//==========< OTHERS >==========\\
const moment = require("moment");
const color = require("colors");

//=====================================| Code |=====================================\\

module.exports = {
    name: "shardReady",
    once: true,

    /**
     * @param {Client} client
     */

     async execute(id, client) {
        console.log("=======================================< LIMIT >=======================================".gray);
        console.log(`${color.bold.bgBlue(`[${moment().format("dddd - DD/MM/YYYY - hh:mm:ss", true)}]`)} ` + `${color.bold.green(`[SHARD READY]`)} ` + `[${id}]`.cyan);
    }
};