import fetch from 'node-fetch'
import FormData from 'form-data'
import fs from 'fs'

let handler = async (ctx) => {
  if (!fs.existsSync('./temp')) {
    fs.mkdirSync('./temp')
  }

  try {
    const reply = ctx.message?.reply_to_message
    const photo = reply?.photo?.pop()
    if (!photo)
      return ctx.reply('🍄 Por favor, responde a una *imagen* con el comando /hd.')

    await ctx.reply('🍃 *Mejorando la calidad de la imagen...* ✧')

    const fileLink = await ctx.telegram.getFileLink(photo.file_id)
    const inputPath = `./temp/input_${Date.now()}.jpg`
    const outputPath = `./temp/output_${Date.now()}.jpg`

    const res = await fetch(fileLink.href)
    const imgBuffer = Buffer.from(await res.arrayBuffer())
    fs.writeFileSync(inputPath, imgBuffer)

    const formatSize = (bytes) => {
      if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(2)} KB`
      else
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    }

    const originalSize = fs.statSync(inputPath).size

    const form = new FormData()
    form.append('image', fs.createReadStream(inputPath))
    form.append('scale', '2')

    const headers = {
      ...form.getHeaders(),
      accept: 'application/json',
      'x-client-version': 'web',
      'x-locale': 'en'
    }

    const upscale = await fetch('https://api2.pixelcut.app/image/upscale/v1', {
      method: 'POST',
      headers,
      body: form
    })

    const json = await upscale.json()
    if (!json?.result_url?.startsWith('http'))
      throw new Error('No se pudo obtener el resultado de Pixelcut.')

    const finalRes = await fetch(json.result_url)
    const finalBuffer = Buffer.from(await finalRes.arrayBuffer())
    fs.writeFileSync(outputPath, finalBuffer)

    const enhancedSize = fs.statSync(outputPath).size
    const diff = enhancedSize - originalSize
    const diffText = diff >= 0 ? `+${formatSize(diff)}` : `${formatSize(diff)}`

    await ctx.replyWithPhoto({ source: outputPath }, {
      caption: `🍃 *𝙸𝙼𝙰𝙶𝙴𝙽 𝙼𝙴𝙹𝙾𝚁𝙰𝙳𝙰 𝙴𝙽 𝙷𝙳* 🚀\n\n` +
               `📦 *Tamaño original:* ${formatSize(originalSize)}\n` +
               `📈 *Tamaño mejorado:* ${formatSize(enhancedSize)}\n` +
               `📊 *Diferencia:* ${diffText}\n\n` +
               `> Potenciado por *Shadow TG*`,
      parse_mode: 'Markdown'
    })

    fs.unlinkSync(inputPath)
    fs.unlinkSync(outputPath)
  } catch (err) {
    console.error(err)
    ctx.reply(`❌ *Ocurrió un error:*\n> ${err.message}`)
  }
}

handler.command = ['hd', 'remini', 'enhance']
export default handler