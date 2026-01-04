// start-telegram.js

let handler = async (ctx) => {
  try {
    const user = ctx.from
    const username = user.username
      ? `@${user.username}`
      : user.first_name || 'Usuario'

    const botname = global.botname || 'MiBot'
    const unpush = global.unpush || '🚀'

    const imageUrl =
      'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/bot-start.jpg' // cambia si quieres

    const caption = `
👋 *Hola ${username}*

Soy *${botname}* ${unpush}

🤖 Bot activo y listo para usar
📌 Elige una opción del menú
`.trim()

    await ctx.replyWithPhoto(imageUrl, {
      caption,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📋 Menú', callback_data: 'menu' },
            { text: '⬇️ Menú Descargas', callback_data: 'menu_descargas' }
          ],
          [
            {
              text: '🌐 GitHub',
              url: 'https://github.com/shadox-xyz'
            }
          ]
        ]
      }
    })
  } catch (e) {
    console.error('[ERROR START]', e)
    await ctx.reply('⚠️ Error al enviar el mensaje de bienvenida.')
  }
}

// comandos y prefijos
handler.command = ['start']
handler.prefix = /^[\/.#]/

export default handler