import chalk from 'chalk'
import moment from 'moment'

moment.locale('es')

const hora = () => chalk.gray(`[${moment().format('HH:mm:ss')}]`)

export default async function logger(ctx, conn) {
  try {
    const user = ctx.from
    const chat = ctx.chat
    const msg = ctx.update.message || {}
    const text = msg.text || ''
    const entities = msg.entities || []

    const command = entities.some(e => e.type === 'bot_command')
      ? text.split(' ')[0]
      : 'Ninguno'

    const type = msg.text
      ? '💬 Texto'
      : msg.photo
      ? '📷 Foto'
      : msg.video
      ? '🎬 Video'
      : msg.sticker
      ? '💠 Sticker'
      : msg.document
      ? '📄 Documento'
      : msg.voice
      ? '🎤 Audio'
      : '📦 Otro'

    const chatType =
      chat.type === 'group'
        ? '👥 Grupo'
        : chat.type === 'supergroup'
        ? '🏛️ Supergrupo'
        : '💬 Privado'

    const border = chalk.hex('#7C3AED').bold('╭──────────────────────────────────────────────')
    const borderEnd = chalk.hex('#7C3AED').bold('╰──────────────────────────────────────────────')

    console.log(border)
    console.log(`${chalk.hex('#7C3AED').bold('│')} ${hora()} ${chalk.bold('🕒 Registro de mensaje')}`)
    console.log(`${chalk.hex('#7C3AED').bold('│')} ${chalk.bold('👤 Usuario:')} ${chalk.greenBright(user.first_name || 'Desconocido')} ${user.username ? chalk.gray(`(@${user.username})`) : ''}`)
    console.log(`${chalk.hex('#7C3AED').bold('│')} ${chalk.bold('🆔 ID:')} ${chalk.yellowBright(user.id)}`)
    console.log(`${chalk.hex('#7C3AED').bold('│')} ${chalk.bold('🌐 Chat:')} ${chalk.magentaBright(chat.title || chat.id)} (${chalk.cyan(chatType)})`)
    console.log(`${chalk.hex('#7C3AED').bold('│')} ${chalk.bold('💬 Tipo de mensaje:')} ${chalk.whiteBright(type)}`)
    console.log(`${chalk.hex('#7C3AED').bold('│')} ${chalk.bold('⚙️ Comando:')} ${command !== 'Ninguno' ? chalk.greenBright(command) : chalk.gray('—')}`)
    console.log(`${chalk.hex('#7C3AED').bold('│')} ${chalk.bold('📝 Contenido:')} ${chalk.whiteBright(text.slice(0, 120) || chalk.gray('(sin texto)'))}`)
    console.log(borderEnd + '\n')
  } catch (e) {
    console.error(chalk.red('❌ Error en logger:'), e)
  }
}

export function logPluginLoad(file) {
  console.log(`${hora()} ${chalk.greenBright('✅ Plugin cargado:')} ${chalk.yellow(file)}`)
}

export function logPluginReload(file) {
  console.log(`${hora()} ${chalk.blueBright('🔄 Plugin actualizado:')} ${chalk.yellow(file)}`)
}

export function logPluginError(file, err) {
  console.log(`${hora()} ${chalk.redBright('❌ Error en plugin:')} ${chalk.yellow(file)}\n${chalk.red(err)}`)
}