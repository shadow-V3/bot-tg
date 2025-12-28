import axios from 'axios'

const handler = async (ctx) => {
  try {
    const text = ctx.message.text.split(' ').slice(1).join(' ')
    if (!text)
      return ctx.reply(
        '📦 *Descarga MediaFire*\n\n' +
        'Ejemplo:\n' +
        '`/mediafire https://www.mediafire.com/file/...`',
        { parse_mode: 'Markdown' }
      )

    if (!/mediafire\.com/i.test(text))
      return ctx.reply('❌ El enlace no es de MediaFire.')

    await ctx.reply('⏳ *Procesando enlace...*', { parse_mode: 'Markdown' })

    const apiUrl = `https://akirax-api.vercel.app/download/mediafire?url=${encodeURIComponent(text)}`
    const { data } = await axios.get(apiUrl, { timeout: 15000 })

    if (!data.status || !data.result?.downloadUrl)
      return ctx.reply('❌ No se pudo obtener el archivo.')

    const { fileName, downloadUrl } = data.result

    // Obtener tamaño (opcional)
    let sizeStr = 'Desconocido'
    try {
      const head = await axios.head(downloadUrl)
      const size = head.headers['content-length']
      if (size) sizeStr = formatSize(parseInt(size))
    } catch {}

    await ctx.reply(
      `📁 *Archivo:* ${fileName}\n💾 *Tamaño:* ${sizeStr}\n⬇️ *Descargando...*`,
      { parse_mode: 'Markdown' }
    )

    // Descargar en memoria
    const res = await axios.get(downloadUrl, {
      responseType: 'arraybuffer',
      timeout: 0
    })

    await ctx.replyWithDocument(
      {
        source: Buffer.from(res.data),
        filename: fileName
      },
      {
        caption: `📦 *${fileName}*\n💾 ${sizeStr}`,
        parse_mode: 'Markdown'
      }
    )

    await ctx.reply('✔️ *Archivo enviado correctamente.*', { parse_mode: 'Markdown' })

  } catch (e) {
    console.error(e)
    await ctx.reply(`❌ Error:\n${e.message}`)
  }
}

handler.command = ['mediafire', 'mf']
export default handler

function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024
    i++
  }
  return `${bytes.toFixed(2)} ${units[i]}`
}