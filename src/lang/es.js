const { ApplicationCommandOptionType } = require('discord.js');
const defaultModules = require('../defaultModules.js');
const emojis = require('../emojis.js');

module.exports = {
  meta: {
    name: 'Español',
    new_lang_message: 'Ahora hablaré en español.'
  },
  author: 'Autor',
  message: 'Mensaje',
  channel: 'Canal',
  user_commands: 'Comandos:',
  admin_commands: 'Comandos de administradores:',
  // DO NOT TRANSLATE COMMAND NAMES
  commands: {
    user: [
      {
        name: 'avatar',
        description: 'Envía el avatar del usuario.',
        options: [
          {
            name: 'usuario',
            type: ApplicationCommandOptionType.User,
            description: 'El usuario del que enviar el avatar.'
          }
        ]
      },
      {
        name: 'userinfo',
        description: 'Muestra información sobre el usuario.',
        options: [
          {
            name: 'usuario',
            type: ApplicationCommandOptionType.User,
            description: 'El usuario del que mostrar la información.'
          }
        ]
      },
      {
        name: 'roleinfo',
        description: 'Envía información sobre el rol.',
        options: [
          {
            name: 'rol',
            type: ApplicationCommandOptionType.Role,
            description: 'Rol del que mostrar la información.',
            required: true
          }
        ]
      },
      {
        name: 'serverinfo',
        description: 'Muestra información sobre el servidor.'
      },
      {
        name: 'rank',
        description: 'Muestra tu nivel y experiencia actual.',
        options: [
          {
            name: 'usuario',
            type: ApplicationCommandOptionType.User,
            description: 'El usuario del que mostrar el nivel.'
          }
        ]
      },
      {
        name: 'leaderboard',
        description: 'Muestra los usuarios con más experiencia.'
      },
      {
        name: 'profile',
        description: 'Edita tu perfil (en todos los servidores).'
      },
      {
        name: 'emoji',
        description: 'Envía el emoji como una imagen.',
        options: [
          {
            name: 'emoji',
            type: ApplicationCommandOptionType.String,
            description: 'El emoji que quieres convertir en imagen.',
            required: true
          }
        ]
      },
      {
        name: 'love',
        description: 'Comprueba el nivel de compatibilidad entre dos usuarios.',
        options: [
          {
            name: 'amante1',
            type: ApplicationCommandOptionType.User,
            description: 'El primer miembro de la pareja.',
            required: true
          },
          {
            name: 'amante2',
            type: ApplicationCommandOptionType.User,
            description: 'El segundo miembro de la pareja.',
            required: true
          }
        ]
      },
      {
        name: 'boop',
        description: 'Hace boop a un usuario.',
        options: [
          {
            name: 'usuario',
            type: ApplicationCommandOptionType.User,
            description: 'El usuario al que quieres hacer boop.',
            required: true
          }
        ]
      },
      {
        name: 'Attack',
        description: `Attack un'utente.`,
        options: [
          {
            name: 'Attack',
            type: ApplicationCommandOptionType.User,
            description: `L'utente di cui vuoi fare un Fight.`,
            required: true
          }
        ]
      },
      {
        name: 'hug',
        description: 'Abraza a un usuario.',
        options: [
          {
            name: 'usuario',
            type: ApplicationCommandOptionType.User,
            description: 'El usuario al que quieres abrazar.',
            required: true
          }
        ]
      },
      {
        name: 'kiss',
        description: 'Besa a un usuario.',
        options: [
          {
            name: 'usuario',
            type: ApplicationCommandOptionType.User,
            description: 'El usuario al que quieres besar.',
            required: true
          }
        ]
      },
      {
        name: 'booru',
        description: 'Envía una imagen de Manebooru.',
        options: [
          {
            name: 'tags',
            type: ApplicationCommandOptionType.String,
            description: 'Tags para buscar (separados por comas).'
          }
        ]
      },
      {
        name: 'clop',
        description: 'Envía una imagen clop de Manebooru.',
        nsfw: true,
        options: [
          {
            name: 'tags',
            type: ApplicationCommandOptionType.String,
            description: 'Tags para buscar (separados por comas).'
          }
        ]
      },
      {
        name: 'e621',
        description: 'Envía una imagen de e621.',
        nsfw: true,
        options: [
          {
            name: 'tags',
            type: ApplicationCommandOptionType.String,
            description: 'Tags para buscar (separados por espacios).'
          }
        ]
      },
      {
        name: 'torrent',
        description: '¡Ponis por torrent!'
      },
      {
        name: 'say',
        description: 'Chrysalis dice lo que escribas.',
        options: [
          {
            name: 'texto',
            type: ApplicationCommandOptionType.String,
            description: 'Lo que quieres que Chrysalis diga.',
            required: true
          }
        ]
      }
    ],
    admin: [
      {
        name: 'config',
        description: `Edita los módulos de Chrysalis`,
        options: [
          {
            name: 'módulo',
            type: ApplicationCommandOptionType.String,
            description: 'Elige el módulo que quieras editar.',
            choices: defaultModules.map(m=>{return {name:m.name,value:m.name}}),
            required: true
          }
        ]
      },
      {
        name: 'clean',
        description: 'Borra varios mensajes a la vez.',
        options: [
          {
            name: 'mensajes',
            type: ApplicationCommandOptionType.Integer,
            description: 'La cantidad de mensajes que quieres borrar.',
            minValue: 1,
            maxValue: 100,
            required: true
          }
        ]
      },
      {
        name: 'lang',
        description: 'Cambia el idioma de Chrysalis.',
        options: [
          {
            name: 'idioma',
            type: ApplicationCommandOptionType.String,
            description: 'El idioma en el que quieres que hable Chrysalis.',
            choices: [
              {
                name: 'Inglés',
                value: 'en'
              },
              {
                name: 'Español',
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
        description: 'Cambia el color por defecto de los embeds.',
        options: [
          {
            name: 'color',
            type: ApplicationCommandOptionType.String,
            description: 'Debe ser un color hexadecimal.',
            maxLength: 7
          }
        ]
      },
      {
        name: 'welcome',
        description: 'Envía una tarjeta de bienvenida del usuario especificado.',
        options: [
          {
            name: 'usuario',
            type: ApplicationCommandOptionType.User,
            description: 'El usuario al que quieres dar la bienvenida.'
          }
        ]
      },
      {
        name: 'boost',
        description: 'Envía una tarjeta de boost del usuario especificado.',
        options: [
          {
            name: 'usuario',
            type: ApplicationCommandOptionType.User,
            description: 'El usuario del que quieres mostrar la tarjeta de boost.'
          }
        ]
      },
      {
        name: 'setxp',
        description: 'Establece la cantidad de XP del usuario especificado.',
        options: [
          {
            name: 'usuario',
            type: ApplicationCommandOptionType.User,
            description: 'El usuario al que quieres cambiar la XP.',
            required: true
          },
          {
            name: 'xp',
            type: ApplicationCommandOptionType.Integer,
            description: 'La nueva cantidad de XP.',
            minValue: 0,
            maxValue: Number.MAX_SAFE_INTEGER,
            required: true
          }
        ]
      },
      {
        name: 'importxp',
        description: 'Importa XP de otros bots de niveles.'
      },
      {
        name: 'rolemenu',
        description: 'Crea un menú para que los usuarios puedan elegir roles.'
      }
    ]
  },
  defaultValues: {
    bannedwords: {
      message: 'Se ha eliminado tu mensaje ya que estás tocando un tema que no permitimos en el servidor. Por favor, controla tu vocabulario y no trates de evadir la restricción. Esto se hace para mantener una buena convivencia.'
    },
    boost: {
      message: '**¡{user} ha boosteado el servidor!**',
      title: '¡Muchas gracias por boostear el servidor!',
      description: `${emojis.NitroBoost} ¡Disfruta de tu rol exclusivo! ${emojis.NitroBoost}`
    },
    welcome: {
      message: '¡Bienvenid@ a **{guild}**! {user}'
    },
    goodbye: {
      message: 'Adiós, **{user}**. Esperamos volver a verte pronto.',
      banMessage: '**{user}** ha sido banead@ del servidor.'
    }
  },
  wrong_channel: 'El comando que has enviado no se puede usar en ese canal.',
  message_deleted: 'Mensaje eliminado',
  you_must_send_an_emoji: 'Debes enviar un emoji.',
  couldn_t_find_that_emoji: 'No he podido encontrar ese emoji.',
  type_one_or_two_users: 'Escribe uno o dos usuarios.',
  self_love: 'Sé que el amor propio es importante, pero no seas narcisista.',
  lovemeter_messages: [
    'Lamentable.',
    'Nada compatibles.',
    'Muy bajo... Solo amigos.',
    'Posiblemente queden como solo amigos.',
    'Muy poco probable pero puede que haya algo.',
    'Es probable que haya algo, pero no quiero dar ilusiones.',
    'Es bastante probable que haya algo. Se puede intentar.',
    'Bastante compatibles. Podrían ser una linda pareja.',
    'Estos dos están liados seguro.',
    'Pueden llegar a ser una hermosa pareja.',
    'Están destinados a estar juntos para siempre.'
  ],
  nsfw_only: 'Este comando solo puede ser enviado a un canal NSFW.',
  requested_by: 'Solicitado por',
  how_to_delete: 'Pulsa aquí si la imagen es inapropiada.',
  please_report: 'Por favor, reporta esta imagen para que no vuelva a aparecer.',
  role_info: 'Información del rol:',
  name: 'Nombre',
  color: 'Color',
  member_count: 'Número de miembros',
  date_created: 'Fecha en la que fue creado',
  couldn_t_find_that_user: 'No he podido encontrar a ese usuario.',
  user_info: 'Información de usuario:',
  user_id: 'ID de usuario',
  server_join_date: 'Fecha de ingreso al servidor',
  account_creation_date: 'Fecha de creación de la cuenta',
  roles: 'Roles',
  avatar: (user) => `Avatar de ${user}`,
  bulk_delete_two_weeks: 'No se pueden eliminar mensajes enviados hace más de dos semanas.',
  bulk_delete_missing_permissions: 'No tengo permiso para borrar mensajes en este canal.',
  bulk_delete_max_100: 'Solo puedes borar menos de 100 mensajes de golpe.',
  no_images_found: 'No se ha podido encontrar ninguna imagen.',
  jump_to_moment: 'Saltar al momento',
  the_current_prefix_for_this_server_is: (prefix) => `El prefijo actual de este servidor es ${prefix}`,
  change_prefix_to: (prefix) => `¿Cambiar el prefijo a **${prefix}**?`,
  prefix_was_changed_to: (prefix) => `El prefijo fue cambiado a **${prefix}**`,
  valid_modules: 'Módulos válidos',
  available_languages: 'Idiomas disponibles',
  boop_title: (user) => `${user[0]} le ha hecho boop a ${user[1]}`,
  boop_self: (user) => `${user} se ha hecho boop a sí mism@`,
  boop_chrysalis: (user) => `${user} trató de hacerle boop a Chrysalis`,
  attack_title: (user) => `${user[0]} Attacked ${user[1]}!`,
  attack_self: (user) => `${user} Attacked themself`,
  attack_chrysalis: (user) => `${user} Tried to attack Chrysalis`,
  hug_title: (user) => `${user[0]} ha abrazado a ${user[1]}`,
  hug_self: (user) => `${user} se ha abrazado a sí mism@`,
  hug_chrysalis: (user) => `${user} trató de abrazar a Chrysalis`,
  kiss_title: (user) => `${user[0]} le ha dado un beso a ${user[1]}`,
  kiss_self: (user) => `${user} se ha besado a sí mism@`,
  kiss_chrysalis: (user) => `${user} intentó besar a Chrysalis`,
  server_info: 'Información del servidor:',
  server_id: 'ID del servidor',
  server_owner: 'Propietari@ del servidor',
  channels: 'Canales',
  server_boosts: 'Mejoras del servidor',
  image_source: 'Fuente de la imagen',
  please_specify_a_new_value: 'Por favor, especifica un nuevo valor.',
  value_must_be_true_or_false: 'El valor debe ser **true** o **false**.', // Do NOT translate **true** and **false**
  module_updated: '¡Módulo actualizado!',
  attachments: 'Archivos adjuntos',
  message_id: 'ID del mensaje',
  module_enabled: (m) => `Módulo ${m} habilitado.`,
  module_disabled: (m) => `Módulo ${m} deshabilitado.`,
  module_already_enabled: (m) => `El módulo ${m} ya estaba habilitado.`,
  module_already_disabled: (m) => `El módulo ${m} ya estaba deshabilitado.`,
  current_color: 'Color actual',
  change_color_to: (hex) => `¿Cambiar color a ${hex}?`,
  invalid_color: 'Color no válido.',
  color_was_changed_to: (hex) => `Se ha cambiado el color a ${hex}`,
  role_menu: 'Menú de roles',
  select_the_roles_that_you_want: 'Selecciona los roles que quieras',
  no_valid_roles_found: 'No se han encontrado roles válidos. Escribe IDs de roles separadas por saltos de línea.',
  you_can_only_add_up_to_25_roles_to_the_menu: 'Solo puedes añadir hasta 25 roles al menú.',
  invalid_roles_skipped: 'Se han omitido los roles inválidos.',
  manage_roles_permission_required: 'Chrysalis necesita el permiso `MANAGE_ROLES` para que los menús de roles funcionen.',
  chrysalis_role_too_low: 'El rol de Chrysalis está por debajo del rol que estás solicitando. Por favor, contacta a un administrador para que lo arregle.',
  roles_managed_by_integrations_cannot_be_manually_assigned: 'Los roles administrados por integraciones no pueden ser asignados manualmente.',
  download_emoji: 'Descargar emoji',
  please_type_a_valid_channel: 'Por favor, escribe un canal válido.',
  invalid_channel: 'Al menos uno de los canales que has introducido es inválido.',
  invite_the_bot: 'Invita al bot',
  website: 'Página web',
  support_server: 'Servidor de soporte',
  source_code: 'Código fuente',
  support_the_project: 'Apoya el proyecto',
  unkown_role: 'No he podido encontrar ese rol.',
  role_id: 'ID del rol',
  welcome: '¡Bienvenid@!',
  you_are_the_member_n: (n) => `Eres el miembro Nº${n}`,
  filter_not_found: 'Filtro no encontrado. Por favor, asegúrate  de que el filtro es público.',
  help_time_out: 'El tiempo para pasar las páginas se ha acabado.',
  old_message: 'Mensaje viejo',
  new_message: 'Mensaje nuevo',
  old_attachments: 'Antiguos archivos adjuntos',
  new_attachments: 'Nuevos archivos adjuntos',
  message_edited: 'Mensaje editado',
  season: 'Temporada',
  seasons: 'Temporadas',
  movies: 'Películas',
  torrent_footer: 'Chrysalis recomienda usar qBitTorrent, ya que no contiene anuncios y es de código abierto. Los enlaces son proporcionados por yayponies.no /)',
  error_fetching_episodes: 'No se han podido obtener los episodios en este momento. Por favor, inténtalo más tarde.',
  attach_files_permission_missing: 'Chrysalis no tiene permiso para enviar imágenes a este canal.',
  embed_links_permission_missing: 'Chrysalis no tiene permiso para enviar embeds a este canal. Por favor, dale a Chrysalis el permiso de "Insertar enlaces"',
  please_type_a_valid_positive_integer: 'Por favor, escribe un número entero positivo.',
  module_property_not_found: 'Propiedad del módulo no encontrada.',
  levelup: (level) => `**¡Has subido de nivel!**\nAhora eres nivel **${level}**.`,
  leaderboard_title: 'Tabla de clasificación',
  level: 'Nivel',
  rank: 'Rango',
  total_xp: 'XP total',
  profile: 'Perfil',
  background_image: 'Imagen de fondo',
  profile_updated: '¡Perfil actualizado!',
  unsupported_image_type: 'Tipo de imagen no soportado.',
  check_documentation: 'Haz clic en el nombre del módulo para abrir la documentación de este módulo.',
  import_levels_from: '¿De qué bot quieres importar los niveles?',
  no_levels_found: (bot) => `No se han encontrado niveles de ${bot} en este servidor.`,
  mee6_fix: (guildID) => `Por favor, asegúrate de que tu tabla de clasificación de MEE6 es pública activando [esta opción](https://mee6.xyz/dashboard/${guildID}/leaderboard).`,
  xp_migration_adapt: 'La forma en que Chrysalis calcula niveles puede ser distinta a la de otros bots. ¿Qué quieres hacer?',
  import_levels_and_adapt_xp: 'Importar niveles y adaptar XP',
  import_xp_and_adapt_levels: 'Importar XP y adaptar niveles',
  import_leaderboard: 'La tabla de clasificacion quedará tal que así:',
  migration_complete: '¡Transferencia completada!',
  xp_successfully_imported: 'La XP se ha importado correctamente.',
  edit: 'Editar',
  enabled: 'Habilitado',
  logDeletedMessages: 'Registrar mensajes borrados',
  logEditedMessages: 'Registrar mensajes editados',
  words: 'Palabras/frases (separar por saltos de línea)',
  title: 'Título',
  description: 'Descripción',
  reactToLinks: 'Reaccionar a enlaces',
  reactToFiles: 'Reaccionar a archivos',
  approvalEmoji: 'Emoji de aprobación',
  disapprovalEmoji: 'Emoji de desaprobación',
  restricted: 'Comando restringido a ciertos canales',
  allowedChannels: 'Canales en los que está permitido su uso',
  filter: 'Filtro',
  background: 'Fondo',
  banMessage: 'Mensaje de ban',
  xpBlacklistChannels: 'Canales donde no se puede ganar XP',
  xpPerMessage: 'XP ganada por mensaje',
  messageCooldown: 'Tiempo entre mensajes para ganar XP (en seg)',
  xpInVoiceChat: 'XP ganada en VC (canales de voz)',
  voiceChatCooldown: 'Cada cuántos segundos ganar XP en VC',
  announceLevelUp: 'Anunciar subidas de nivel',
  announceLevelUpChannel: 'Canal en el que anunciar subidas de nivel',
  module_time_out: 'El tiempo para editar este módulo se ha acabado.',
  use_modal_instead: 'Las palabras bloqueadas no se pueden editar así. Por favor, utiliza el botón de Editar.',
  bannedwords_deprecated: 'Este comando está obsoleto. Para editar las palabras bloqueadas, utiliza `c!config bannedwords` y haz clic en el botón de Editar.',
  messages_deleted: (n) => `¡${n} mensaje${n>1?'s':''} eliminado${n>1?'s':''}! ${emojis.PinkiePieYes}`,
  optional: 'opcional',
  click_to_open_modal: 'Debido a que no estás usando un comando de barra diagonal, tendrás que pulsar este botón para abrir el menú.',
  sendMessageOnDelete: 'Enviar MD después de borrar',
  ignoreAdmins: 'Ignorar mensajes de admins'
}
