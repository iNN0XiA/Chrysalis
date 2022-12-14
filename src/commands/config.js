const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fetch = require('node-fetch');
const Canvas = require('canvas');
const reloadSlashCommands = require('../utils/reloadSlashCommands.js');
const connectToDatabase = require('../utils/connectToDatabase.js');
const reply = require('../utils/reply.js');
const defaultModules = require('../defaultModules.js');
const validModules = defaultModules.map(m => m.name);

module.exports = {
    name: 'config',
    alias: ['module', 'modules', 'editmodule', 'enable', 'disable', 'reset'],
    admin: true,
    run: async (client, message, command, args, lang, guildInfo) => {

        let requestedModule = args[0] ? args[0].toLowerCase() : null;
        if (!requestedModule || validModules.indexOf(requestedModule) == -1) return message.channel.send({
            embeds: [{
                title: lang.valid_modules,
                description: validModules.map(m => `[${m}](https://chrysalis-docs.programmerpony.com${guildInfo.lang == 'es' ? '/es/' : '/'}modules/${m}.html)`).join('\n'),
                color: guildInfo.color
            }]
        });

        if (command == 'enable' || command == 'disable') return switchModule(message, requestedModule, command == 'enable', guildInfo, lang);
        if (command == 'reset') return resetModule(message, requestedModule, guildInfo, lang);

        let action = args[1];
        if (!action) return await moduleInfo(message, requestedModule, guildInfo, lang);

        switch (action) {
            case 'enable':
            case 'disable':
                switchModule(message, requestedModule, action == 'enable', guildInfo, lang);
                break;
            case 'reset':
                resetModule(message, requestedModule, guildInfo, lang);
                break;
            default:
                checkAction(message, requestedModule, action, guildInfo, args, lang);
                break;
        }

    }
}

async function switchModule(message, requestedModule, enable, guildInfo, lang) {
    // Enables or disables a module
    let targetModule = guildInfo.modules.find((c) => c.name == requestedModule);
    if (targetModule.enabled == enable) return reply(message, { content: enable ? lang.module_already_enabled(requestedModule) : lang.module_already_disabled(requestedModule) }, true); // Do not update database if nothing will change
    targetModule.enabled = enable;
    await update(requestedModule, message, guildInfo, lang, enable ? lang.module_enabled(requestedModule) : lang.module_disabled(requestedModule));
    await reloadSlashCommands(message.client, message.guild, guildInfo);
}

async function moduleInfo(message, requestedModule, guildInfo, lang, content, interaction, index) {

    let moduleObj = guildInfo.modules.find((c) => c.name == requestedModule);
    let embed = [];
    let i = 0;
    for (key in moduleObj) {
        if (key == 'name' || key == 'users') continue;
        if (embed[i]?.data.fields.length == 5) i++;
        embed[i] ??= new EmbedBuilder({ // Create page if it doesn't exist
            title: requestedModule,
            url: `https://chrysalis-docs.programmerpony.com${guildInfo.lang == 'es' ? '/es/' : '/'}modules/${requestedModule}.html`,
            color: guildInfo.color,
            footer: { text: lang.check_documentation }
        });
        switch (typeof moduleObj[key]) {
            case 'boolean':
                embed[i].addFields({ name: key, value: moduleObj[key] ? '✅' : '❌' });
                break;
            case 'string':
                let content = moduleObj[key];
                if (key.toLowerCase().endsWith('channel') && content) content = `<#${content}>`;
                if (content == 'default') content = lang.defaultValues[requestedModule]?.[key] || content;
                embed[i].addFields({ name: key, value: content || '...' });
                break;
            case 'number':
                embed[i].addFields({ name: key, value: `${moduleObj[key]}` });
                break;
            case 'object':
                if (Array.isArray(moduleObj[key])) {
                    if (!moduleObj[key].length) embed[i].addFields({ name: key, value: '[]' });
                    else if (key.toLowerCase().endsWith('channels')) embed[i].addFields({ name: key, value: `<#${moduleObj[key].join('>\n<#')}>` });
                    else embed[i].addFields({ name: key, value: moduleObj[key].join('\n') });
                }
                break;
        }
    }

    let leftButton = new ButtonBuilder({
        style: ButtonStyle.Secondary,
        label: '<',
        customId: 'left',
        disabled: !index
    });
    let rightButton = new ButtonBuilder({
        style: ButtonStyle.Secondary,
        label: '>',
        customId: 'right',
        disabled: index == embed.length - 1
    });
    let editButton = new ButtonBuilder({
        style: ButtonStyle.Primary,
        label: lang.edit,
        customId: `edit`
    });
    let info = {
        content: content,
        embeds: [embed[index || 0]],
        components: [new ActionRowBuilder().addComponents(embed.length > 1 ? [leftButton, editButton, rightButton] : [editButton])]
    };
    try {
        info = interaction ? await interaction.editReply(info) : message.author ? await message.channel.send(info) : await message.editReply(info);
    } catch (e) {
        return;
    }

    let filter = (bi) => bi.user.id === message.member.id;
    let collector = info.createMessageComponentCollector({ filter, time: 120000 });
    let currentPage = 0;
    collector.on('collect', async (i) => {
        switch (i.customId) {
            case 'left':
                if (currentPage > 0) currentPage--;
                leftButton.setDisabled(currentPage == 0);
                rightButton.setDisabled(false);
                break;
            case 'right':
                if (currentPage < embed.length - 1) currentPage++;
                rightButton.setDisabled(currentPage == embed.length - 1);
                leftButton.setDisabled(false);
                break;
            case 'edit':
                let modal = new ModalBuilder({
                    customId: `module-${requestedModule}`,
                    title: requestedModule
                });
                for (let p of i.message.embeds[0].fields) modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder({
                    customId: p.name,
                    label: lang[p.name],
                    style: (typeof moduleObj[p.name] == 'string' || Array.isArray(moduleObj[p.name])) ? TextInputStyle.Paragraph : TextInputStyle.Short,
                    value: moduleObj[p.name] === 'default' ? lang.defaultValues[requestedModule]?.[p.name] || 'default' : Array.isArray(moduleObj[p.name]) ? moduleObj[p.name].join('\n') : `${moduleObj[p.name]}`,
                    required: false
                })));
                try {
                    await i.showModal(modal);
                    let filter = (i) => i.customId === `module-${requestedModule}`;
                    return await i.awaitModalSubmit({ filter, time: 120_000 }).then(async (answer) => {
                        let data = {};
                        answer.fields.fields.mapValues(f => data[f.customId] = f.value);
                        await answer.deferUpdate();
                        collector.stop();
                        editModule(message, requestedModule, guildInfo, lang, answer, data, currentPage);
                    });
                } catch (e) {
                    return;
                }
        }
        await i.update({
            embeds: [embed[currentPage]],
            components: [new ActionRowBuilder().addComponents(embed.length > 1 ? [leftButton, editButton, rightButton] : [editButton])]
        }).catch(r => { });
    });
    collector.on('end', async (collected, reason) => {
        if (reason == 'time') {
            leftButton.setDisabled(true);
            rightButton.setDisabled(true);
            editButton.setDisabled(true);
            await info.edit({
                embeds: [embed[currentPage].setFooter({ text: `${lang.check_documentation}\n${lang.module_time_out}` })],
                components: [new ActionRowBuilder().addComponents(embed.length > 1 ? [leftButton, editButton, rightButton] : [editButton])]
            }).catch(r => { });
        }
    });

}

async function checkAction(message, requestedModule, key, guildInfo, args, lang) {

    let moduleObj = guildInfo.modules.find((c) => c.name == requestedModule);
    if (!(key in moduleObj) || (key === 'name' || key === 'users')) return reply(message, { content: lang.module_property_not_found }, true);
    if (args.length <= 2) return reply(message, { content: lang.please_specify_a_new_value }, true);
    switch (typeof moduleObj[key]) {
        case 'number':
            if (isNaN(parseInt(args[2])) || parseInt(args[2]) >= Number.MAX_SAFE_INTEGER || parseInt(args[2]) < 0) return reply(message, { content: lang.please_type_a_valid_positive_integer }, true);
            if (key == 'filter') {
                try {
                    let json = await fetch(`https://manebooru.art/api/v1/json/filters/${moduleObj[key]}`).then(res => res.json());
                    if (!json.filter) return reply(message, { content: lang.filter_not_found }, true);
                } catch (e) { return reply(message, { content: lang.filter_not_found }, true); }
            }
            moduleObj[key] = parseInt(args[2]);
            break;
        case 'boolean':
            let b = stringToBoolean(args[2]);
            if (b === 'e') return reply(message, { content: lang.value_must_be_true_or_false }, true);
            if (key == 'enabled') return switchModule(message, requestedModule, b, guildInfo, lang);
            moduleObj[key] = b;
            break;
        default:
            if (Array.isArray(moduleObj[key])) {
                if (key === 'words') return moduleInfo(message, requestedModule, guildInfo, lang, lang.use_modal_instead);
                args.shift();
                args.shift();
                if (key.toLowerCase().endsWith('channels')) {
                    await message.guild.channels.fetch();
                    for (let c in args) {
                        if (args[c].startsWith('<#')) args[c] = args[c].slice(2, -1);
                        if (!message.guild.channels.cache.get(args[c])) return reply(message, { content: lang.invalid_channel }, true);
                    }
                }
                moduleObj[key] = args;
            } else {
                moduleObj[key] = args[2];
                if (key.toLowerCase().endsWith('channel')) {
                    if (moduleObj[key].startsWith('<#')) moduleObj[key] = moduleObj[key].slice(2, -1);
                    await message.guild.channels.fetch();
                    if (!message.guild.channels.cache.get(moduleObj[key])) return reply(message, { content: lang.please_type_a_valid_channel }, true);
                }
                if (key.toLowerCase().endsWith('message')) {
                    args.shift();
                    args.shift();
                    moduleObj[key] = args.join(' ');
                }
                if (key == 'background') {
                    try {
                        await Canvas.loadImage(args[2]);
                        moduleObj[key] = args[2];
                    } catch (e) {
                        return reply(message, { content: lang.unsupported_image_type }, true);
                    }
                }
            }
    }
    await update(requestedModule, message, guildInfo, lang);
}

async function update(requestedModule, message, guildInfo, lang, content, interaction, index) {
    let db = await connectToDatabase();
    let guilds = db.db('chrysalis').collection('guilds');
    await guilds.updateOne({ id: message.guild.id }, { $set: { modules: guildInfo.modules } });
    db.close();
    await moduleInfo(message, requestedModule, guildInfo, lang, content || lang.module_updated, interaction, index);
}

async function resetModule(message, requestedModule, guildInfo, lang) {
    let i = guildInfo.modules.findIndex((c) => c.name == requestedModule);
    guildInfo.modules[i] = defaultModules.find((c) => c.name == requestedModule);
    await update(requestedModule, message, guildInfo, lang);
    await reloadSlashCommands(message.client, message.guild, guildInfo);
}

async function editModule(message, requestedModule, guildInfo, lang, answer, data, index) {

    let moduleObj = guildInfo.modules.find((c) => c.name == requestedModule);

    keys:
    for (key in data) {
        switch (typeof moduleObj[key]) {
            case 'number':
                if (isNaN(parseInt(data[key])) || parseInt(data[key]) >= Number.MAX_SAFE_INTEGER || parseInt(data[key]) < 0) {
                    answer.followUp({ content: lang.please_type_a_valid_positive_integer, ephemeral: true });
                    continue keys;
                }
                if (key === 'filter') {
                    try {
                        let json = await fetch(`https://manebooru.art/api/v1/json/filters/${data[key]}`).then(res => res.json());
                        if (!json.filter) throw 'Filter not found!';
                    } catch (e) {
                        answer.followUp({ content: lang.filter_not_found, ephemeral: true });
                        continue keys;
                    }
                }
                moduleObj[key] = parseInt(data[key]);
                break;

            case 'boolean':
                let b = stringToBoolean(data[key]);
                if (b === 'e') {
                    answer.followUp({ content: lang.value_must_be_true_or_false, ephemeral: true });
                    continue keys;
                }
                if (moduleObj[key] === b) continue keys;
                moduleObj[key] = b;
                if (key == 'enabled') await reloadSlashCommands(message.client, message.guild, guildInfo);
                break;

            case 'string':
                if (key.toLowerCase().endsWith('channel') && data[key]) {
                    if (data[key].startsWith('<#')) moduleObj[key] = data[key].slice(2, -1);
                    await message.guild.channels.fetch();
                    if (!message.guild.channels.cache.get(data[key])) {
                        answer.followUp({ content: lang.please_type_a_valid_channel, ephemeral: true });
                        continue keys;
                    }
                }
                if (key == 'background' && data[key]) {
                    try {
                        await Canvas.loadImage(data[key]);
                        moduleObj[key] = data[key];
                    } catch (e) {
                        answer.followUp({ content: lang.unsupported_image_type, ephemeral: true });
                        continue keys;
                    }
                }
                moduleObj[key] = data[key];
                break;

            case 'object':
                if (Array.isArray(moduleObj[key])) {
                    let arr = [...new Set(data[key]
                        .replaceAll(' ', '\n')
                        .replaceAll(',', '\n')
                        .replaceAll('<', '\n')
                        .replaceAll('#', '\n')
                        .replaceAll('>', '\n')
                        .split('\n')
                        .filter(e => e !== ''))];
                    if (key.toLowerCase().endsWith('channels') && data[key]) {
                        await message.guild.channels.fetch();
                        for (let c of arr) {
                            if (c.startsWith('<#')) c = c.slice(2, -1);
                            if (!message.guild.channels.cache.get(c)) {
                                answer.followUp({ content: lang.invalid_channel, ephemeral: true });
                                continue keys;
                            }
                        }
                    }
                    if (arr.length && !arr[0]) arr = [];
                    moduleObj[key] = arr;
                }

        }
    }

    update(requestedModule, message, guildInfo, lang, undefined, answer, index);

}

function stringToBoolean(str) {
    str = str.toLowerCase();
    if ([
        'true',
        'yes',
        ':white_check_mark:',
        '✅',
        '1'
    ].indexOf(str) > -1) return true;
    if ([
        'false',
        'no',
        ':x:',
        '❌',
        '0'
    ].indexOf(str) > -1) return false;
    return 'e';
}
