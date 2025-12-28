import fetch from 'node-fetch'
import yts from 'yt-search'
import axios from 'axios'
import fs from 'fs'

const handler = async (ctx) => {
  try {
    const text = ctx.message.text.split(' ').slice(1).join(' ')
    if (!text)
      return ctx.reply('🌹 Ingresa el nombre o enlace del video.\n\nEjemplo:\n`/ytmp4 Believer`', { parse_mode: 'Markdown' })

    await ctx.reply('⏳ *Buscando en YouTube...*', { parse_mode: 'Markdown' })

    const search = await yts(text)
    const video = search.videos[0]
    if (!video) return ctx.reply('☁️ No se encontró ningún resultado.')

    const meta = {
      title: video.title,
      duration: video.timestamp,
      url: video.url,
      author: video.author?.name || 'Desconocido',
      views: video.views?.toLocaleString('es-PE') || '0',
      ago: video.ago || 'Desconocido',
      thumbnail: video.thumbnail
    }

    // 🛰 APIs para descargar VIDEO
    const apis = [
      {
        api: 'Vreden',
        endpoint: `https://api.vreden.my.id/api/v1/download/youtube/video?url=${encodeURIComponent(meta.url)}&quality=480`,
        extractor: res => res.result?.download?.url
      },
      {
        api: 'ZenzzXD v2',
        endpoint: `https://api.zenzxz.my.id/api/downloader/ytmp4v2?url=${encodeURIComponent(meta.url)}`,
        extractor: res => res.data?.download_url
      },
      {
        api: 'LolHuman',
        endpoint: `https://api.lolhuman.xyz/api/ytaudio2?apikey=genius&url=${encodeURIComponent(meta.url)}`,
        extractor: res => res.result?.video?.link
      },
      {
        api: 'Neki',
        endpoint: `https://api.neki.xyz/api/ytmp4?url=${encodeURIComponent(meta.url)}`,
        extractor: res => res.result?.url
      }
    ]

    const { url: downloadUrl, servidor } = await fetchFromApis(apis)
    if (!downloadUrl) return ctx.reply('❌ Ninguna API devolvió el video.')

    const size = await getSize(downloadUrl)
    const sizeStr = size ? formatSize(size) : 'Desconocido'

    const textoInfo = `
🌿 *Título:* ${meta.title}
🕒 *Duración:* ${meta.duration}
💾 *Tamaño:* ${sizeStr}
🎥 *Calidad:* 480p
📡 *Canal:* ${meta.author}
👁 *Vistas:* ${meta.views}
📅 *Publicado:* ${meta.ago}
🛠 *Servidor:* ${servidor}
────────────────────
🌸 *Procesando tu video...*
`

    // Miniatura
    const thumbPath = `./tmp/thumb_${Date.now()}.jpg`
    const thumbBuffer = await fetch(meta.thumbnail).then(r => r.arrayBuffer())
    fs.writeFileSync(thumbPath, Buffer.from(thumbBuffer))

    await ctx.replyWithPhoto({ source: thumbPath }, { caption: textoInfo, parse_mode: 'Markdown' })

    // Descargar video real
    const videoRes = await axios.get(downloadUrl, { responseType: 'arraybuffer' })
    const videoPath = `./tmp/${Date.now()}.mp4`
    fs.writeFileSync(videoPath, Buffer.from(videoRes.data))

    await ctx.replyWithVideo({ source: videoPath }, {
      caption: `🎬 *${meta.title}*\n> ${meta.author}\n🌐 ${meta.url}`,
      parse_mode: 'Markdown'
    })

    fs.unlinkSync(videoPath)
    fs.unlinkSync(thumbPath)

    await ctx.reply('✔️ *Video enviado correctamente.*', { parse_mode: 'Markdown' })
  } catch (e) {
    console.error(e)
    await ctx.reply(`❌ Error: ${e.message}`)
  }
}

handler.command = ['ytmp4', 'video', 'pamy']
export default handler

// Funciones auxiliares
async function fetchFromApis(apis) {
  for (const api of apis) {
    try {
      const res = await axios.get(api.endpoint, { timeout: 15000 })
      const url = api.extractor(res.data)
      if (url) return { url, servidor: api.api }
    } catch (e) {
      continue
    }
  }
  return { url: null, servidor: 'Ninguno' }
}

async function getSize(url) {
  try {
    const response = await axios.head(url)
    const length = response.headers['content-length']
    return length ? parseInt(length, 10) : null
  } catch {
    return null
  }
}

function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  if (!bytes || isNaN(bytes)) return 'Desconocido'
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024
    i++
  }
  return `${bytes.toFixed(2)} ${units[i]}`
}