import chalk from 'chalk'
import { exec } from 'child_process'

// 🔒 ID del dueño (solo él puede usar /update)
const OWNER_ID = 7569323322 // <-- pon tu ID aquí

const handler = async (ctx) => {
  const userId = ctx.from?.id
  const replyOptions = { 
    parse_mode: 'Markdown',
    reply_to_message_id: ctx.message?.message_id
  }

  // 🚫 Restringir el comando a solo el owner
  if (OWNER_ID && userId !== OWNER_ID) {
    return ctx.reply('🚫 *No tienes permiso para usar este comando.*', replyOptions)
  }

  await ctx.reply('⚙️ *Iniciando proceso de actualización...*\n_Esto puede tardar unos segundos._', replyOptions)
  console.log(chalk.cyan('\n🔄 Ejecutando "git pull" para actualizar el bot...\n'))

  exec('git pull', async (error, stdout, stderr) => {
    if (error) {
      console.error(chalk.redBright('❌ [UPDATE ERROR]'), error)
      await ctx.reply(`❌ *Error durante la actualización:*\n\`\`\`${error.message}\`\`\``, replyOptions)
      return
    }

    // Mostrar resultado del pull
    console.log(chalk.gray('📜 Resultado del pull:\n') + chalk.white(stdout))

    if (stderr && !stdout.includes('Already up to date.')) {
      console.warn(chalk.yellow('⚠️ [UPDATE WARNING]'), stderr)
    }

    if (stdout.includes('Already up to date.')) {
      await ctx.reply('✅ *El bot ya está completamente actualizado.*', replyOptions)
      console.log(chalk.green('✅ Sin cambios detectados.'))
    } else {
      await ctx.reply(
        `🌿 *Actualización completada con éxito.*\n\n📜 *Cambios aplicados:*\n\`\`\`\n${stdout.trim()}\n\`\`\`\n\n> ⚠️ *Reinicio manual requerido si se actualizaron archivos base.*`,
        replyOptions
      )

      console.log(chalk.greenBright('\n✨ Archivos actualizados con éxito:'))
      stdout.split('\n').forEach(line => {
        if (line.includes('modified:')) console.log(chalk.yellow('🛠️ ' + line.trim()))
        else if (line.includes('new file:')) console.log(chalk.green('🆕 ' + line.trim()))
        else if (line.includes('deleted:')) console.log(chalk.red('🗑️ ' + line.trim()))
      })

      console.log(chalk.blueBright('\n⚠️ Reinicio manual necesario para aplicar los cambios.\n'))
    }
  })
}

handler.command = ['update', 'fix', 'actualizar']
handler.help = ['update', 'fix', 'actualizar']
handler.tags = ['owner']

export default handler