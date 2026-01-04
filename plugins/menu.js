let handler = async (ctx) => {
  const uptime = process.uptime()
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return `${h}h ${m}m ${s}s`
  }

  const botInfo = {
    nombre: '🤖 Shadow TG',
    version: '1.1.0',
    creador: '🧠 DvShadow',
    lenguaje: '📜 JavaScript (Node.js)',
    uptime: formatTime(uptime),
    comandos: 25,
    usuarios: 120
  }

  const texto = `
╭━━━〔 *📜 Shadow TG - Menú Principal 🌹* 〕━━━⬣
│
│ *🌟 Nombre:* ${botInfo.nombre}
│ *📦 Versión:* ${botInfo.version}
│ *👨‍💻 Creador:* ${botInfo.creador}
│ *⚙️ Lenguaje:* ${botInfo.lenguaje}
│ *⏰ Uptime:* ${botInfo.uptime}
│ *🧩 Comandos:* ${botInfo.comandos}
│ *👥 Usuarios:* ${botInfo.usuarios}
│
╰━━━〔 *⚡ Comandos Disponibles ⚡* 〕━━━⬣
┃
┃ /ping -- /p
┃ /ytmp4 
┃ /ytmp3 
┃ /restart (owner)
┃ /uptime
┃ /hd
┃ /status
┃ /update / owner
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌿 *Gracias por usar Shadow TG* 🌿
╭───────────────⬣
│ 🌙 *Shadow TG* v${botInfo.version}
│ 💻 *Powered by:* Node.js
│ 🪶 *Creado por:* DvShadow
│ 📆 *Última actualización:* ${new Date().toLocaleDateString('es-PE')}
╰───────────────⬣
`

  const botones = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🌐 GitHub', url: 'https://github.com/shadox-xyz' },
          { text: '💬 Contacto', url: 'https://wa.me/51919199630' }
        ],
        [
          { text: '🪄 Canal Oficial', url: 'https://whatsapp.com/channel/0029VbC34Nt42DchIWA0q11f' }
        ]
      ]
    },
    parse_mode: 'Markdown',
    reply_to_message_id: ctx.message?.message_id
  }

  const imagen = 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1766617406305_472904.jpeg'

  await ctx.replyWithPhoto(imagen, {
    caption: texto,
    ...botones
  })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help', 'allmenú', 'allmenu', 'menucompleto']

export default handler