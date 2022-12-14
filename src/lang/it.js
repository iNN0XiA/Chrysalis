const { ApplicationCommandOptionType } = require('discord.js');
const defaultModules = require('../defaultModules.js');
const emojis = require('../emojis.js');

module.exports = {
  meta: {
    name: 'Italiano',
    new_lang_message: 'Parlerò in italiano.'
  },
  author: 'Autore',
  message: 'Messaggio',
  channel: 'Canale',
  user_commands: 'Comandi:',
  admin_commands: 'Comandi Admin:',
  // DO NOT TRANSLATE COMMAND NAMES
  commands: {
    user: [
      {
        name: 'avatar',
        description: `Invia il avatar dell'utente menzionato.`,
        options: [
          {
            name: 'utente',
            type: ApplicationCommandOptionType.User,
            description: `L'utente di cui vuoi inviare l'avatar`
          }
        ]
      },
      {
        name: 'userinfo',
        description: `Mostra informazioni account dell'utente menzionato.`,
        options: [
          {
            name: 'utente',
            type: ApplicationCommandOptionType.User,
            description: `L'utente di cui vuoi mostrare l'informazione.`
          }
        ]
      },
      {
        name: 'roleinfo',
        description: 'Mostra informazioni sul ruolo.',
        options: [
          {
            name: 'ruolo',
            type: ApplicationCommandOptionType.Role,
            description: `Il ruolo di cui vuoi mostrare l'informazione.`,
            required: true
          }
        ]
      },
      {
        name: 'serverinfo',
        description: 'Mostra informazioni sul server.'
      },
      {
        name: 'rank',
        description: 'Mostra il tuo XP e livello nel tabellone.',
        options: [
          {
            name: 'utente',
            type: ApplicationCommandOptionType.User,
            description: `Il grado dell'utente da visualizzare.`
          }
        ]
      },
      {
        name: 'leaderboard',
        description: 'Mostra gli utenti con più XP.'
      },
      {
        name: 'profile',
        description: 'Modifica il tuo profilo (in ogni server).'
      },
      {
        name: 'emoji',
        description: `Invia l'emoji come un'immagine.`,
        options: [
          {
            name: 'emoji',
            type: ApplicationCommandOptionType.String,
            description: `L'emoji di cui vuoi cambiare in un'immagine.`,
            required: true
          }
        ]
      },
      {
        name: 'love',
        description: 'Verifica la compatibilità tra due utenti.',
        options: [
          {
            name: 'amante1',
            type: ApplicationCommandOptionType.User,
            description: 'Primo membro della coppia.',
            required: true
          },
          {
            name: 'amante2',
            type: ApplicationCommandOptionType.User,
            description: 'Secondo membro della coppia.',
            required: true
          }
        ]
      },
      {
        name: 'boop',
        description: `Boop un'utente.`,
        options: [
          {
            name: 'utente',
            type: ApplicationCommandOptionType.User,
            description: `L'utente di cui vuoi fare un boop.`,
            required: true
          }
        ]
      },
      {
        name: 'hug',
        description: `Abbraccia un'utente.`,
        options: [
          {
            name: 'utente',
            type: ApplicationCommandOptionType.User,
            description: `L'utente di cui vuoi abbracciare.`,
            required: true
          }
        ]
      },
      {
        name: 'kiss',
        description: `Bacia un'utente.`,
        options: [
          {
            name: 'utente',
            type: ApplicationCommandOptionType.User,
            description: `L'utente che vuoi baciare`,
            required: true
          }
        ]
      },
      {
        name: 'booru',
        description: `Invia un'immagine SFW da Manebooru.`,
        options: [
          {
            name: 'tags',
            type: ApplicationCommandOptionType.String,
            description: 'Parola chiave da ricercare (separare con virgole).'
          }
        ]
      },
      {
        name: 'clop',
        description: `Invia un'immagine NSFW da Manebooru.`,
        nsfw: true,
        options: [
          {
            name: 'tags',
            type: ApplicationCommandOptionType.String,
            description: 'Parola chiave da ricercare (separare con virgole).'
          }
        ]
      },
      {
        name: 'e621',
        description: `Invia un'immagine da e621.`,
        nsfw: true,
        options: [
          {
            name: 'tags',
            type: ApplicationCommandOptionType.String,
            description: 'Parola chiave da ricercare (separare con spazi).'
          }
        ]
      },
      {
        name: 'torrent',
        description: 'Torrent pony!'
      },
      {
        name: 'say',
        description: 'Chrysalis dice quello che scrivi.',
        options: [
          {
            name: 'testo',
            type: ApplicationCommandOptionType.String,
            description: 'Il testo vuoi Chyrsalis dire.',
            required: true
          }
        ]
      }
    ],
    admin: [
      {
        name: 'config',
        description: `Modifica un modulo`,
        options: [
          {
            name: 'modulo',
            type: ApplicationCommandOptionType.String,
            description: 'Scegli il modulo che vuoi modificare.',
            choices: defaultModules.map(m=>{return {name:m.name,value:m.name}}),
            required: true
          }
        ]
      },
      {
        name: 'clean',
        description: 'Elimina più messaggi contemporaneamente.',
        options: [
          {
            name: 'messaggi',
            type: ApplicationCommandOptionType.Integer,
            description: 'La quantità di messaggi che desideri eliminare.',
            minValue: 1,
            maxValue: 100,
            required: true
          }
        ]
      },
      {
        name: 'lang',
        description: 'Cambia la lingua di Chrysalis',
        options: [
          {
            name: 'lingua',
            type: ApplicationCommandOptionType.String,
            description: 'La lingua in cui vuoi che Chrysalis parli.',
            choices: [
              {
                name: 'Inglese',
                value: 'en'
              },
              {
                name: 'Spagnolo',
                value: 'es'
              },
              {
                name: 'Italiano',
                value: 'it'
              }
            ],
            required: true
          }
        ]
      },
      {
        name: 'color',
        description: 'Cambia il colore predefinito per gli incorporamenti.',
        options: [
          {
            name: 'color',
            type: ApplicationCommandOptionType.String,
            description: 'Deve essere un colore esadecimale.',
            maxLength: 7
          }
        ]
      },
      {
        name: 'welcome',
        description: `Invia un biglietto di benvenuto per l'utente specificato.`,
        options: [
          {
            name: 'utente',
            type: ApplicationCommandOptionType.User,
            description: `L'utente a cui vuoi dare il benvenuto.`
          }
        ]
      },
      {
        name: 'boost',
        description: `Invia una carta boost per l'utente specificato.`,
        options: [
          {
            name: 'utente',
            type: ApplicationCommandOptionType.User,
            description: `L'utente per cui vuoi mostrare la carta boost.`
          }
        ]
      },
      {
        name: 'setxp',
        description: `Imposta la quantità di XP che l'utente specificato ha.`,
        options: [
          {
            name: 'utente',
            type: ApplicationCommandOptionType.User,
            description: `L'utente di cui si desidera impostare l'XP.`,
            required: true
          },
          {
            name: 'xp',
            type: ApplicationCommandOptionType.Integer,
            description: 'La nuova quantità di XP.',
            minValue: 0,
            maxValue: Number.MAX_SAFE_INTEGER,
            required: true
          }
        ]
      },
      {
        name: 'importxp',
        description: 'Importa XP da robot di altri livelli!'
      },
      {
        name: 'rolemenu',
        description: 'Imposta un menu da cui gli utenti possono scegliere i ruoli!'
      }
    ]
  },
  defaultValues: {
    bannedwords: {
      message: 'Il tuo messaggio era eliminato perché contiene parole non consentito in questo server. Stai attento a quello che dici!'
    },
    boost: {
      message: '**{user} ha appena potenziato il server!**',
      title: 'Grazie mille per aver poteniziato il server!',
      description: `${emojis.NitroBoost} Goditi il tuo nuovo ruolo! ${emojis.NitroBoost}`
    },
    welcome: {
      message: 'Benvenuto a **{guild}**! {user}'
    },
    goodbye: {
      message: 'Arrivederci, **{user}**. Spero ci vediamo presto.',
      banMessage: '**{user}** è stato bannato dal server.'
    }
  },
  wrong_channel: 'Il comando che hai inviato non può essere usato in questo canale',
  message_deleted: 'Messaggio eliminato',
  you_must_send_an_emoji: `Si deve inviare un'emoji`,
  couldn_t_find_that_emoji: `Non può trovare l'emoji inviato.`,
  type_one_or_two_users: 'Digitare un o due utenti.',
  self_love: 'So che è importante amare se stessi, ma non essere un narcisista!',
  lovemeter_messages: [
    'Triste.',
    'Incompatibile.',
    'Molto Basso... Solo siete amici.',
    'Probabile amici.',
    'Non è probabile ma non impossibile.',
    'Potrebbe!',
    'È probabile. Voi potete provare.',
    'Molto compatibile! Potreste essere molto carini',
    'Baciate definitivamente.',
    'Potreste essere una relazione meravigliosa',
    'Potreste stare insieme per sempre'
  ],
  nsfw_only: 'Questo comando solo può essere usato in un canale NSFW.',
  requested_by: 'Richiesto di',
  how_to_delete: 'Clicca qui se questa immagine è inappropriate.',
  please_report: 'Segnala questa immagine in modo che non appaia più.',
  role_info: 'Info del ruolo:',
  name: 'Nome',
  color: 'Colore',
  member_count: 'Conte membro',
  date_created: 'Data di creazione',
  couldn_t_find_that_user: `Impossibile trovare l'utente .`,
  user_info: `Informazioni dell'utente:`,
  user_id: `ID dell'utente`,
  server_join_date: 'Data di iscrizione al server',
  account_creation_date: `Data di creazione dell'account`,
  roles: 'Ruoli',
  avatar: (user) => `Avatar da ${user}`,
  bulk_delete_two_weeks: 'Messaggi più vecchie di due semane non può essere eliminato.',
  bulk_delete_missing_permissions: 'Non ho i permissi necessari per ne elimnare in questo canale.',
  bulk_delete_max_100: 'Solo puoi elimnare meno che 100 messaggi.',
  no_images_found: 'Impossibile trovare immagini corrispondenti a quella ricerca.',
  jump_to_moment: 'Passa al momento',
  the_current_prefix_for_this_server_is: (prefix) => `Il prefisso attuale per questo server è ${prefix}`,
  change_prefix_to: (prefix) => `Cambia el prefisso con **${prefix}**?`,
  prefix_was_changed_to: (prefix) => `Prefisso stato cambiato con **${prefix}**`,
  valid_modules: 'Moduli validi',
  available_languages: 'Lingue disponibili',
  boop_title: (user) => `${user[0]} ha fatto un boop su ${user[1]}!`,
  boop_self: (user) => `${user} ha fatto un boop su se stesso`,
  boop_chrysalis: (user) => `${user} provava fare un boop a Chrysalis`,
  hug_title: (user) => `${user[0]} ha abbracciato ${user[1]}`,
  hug_self: (user) => `${user} ha abbracciato se stesso`,
  hug_chrysalis: (user) => `${user} ha provato abbracciare Chrysalis.`,
  kiss_title: (user) => `${user[0]} ha baciato ${user[1]}`,
  kiss_self: (user) => `${user} si bacia`,
  kiss_chrysalis: (user) => `${user} provava baciare Chrysalis`,
  server_info: 'Informazioni del server:',
  server_id: 'ID del server',
  server_owner: 'Proprietario del server',
  channels: 'Canali',
  server_boosts: 'Potenziamenti',
  image_source: `Fonte dell'immagine`,
  please_specify_a_new_value: 'Specifica un valore nuovo.',
  value_must_be_true_or_false: 'Il valore deve essere **true** o **false**.', // Do NOT translate **true** and **false**
  module_updated: 'Il modulo è aggiornato!',
  attachments: 'Allegati',
  message_id: 'ID del messaggio',
  module_enabled: (m) => `Modulo ${m} sta abilitato.`,
  module_disabled: (m) => `Modulo ${m} sta disabilitato.`,
  module_already_enabled: (m) => `Il modulo ${m} era già abilitato.`,
  module_already_disabled: (m) => `Il modulo ${m} era già disabilitato.`,
  current_color: 'Colore attuale',
  change_color_to: (hex) => `Cambia il colore in ${hex}?`,
  invalid_color: 'Colore non valido.',
  color_was_changed_to:  (hex) => `Il colore sta cambiato in ${hex}`,
  role_menu: 'Menu ruolo ',
  select_the_roles_that_you_want: 'Seleziona i ruoli che desideri',
  no_valid_roles_found: 'Nessun ruolo valido trovato. Digitare gli ID ruolo separati da ritorni a capo.',
  you_can_only_add_up_to_25_roles_to_the_menu: 'Solo puoi aggiungere 25 ruoli al menu.',
  invalid_roles_skipped: 'I ruoli non validi sono stati ignorati.',
  manage_roles_permission_required: `Chrysalis ha bisogno dell'autorizzazione \`MANAGE_ROLES\` per far funzionare i menu dei ruoli.`,
  chrysalis_role_too_low: `Il ruolo de Chrysalis ha meno permessi che il ruolo richiesto. Per favore chiedi a un'Admin per menderlo.`,
  roles_managed_by_integrations_cannot_be_manually_assigned: 'I ruoli gestiti dalle integrazioni non possono essere assegnati manualmente.',
  download_emoji: `Scarica l'emoji`,
  please_type_a_valid_channel: 'Per favore digita un canale valido.',
  invalid_channel: 'Almeno un canale è invalido.',
  invite_the_bot: 'Invita il bot',
  website: 'Sito Web',
  support_server: 'Server di supporto',
  source_code: 'Codice sorgente',
  support_the_project: 'Sostenere il progetto',
  unkown_role: 'Impossibile trovare il ruolo.',
  role_id: 'ID del ruolo',
  welcome: 'Benvenuto!',
  you_are_the_member_n: (n) => `Sei membro Nº${n}`,
  filter_not_found: 'Impossibile trovare il filtro, controlla se il filtro è pubblico.',
  help_time_out: 'Il tempo per spostarsi tra le pagine è finito.',
  old_message: 'Messagio vecchio',
  new_message: 'Messagio nuovo',
  old_attachments: 'Allegati vecchi',
  new_attachments: 'Allegati nuovi',
  message_edited: 'Messagio modificato',
  season: 'Stagione',
  seasons: 'Stagione',
  movies: 'Film',
  torrent_footer: 'Chrysalis consiglia di utilizzare qBitTorrent in quanto è privo di pubblicità e open source. I link sono forniti da yayponies.no /)',
  error_fetching_episodes: `C'era un errore durante il recupero dei link. Per favore riprova più tardi.`,
  attach_files_permission_missing: 'Chrysalis non ha permissi da inviare gli immagini in questo cannale.',
  embed_links_permission_missing: `Chrysalis non ha il permesso di inviare embed a questo canale. Si prega di concedere a Chrysalis il permesso "Incorporare i link".`,
  please_type_a_valid_positive_integer: 'Por favore, invia un numero intero positivo.',
  module_property_not_found: 'Proprietà del modulo non trovata.',
  levelup: (level) => `**Sei salito di livello!**\nOra sei di livello **${level}**!`,
  leaderboard_title: 'Classifica',
  level: 'Livello',
  rank: 'Rango',
  total_xp: 'XP Totale',
  profile: 'Profilo',
  background_image: 'Immagine di sfondo',
  profile_updated: 'Profilo Aggiornato!',
  unsupported_image_type: 'Tipo di immagine non supportato.',
  check_documentation: 'Fare clic sul nome del modulo per aprire la documentazione per questo modulo.',
  import_levels_from: 'Da quale bot vuoi importare i livelli?',
  no_levels_found: (bot) => `Nessun livello trovato da ${bot} in questo server.`,
  mee6_fix: (guildID) => `Assicurati la tua classifica MEE6 è pubblico cliccando [questa opzione](https://mee6.xyz/dashboard/${guildID}/leaderboard).`,
  xp_migration_adapt: 'Il modo in cui viene calcolato XP potrebbe essere diverso da quello di altri bot. Cosa vuoi fare?',
  import_levels_and_adapt_xp: 'Importa i livelli e adatta XP',
  import_xp_and_adapt_levels: 'Importa il XP e adatta i livelli',
  import_leaderboard: 'La classifica ora apparirà così:',
  migration_complete: 'Migrazione completata!',
  xp_successfully_imported: `L'XP è stato importato correttamente.`,
  edit: 'Modificare',
  enabled: 'Abilitato',
  logDeletedMessages: 'Registra messaggi eliminati',
  logEditedMessages: 'Registra messaggi modificati',
  words: 'Parole/frasi (separati da ritorni a capo)',
  title: 'Titolo',
  description: 'Descrizione',
  reactToLinks: 'Reagisci ai link',
  reactToFiles: 'Reagisci ai file',
  approvalEmoji: 'Emoji di approvazione',
  disapprovalEmoji: 'Emoji di disapprovazione',
  restricted: 'Comando limitato a determinati canali',
  allowedChannels: 'Canali in cui è consentito il suo utilizzo',
  filter: 'Filtro',
  background: 'Sfondo',
  banMessage: 'Messaggio di divieto',
  xpBlacklistChannels: 'Canali in cui non è possibile guadagnare XP',
  xpPerMessage: 'XP guadagnati per messaggio',
  messageCooldown: 'XP cooldown sui messaggi (in secondi)',
  xpInVoiceChat: 'XP guadagnati in VC (canale vocale)',
  voiceChatCooldown: 'Quanto spesso guadagnare XP in VC (in sec)',
  announceLevelUp: 'Annunciare i level up',
  announceLevelUpChannel: 'Canale su cui annunciare i level up',
  module_time_out: 'Il tempo per modificare questo modulo è finito',
  use_modal_instead: 'Le parole bloccate non possono essere modificate in questo modo. Si prega di utilizzare il pulsante Modificare.',
  bannedwords_deprecated: 'Questo comando è deprecato. Per modificare le parole vietate, usa `c!config bannedwords` e fai clic sul pulsante Modificare.',
  messages_deleted: (n) => `${n} messaggi${n>1?'':'o'} eliminat${n>1?'i':'o'}! ${emojis.PinkiePieYes}`,
  optional: 'opzionale',
  click_to_open_modal: 'Dal momento che non stai usando un comando slash, dovrai fare clic su questo pulsante per aprire il menu.',
  sendMessageOnDelete: 'Invia MD dopo aver eliminato il messaggio',
  ignoreAdmins: 'Ingoria i messaggi degli admin'
}
