const { ApplicationCommandOptionType } = require('discord.js');
const defaultModules = require('../defaultModules.js');
const emojis = require('../emojis.js');

module.exports = {
    meta: {
        name: 'English',
        new_lang_message: `I'll speak in English now.`
    },
    author: 'Author',
    message: 'Message',
    channel: 'Channel',
    user_commands: 'Commands:',
    admin_commands: 'Admin commands:',
    // DO NOT TRANSLATE COMMAND NAMES
    commands: {
        user: [
            {
                name: 'avatar',
                description: 'Sends the avatar of a user.',
                options: [
                    {
                        name: 'user',
                        type: ApplicationCommandOptionType.User,
                        description: 'The user whose avatar you want to be sent.'
                    }
                ]
            },
            {
                name: 'userinfo',
                description: 'Shows info about a user.',
                options: [
                    {
                        name: 'user',
                        type: ApplicationCommandOptionType.User,
                        description: 'The user you want to display info of.'
                    }
                ]
            },
            {
                name: 'roleinfo',
                description: 'Shows info about a role.',
                options: [
                    {
                        name: 'role',
                        type: ApplicationCommandOptionType.Role,
                        description: 'The role to display info of.',
                        required: true
                    }
                ]
            },
            {
                name: 'serverinfo',
                description: 'Shows info about the server.'
            },
            {
                name: 'rank',
                description: 'Shows your current level and XP.',
                options: [
                    {
                        name: 'user',
                        type: ApplicationCommandOptionType.User,
                        description: 'The user to display the rank of.'
                    }
                ]
            },
            {
                name: 'leaderboard',
                description: 'Shows the users with the most XP.'
            },
            {
                name: 'profile',
                description: 'Edit your profile (on all servers).'
            },
            {
                name: 'emoji',
                description: 'Sends the emoji as an image.',
                options: [
                    {
                        name: 'emoji',
                        type: ApplicationCommandOptionType.String,
                        description: 'The emoji you want to convert to an image.',
                        required: true
                    }
                ]
            },
            {
                name: 'love',
                description: 'Checks the compatibility level between two users.',
                options: [
                    {
                        name: 'lover1',
                        type: ApplicationCommandOptionType.User,
                        description: 'First member of the couple.',
                        required: true
                    },
                    {
                        name: 'lover2',
                        type: ApplicationCommandOptionType.User,
                        description: 'Second member of the couple.',
                        required: true
                    }
                ]
            },
            {
                name: 'boop',
                description: 'Boops a user.',
                options: [
                    {
                        name: 'user',
                        type: ApplicationCommandOptionType.User,
                        description: 'The user you want to boop.',
                        required: true
                    }
                ]
            },
            {
                name: 'hug',
                description: 'Hugs a user.',
                options: [
                    {
                        name: 'user',
                        type: ApplicationCommandOptionType.User,
                        description: 'The user you want to hug.',
                        required: true
                    }
                ]
            },
            {
                name: 'kiss',
                description: 'Kiss a user.',
                options: [
                    {
                        name: 'user',
                        type: ApplicationCommandOptionType.User,
                        description: 'The user you want to kiss.',
                        required: true
                    }
                ]
            },
            {
                name: 'booru',
                description: 'Sends an image from Manebooru.',
                options: [
                    {
                        name: 'tags',
                        type: ApplicationCommandOptionType.String,
                        description: 'Tags to search (separated by commas).'
                    }
                ]
            },
            {
                name: 'clop',
                description: 'Sends a clop image from Manebooru.',
                nsfw: true,
                options: [
                    {
                        name: 'tags',
                        type: ApplicationCommandOptionType.String,
                        description: 'Tags to search (separated by commas).'
                    }
                ]
            },
            {
                name: 'e621',
                description: 'Sends an image from e621.',
                nsfw: true,
                options: [
                    {
                        name: 'tags',
                        type: ApplicationCommandOptionType.String,
                        description: 'Tags to search (separated by spaces).'
                    }
                ]
            },
            {
                name: 'torrent',
                description: 'Torrent ponies!'
            },
            {
                name: 'say',
                description: 'Chrysalis says what you type.',
                options: [
                    {
                        name: 'text',
                        type: ApplicationCommandOptionType.String,
                        description: 'The text you want Chrysalis to say.',
                        required: true
                    }
                ]
            }
        ],
        admin: [
            {
                name: 'config',
                description: `Edit Chrysalis' modules`,
                options: [
                    {
                        name: 'module',
                        type: ApplicationCommandOptionType.String,
                        description: 'Choose the module that you want to edit.',
                        choices: defaultModules.map(m => { return { name: m.name, value: m.name } }),
                        required: true
                    }
                ]
            },
            {
                name: 'clean',
                description: 'Bulk delete messages.',
                options: [
                    {
                        name: 'messages',
                        type: ApplicationCommandOptionType.Integer,
                        description: 'The amount of messages that you want to delete.',
                        minValue: 1,
                        maxValue: 100,
                        required: true
                    }
                ]
            },
            {
                name: 'lang',
                description: `Change Chrysalis' language.`,
                options: [
                    {
                        name: 'language',
                        type: ApplicationCommandOptionType.String,
                        description: 'The language you want Chrysalis to speak in.',
                        choices: [
                            {
                                name: 'English',
                                value: 'en'
                            },
                            {
                                name: 'Spanish',
                                value: 'es'
                            },
                            {
                                name: 'Italian',
                                value: 'it'
                            }
                        ],
                        required: true
                    }
                ]
            },
            {
                name: 'color',
                description: 'Change the default color for embeds.',
                options: [
                    {
                        name: 'color',
                        type: ApplicationCommandOptionType.String,
                        description: 'Must be a hexadecimal color.',
                        maxLength: 7
                    }
                ]
            },
            {
                name: 'welcome',
                description: 'Sends a welcome card for the specified user.',
                options: [
                    {
                        name: 'user',
                        type: ApplicationCommandOptionType.User,
                        description: 'The user you want to welcome.'
                    }
                ]
            },
            {
                name: 'boost',
                description: 'Sends a boost card for the specified user.',
                options: [
                    {
                        name: 'user',
                        type: ApplicationCommandOptionType.User,
                        description: 'The user you want to show the boost card for.'
                    }
                ]
            },
            {
                name: 'setxp',
                description: 'Set the amount of XP that the specified user has.',
                options: [
                    {
                        name: 'user',
                        type: ApplicationCommandOptionType.User,
                        description: 'The user you want to set the XP of.',
                        required: true
                    },
                    {
                        name: 'xp',
                        type: ApplicationCommandOptionType.Integer,
                        description: 'The new amount of XP.',
                        minValue: 0,
                        maxValue: Number.MAX_SAFE_INTEGER,
                        required: true
                    }
                ]
            },
            {
                name: 'importxp',
                description: 'Import XP from other level bots!'
            },
            {
                name: 'rolemenu',
                description: 'Set up a menu for users to pick roles from!'
            }
        ]
    },
    defaultValues: {
        bannedwords: {
            message: 'Your message was removed due to containing something not allowed in the server. Please, be careful with what you say.'
        },
        boost: {
            message: '**{user} just boosted the server!**',
            title: 'Thank you for boosting the server!',
            description: `${emojis.NitroBoost} Enjoy your exclusive role! ${emojis.NitroBoost}`
        },
        welcome: {
            message: 'Welcome to **{guild}**! {user}'
        },
        goodbye: {
            message: 'Goodbye, **{user}**. Hope we can see you again soon.',
            banMessage: '**{user}** was banned from the server.'
        }
    },
    wrong_channel: 'The command you sent cannot be used in that channel.',
    message_deleted: 'Message deleted',
    you_must_send_an_emoji: 'You need to send an emoji.',
    couldn_t_find_that_emoji: `Couldn't find that emoji.`,
    type_one_or_two_users: 'Type one or two users.',
    self_love: `I know self-love is important, but don't be a narcissist.`,
    lovemeter_messages: [
        'Sad.',
        'Incompatible.',
        'Very low... Just friends.',
        'Probably just friends.',
        'Very unlikely but there may be something.',
        `There could be something, but I don't want to get your hopes up.`,
        'Very likely to be something. You can try.',
        'Quite compatible. Could be a cute couple.',
        'These two are making out for sure.',
        'Could be a wonderful couple.',
        'They are meant to be together forever.'
    ],
    nsfw_only: 'This command can only be used in NSFW channels.',
    requested_by: 'Requested by',
    how_to_delete: 'Click here if this image is inappropriate.',
    please_report: `Please report this image so it doesn't show up again.`,
    role_info: 'Role info:',
    name: 'Name',
    color: 'Color',
    member_count: 'Member count',
    date_created: 'Date created',
    couldn_t_find_that_user: `Couldn't find that user.`,
    user_info: 'User info:',
    user_id: 'User ID',
    server_join_date: 'Server join date',
    account_creation_date: 'Account creation date',
    roles: 'Roles',
    avatar: (user) => `${user}'${user.endsWith('s') ? '' : 's'} avatar`,
    bulk_delete_two_weeks: 'Messages older than 2 weeks can not be removed.',
    bulk_delete_missing_permissions: 'I do not have permission to delete messages in this channel.',
    bulk_delete_max_100: 'You can only remove less than 100 messages at once.',
    no_images_found: `Couldn't find any images matching that query.`,
    jump_to_moment: 'Jump to moment',
    the_current_prefix_for_this_server_is: (prefix) => `The current prefix for this server is ${prefix}`,
    change_prefix_to: (prefix) => `Change the prefix to **${prefix}**?`,
    prefix_was_changed_to: (prefix) => `Prefix was changed to **${prefix}**`,
    valid_modules: 'Valid modules',
    available_languages: 'Available languages',
    boop_title: (user) => `${user[0]} booped ${user[1]}!`,
    boop_self: (user) => `${user} booped themself`,
    boop_chrysalis: (user) => `${user} tried to boop Chrysalis`,
    hug_title: (user) => `${user[0]} hugged ${user[1]}`,
    hug_self: (user) => `${user} hugged themself`,
    hug_chrysalis: (user) => `${user} tried to hug Chryalis`,
    kiss_title: (user) => `${user[0]} kissed ${user[1]}`,
    kiss_self: (user) => `${user} kissed themself`,
    kiss_chrysalis: (user) => `${user} tried to kiss Chrysalis`,
    server_info: 'Server info:',
    server_id: 'Server ID',
    server_owner: 'Server owner',
    channels: 'Channels',
    server_boosts: 'Server boosts',
    image_source: 'Image source',
    please_specify_a_new_value: 'Please, specify a new value.',
    value_must_be_true_or_false: 'The value must be **true** or **false**.', // Do NOT translate **true** and **false**
    module_updated: 'Module updated!',
    attachments: 'Attachments',
    message_id: 'Message ID',
    module_enabled: (m) => `Module ${m} enabled!`,
    module_disabled: (m) => `Module ${m} disabled!`,
    module_already_enabled: (m) => `Module  ${m} was already enabled.`,
    module_already_disabled: (m) => `Module  ${m} was already disabled.`,
    current_color: 'Current color',
    change_color_to: (hex) => `Change color to ${hex}?`,
    invalid_color: 'Invalid color.',
    color_was_changed_to: (hex) => `Color was changed to ${hex}`,
    role_menu: 'Role menu',
    select_the_roles_that_you_want: 'Select the roles that you want',
    no_valid_roles_found: 'No valid roles found. Type role IDs separated by line breaks.',
    you_can_only_add_up_to_25_roles_to_the_menu: 'You can only add up to 25 roles to the menu.',
    invalid_roles_skipped: 'Invalid roles were skipped.',
    manage_roles_permission_required: 'Chrysalis needs the `MANAGE_ROLES` permission for role menus to work.',
    chrysalis_role_too_low: `Chrysalis' role is lower than the role you're requesting. Please, ask an admin to fix it.`,
    roles_managed_by_integrations_cannot_be_manually_assigned: 'Roles managed by integrations cannot be manually assigned.',
    download_emoji: 'Download emoji',
    please_type_a_valid_channel: 'Please, type a valid channel.',
    invalid_channel: 'At least one of the channels you typed is invalid.',
    invite_the_bot: 'Invite the bot',
    website: 'Website',
    support_server: 'Support Server',
    source_code: 'Source code',
    support_the_project: 'Support the project',
    unkown_role: `Couldn't find that role.`,
    role_id: 'Role ID',
    welcome: 'Welcome!',
    you_are_the_member_n: (n) => `You are the member Nº${n}`,
    filter_not_found: 'Filter not found. Please, make sure that the filter is public.',
    help_time_out: 'Time to move between pages is over.',
    old_message: 'Old message',
    new_message: 'New message',
    old_attachments: 'Old attachments',
    new_attachments: 'New attachments',
    message_edited: 'Message edited',
    season: 'Season',
    seasons: 'Seasons',
    movies: 'Movies',
    torrent_footer: 'Chrysalis recommends using qBitTorrent, since it is ad-free and open source. Links are provided by yayponies.no /)',
    error_fetching_episodes: 'There was an error fetching the episodes. Please, try again later.',
    attach_files_permission_missing: `Chrysalis doesn't have permission to send images to this channel.`,
    embed_links_permission_missing: `Chrysalis doesn't have permission to send embeds to this channel. Please give Chrysalis the "Embed links" permission.`,
    please_type_a_valid_positive_integer: 'Please type a valid positive integer.',
    module_property_not_found: 'Module property not found.',
    levelup: (level) => `**Level up!**\nYou're level **${level}** now!`,
    leaderboard_title: 'Leaderboard',
    level: 'Level',
    rank: 'Rank',
    total_xp: 'Total XP',
    profile: 'Profile',
    background_image: 'Background image',
    profile_updated: 'Profile updated!',
    unsupported_image_type: 'Unsupported image type.',
    check_documentation: 'Click on the module name to open the documentation for this module.',
    import_levels_from: 'Which bot do you want to import levels from?',
    no_levels_found: (bot) => `No levels found from ${bot} on this server.`,
    mee6_fix: (guildID) => `Please make sure your MEE6 leaderboard is public by checking [this option](https://mee6.xyz/dashboard/${guildID}/leaderboard).`,
    xp_migration_adapt: 'The way Chrysalis calculates levels may vary from other bots. What do you want to do?',
    import_levels_and_adapt_xp: 'Import levels and adapt XP',
    import_xp_and_adapt_levels: 'Import XP and adapt levels',
    import_leaderboard: 'The leaderboard will now look like this:',
    migration_complete: 'Migration complete!',
    xp_successfully_imported: 'XP has been successfully imported.',
    edit: 'Edit',
    enabled: 'Enabled',
    logDeletedMessages: 'Log deleted messages',
    logEditedMessages: 'Log edited messages',
    words: 'Words/phrases (separated by line breaks)',
    title: 'Title',
    description: 'Description',
    reactToLinks: 'React to links',
    reactToFiles: 'React to files',
    approvalEmoji: 'Approval emoji',
    disapprovalEmoji: 'Disapproval emoji',
    restricted: 'Command restricted to certain channels',
    allowedChannels: 'Channels the command is restricted to',
    filter: 'Filter',
    background: 'Background',
    banMessage: 'Ban message',
    xpBlacklistChannels: 'Channels where XP cannot be earned',
    xpPerMessage: 'XP earned per message',
    messageCooldown: 'XP cooldown on messages (in seconds)',
    xpInVoiceChat: 'XP earned in VC',
    voiceChatCooldown: 'How often to earn XP in VC (in seconds)',
    announceLevelUp: 'Announce level ups',
    announceLevelUpChannel: 'Level up announcements channel',
    module_time_out: 'Time to edit this module is over.',
    use_modal_instead: 'Banned words cannot be edited this way. Please, use the Edit button.',
    bannedwords_deprecated: 'This command is deprecated. To edit banned words, use `c!config bannedwords` and click the Edit button.',
    messages_deleted: (n) => `${n} message${n > 1 ? 's' : ''} deleted! ${emojis.PinkiePieYes}`,
    optional: 'optional',
    click_to_open_modal: `Since you're not using a slash command, you'll need to clcik this button to open the modal.`,
    sendMessageOnDelete: 'Send DM after deleting message',
    ignoreAdmins: 'Ingore admin messages'
}