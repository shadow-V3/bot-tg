import os from 'os'
import process from 'process'

let handler = async (ctx) => {
  try {
    const start = Date.now()
    const sent = await ctx.reply('🏓 <b>Verificando conexión...</b>', {
      parse_mode: 'HTML',
      reply_to_message_id: ctx.message?.message_id
    })

    const end = Date.now()
    const ping = end - start
    const uptime = process.uptime()
    const uptimeFormatted = formatUptime(uptime)
    const now = new Date()
    const timeString = now.toLocaleString('es-PE', { timeZone: 'America/Lima' })

    // 📊 Info del servidor (segura)
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2)
    const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2)
    const usedMem = (totalMem - freeMem).toFixed(2)

    const cpus = os.cpus() || []
    const cpuInfo = cpus.length > 0 ? cpus[0] : { model: 'Desconocido', speed: 0 }
    const platform = os.platform() || 'N/A'
    const arch = os.arch() || 'N/A'
    const nodeVersion = process.version
    const cpuCount = cpus.length || 0
    const loadAvg = os.loadavg().map(v => v.toFixed(2)).join(' | ')
    const hostname = os.hostname() || 'N/A'
    const release = os.release() || 'N/A'
    const network = os.networkInterfaces()
    const homeDir = os.homedir() || 'N/A'
    const uptimeSys = formatUptime(os.uptime() || 0)
    const rss = (process.memoryUsage().rss / 1024 / 1024).toFixed(2)
    const heap = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
    const externalIP = Object.values(network)
      .flat()
      .find(i => i && !i.internal && i.family === 'IPv4')?.address || 'N/A'

    const info = `
🌐 <b>Shadow TG — Estado del Servidor</b>
──────────────────────
🏓 <b>Ping:</b> <code>${ping}ms</code>
🕓 <b>Uptime Bot:</b> <code>${uptimeFormatted}</code>
💻 <b>Uptime Sistema:</b> <code>${uptimeSys}</code>
📅 <b>Hora actual:</b> ${timeString}

🧠 <b>RAM Total:</b> <code>${totalMem} GB</code>
⚡ <b>RAM Usada:</b> <code>${usedMem} GB</code>
💧 <b>RAM Libre:</b> <code>${freeMem} GB</code>
📦 <b>Heap usado:</b> <code>${heap} MB</code>
📊 <b>RSS:</b> <code>${rss} MB</code>

🧩 <b>CPU Modelo:</b> ${cpuInfo.model}
⚙️ <b>Cores:</b> <code>${cpuCount}</code>
🔥 <b>Velocidad:</b> <code>${cpuInfo.speed} MHz</code>
📈 <b>Carga promedio:</b> <code>${loadAvg}</code>

💾 <b>Sistema:</b> <code>${platform}</code>
🏗️ <b>Versión:</b> <code>${release}</code>
🧬 <b>Arquitectura:</b> <code>${arch}</code>
🌍 <b>Hostname:</b> ${hostname}
🏠 <b>Home:</b> ${homeDir}
🌐 <b>IP Externa:</b> <code>${externalIP}</code>
🧩 <b>Node:</b> <code>${nodeVersion}</code>
🪶 <b>PID:</b> <code>${process.pid}</code>
🧾 <b>Versión Bot:</b> <code>1.0.0</code>

🧱 <b>Directorio:</b> <code>${process.cwd()}</code>
🧰 <b>CPU (User):</b> <code>${(process.cpuUsage().user / 1000).toFixed(2)} ms</code>
🧮 <b>CPU (Sys):</b> <code>${(process.cpuUsage().system / 1000).toFixed(2)} ms</code>
📤 <b>Tmp Dir:</b> <code>${os.tmpdir()}</code>
──────────────────────
✅ <b>Shadow TG está operativo y estable.</b>
`.trim()

    await ctx.telegram.editMessageText(
      sent.chat.id,
      sent.message_id,
      undefined,
      info,
      { parse_mode: 'HTML' }
    )

  } catch (err) {
    console.error('❌ Error en /ping:', err)
    await ctx.reply(`⚠️ Error en /ping: ${err.message}`, { parse_mode: 'HTML' })
  }
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = ['ping', 'p']

export default handler

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${h}h ${m}m ${s}s`
}