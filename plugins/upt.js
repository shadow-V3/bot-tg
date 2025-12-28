// uptime-telegram.js
let handler = async (ctx) => {
  try {
    // Obtenemos el uptime en segundos
    const uptime = process.uptime()

    // Función para formatear el tiempo
    const formatUptime = (seconds) => {
      const pad = (s) => (s < 10 ? '0' + s : s)
      const days = Math.floor(seconds / 86400)
      seconds %= 86400
      const hours = Math.floor(seconds / 3600)
      seconds %= 3600
      const minutes = Math.floor(seconds / 60)
      seconds = Math.floor(seconds % 60)
      return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`
    }

    const uptimeText = `
⏱️ *Tiempo Online del Bot:* 
${formatUptime(uptime)}

🔥 ¡Sigo activo y listo para tus comandos!
`.trim()

    await ctx.reply(uptimeText, { parse_mode: 'Markdown' })
  } catch (e) {
    console.error("[ERROR UPTIME]", e)
    await ctx.reply('⚠️ No se pudo obtener el tiempo online.')
  }
}

// Comando(s)
handler.command = ['uptime']
export default handler