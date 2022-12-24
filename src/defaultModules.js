const emojis = require('./emojis.js');

module.exports = [
  {
    name: 'logs',
    enabled: false,
    channel: '',
    logDeletedMessages: true,
    logEditedMessages: true
  },
  {
    name: 'bannedwords',
    enabled: true,
    words: [],
    sendMessageOnDelete: true,
    message: 'default',
    ignoreAdmins: true
  },
  {
    name: 'boost',
    enabled: false,
    channel: '',
    message: 'default',
    title: 'default',
    description: 'default'
  },
  {
    name: 'suggestions',
    enabled: true,
    channel: '',
    reactToLinks: true,
    reactToFiles: true,
    approvalEmoji: emojis.PinkiePieYes,
    disapprovalEmoji: emojis.PinkiePieNo
  },
  {
    name: 'help',
    enabled: true,
    restricted: false,
    allowedChannels: []
  },
  {
    name: 'userinfo',
    enabled: true,
    restricted: false,
    allowedChannels: []
  },
  {
    name: 'avatar',
    enabled: true,
    restricted: false,
    allowedChannels: []
  },
  {
    name: 'roleinfo',
    enabled: true,
    restricted: false,
    allowedChannels: []
  },
  {
    name: 'serverinfo',
    enabled: true,
    restricted: false,
    allowedChannels: []
  },
  {
    name: 'love',
    enabled: true,
    restricted: false,
    allowedChannels: []
  },
  {
    name: 'booru',
    enabled: true,
    restricted: false,
    allowedChannels: [],
    filter: 229
  },
  {
    name: 'clop',
    enabled: true,
    restricted: false,
    allowedChannels: [],
    filter: 200
  },
  {
    name: 'e621',
    enabled: true,
    restricted: false,
    allowedChannels: []
  },
  {
    name: 'emoji',
    enabled: true,
    restricted: false,
    allowedChannels: []
  },
  {
    name: 'boop',
    enabled: true,
    restricted: false,
    allowedChannels: []
  },
  {
    name: 'attack',
    enabled: true,
    restricted: false,
    allowedChannels: []
  },
  {
    name: 'hug',
    enabled: true,
    restricted: false,
    allowedChannels: []
  },
  {
    name: 'kiss',
    enabled: true,
    restricted: false,
    allowedChannels: []
  },
  {
    name: 'welcome',
    enabled: false,
    channel: '',
    background: '',
    message: 'default'
  },
  {
    name: 'goodbye',
    enabled: false,
    channel: '',
    message: 'default',
    banMessage: 'default'
  },
  {
    name: 'torrent',
    enabled: true,
    restricted: false,
    allowedChannels: []
  },
  {
    name: 'rank',
    enabled: false,
    restricted: false,
    allowedChannels: [],
    xpBlacklistChannels: [],
    xpPerMessage: 2,
    messageCooldown: 8,
    xpInVoiceChat: 3,
    voiceChatCooldown: 60,
    announceLevelUp: true,
    announceLevelUpChannel: '',
    users: []
  },
  {
    name: 'profile',
    enabled: true,
    restricted: false,
    allowedChannels: []
  },
  {
    name: 'say',
    enabled: true,
    restricted: false,
    allowedChannels: []
  }
];
