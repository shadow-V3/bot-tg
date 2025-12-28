import { cpus as _cpus, totalmem, freemem, platform, hostname } from 'os'
import { sizeFormatter } from 'human-readable'

let format = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`
})

let handler = async (ctx, { conn }) => {
  let system = `*「✦」Estado del Sistema*\n\n` +
    `◇ *Sistema* » ${platform()}\n` +
    `◇ *CPU* » ${_cpus().length} cores\n` +
    `◇ *RAM* » ${format(totalmem())}\n` +
    `◇ *RAM Usado* » ${format(totalmem() - freemem())}\n` +
    `◇ *Arquitectura* » ${process.arch}\n` +
    `◇ *Host ID* » ${hostname().slice(0, 8)}...\n` +
    `\n*❑ Uso de Memoria NODEJS*\n` +
    `◈ *Ram Utilizada* » ${format(process.memoryUsage().rss)}\n` +
    `◈ *Heap Reservado* » ${format(process.memoryUsage().heapTotal)}\n` +
    `◈ *Heap Usado* » ${format(process.memoryUsage().heapUsed)}\n` +
    `◈ *Módulos Nativos* » ${format(process.memoryUsage().external)}\n` +
    `◈ *Buffers de Datos* » ${format(process.memoryUsage().arrayBuffers)}`

  await ctx.reply(system, { parse_mode: 'Markdown' })
}

handler.help = ['estado']
handler.tags = ['info']
handler.command = ['estado', 'status']

export default handler