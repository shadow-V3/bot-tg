import fs from 'fs'
import fetch from 'node-fetch'

const filePath = './database/welcome.json'

// Crear carpeta y archivo si no existen
if (!fs.existsSync('./database')) fs.mkdirSync('./database')
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '{}')

let welcomeData = JSON.parse(fs.readFileSync(filePath))

// ─── Comando /welcome ──────────────────────────────────────────────
let handler = async (ctx) => {
  try {
    const chatId = ctx.chat.id
    const text = ctx.message.text.split(' ')[1]

    if (!text)
      return ctx.reply(
        '✨ Usa:\n`/welcome on` para activar\n`/welcome off` para desactivar',
        { parse_mode: 'Markdown' }
      )

    if (text === 'on') {
      welcomeData[chatId] = true
      fs.writeFileSync(filePath, JSON.stringify(welcomeData, null, 2))
      return ctx.reply('🌸 Mensajes de bienvenida ACTIVADOS')
    }

    if (text === 'off') {
      welcomeData[chatId] = false
      fs.writeFileSync(filePath, JSON.stringify(welcomeData, null, 2))
      return ctx.reply('🌙 Mensajes de bienvenida DESACTIVADOS')
    }

    return ctx.reply('❌ Usa `/welcome on` o `/welcome off`', {
      parse_mode: 'Markdown'
    })
  } catch (err) {
    console.error(err)
    ctx.reply('⚠️ Error interno al cambiar el estado del welcome.')
  }
}

handler.command = ['welcome']
handler.help = ['welcome on/off']
handler.tags = ['grupo']

export default handler

// ─── Listener de nuevos miembros ───────────────────────────────────
export async function before(ctx) {
  const chatId = ctx.chat?.id
  if (!chatId || !welcomeData[chatId]) return

  const update = ctx.update
  const newMembers = update?.message?.new_chat_members
  const leftMember = update?.message?.left_chat_member

  // Si alguien entra
  if (newMembers && newMembers.length > 0) {
    const user = newMembers[0]
    const name = user.first_name || 'Usuario'
    const username = user.username ? `@${user.username}` : name
    const photoUrl = await getUserPhoto(ctx, user.id)

    await ctx.replyWithPhoto(photoUrl || null, {
      caption: `🎉 Bienvenido ${username}!\nDisfruta tu estancia en *${ctx.chat.title}* 🌟`,
      parse_mode: 'Markdown'
    })
  }

  // Si alguien se va
  if (leftMember) {
    const user = leftMember
    const name = user.first_name || 'Usuario'
    const username = user.username ? `@${user.username}` : name
    const photoUrl = await getUserPhoto(ctx, user.id)

    await ctx.replyWithPhoto(photoUrl || null, {
      caption: `👋 Adiós ${username}!\nTe extrañaremos en *${ctx.chat.title}* 😢`,
      parse_mode: 'Markdown'
    })
  }
}

// ─── Obtener foto de perfil ────────────────────────────────────────
async function getUserPhoto(ctx, userId) {
  try {
    const photos = await ctx.telegram.getUserProfilePhotos(userId, { limit: 1 })
    if (!photos.total_count) return null
    const fileId = photos.photos[0][0].file_id
    const file = await ctx.telegram.getFile(fileId)
    return `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`
  } catch {
    return null
  }
}