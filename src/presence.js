const { ActivityType } = require("discord.js");

// https://discord.js.org/#/docs/discord.js/main/typedef/PresenceData

module.exports = {
  status: 'online',
  activities: [
    {
      name: 'c!help',
      type: ActivityType.Watching
    }
  ]
}
