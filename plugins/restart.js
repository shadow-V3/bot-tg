import chalk from 'chalk'
import { exec } from 'child_process'

const handler = async (ctx, { conn }) => {
  try {
    const user = ctx.from?.username || ctx.from?.first_name || 'Usuario'
    await ctx.reply('♻️ Reiniciando el bot, espera unos segundos...')

    console.log(chalk.yellow(`⚙️ Reinicio solicitado por: ${user}`))

    // Pequeño delay antes de reiniciar
    setTimeout(() => {
      exec('pm2 restart all || npm run start || node index.js', (error, stdout, stderr) => {
        if (error) {
          console.error(chalk.red('❌ Error al reiniciar:'), error)
          return
        }
        console.log(chalk.green('✅ Bot reiniciado correctamente.'))
        console.log(stdout || stderr)
        process.exit(0) // Finaliza el proceso actual
      })
    }, 2000)

  } catch (err) {
    console.error(chalk.red('❌ Error en /restart:'), err)
    await ctx.reply('⚠️ Hubo un error al intentar reiniciar el bot.')
  }
}

handler.command = ['restart']
export default handler