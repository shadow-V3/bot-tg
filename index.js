import { Telegraf } from 'telegraf'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import CFonts from 'cfonts'
import PromptSync from 'prompt-sync'
import ora from 'ora'
import logger from './lib/console.js'

const __dirname = process.cwd()
const prompt = PromptSync()

const sleep = (ms) => new Promise(res => setTimeout(res, ms))

console.clear()
CFonts.say('Shadow TG', {
  font: 'block',
  align: 'center',
  gradient: ['cyan', 'magenta'],
  transitionGradient: true
})

console.log(chalk.magentaBright('\n❀ Iniciando sistema Shadow TG...'))
await sleep(500)

const spinner = ora({
  text: chalk.cyan('Inicializando módulos...'),
  spinner: 'dots12',
}).start()

await sleep(1000)

const sessionPath = path.join(__dirname, 'session')
if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath)

const tokenPath = path.join(sessionPath, 'token.json')

let token
if (fs.existsSync(tokenPath)) {
  const saved = JSON.parse(fs.readFileSync(tokenPath))
  token = saved.token
  spinner.succeed(chalk.green('🔑 Token cargado automáticamente.'))
} else {
  spinner.stop()
  token = prompt(chalk.yellow('💠 Ingresa el token de tu bot de Telegram: '))
  if (!token) {
    console.log(chalk.red('❌ Token inválido.'))
    process.exit(1)
  }
  fs.writeFileSync(tokenPath, JSON.stringify({ token }, null, 2))
  console.log(chalk.greenBright('💾 Token guardado para futuros inicios.'))
}

const bot = new Telegraf(token)

spinner.start(chalk.cyan('Cargando plugins...'))
global.plugins = {}
const pluginsPath = path.join(__dirname, 'plugins')
if (!fs.existsSync(pluginsPath)) fs.mkdirSync(pluginsPath)

const pluginFiles = fs.readdirSync(pluginsPath).filter(f => f.endsWith('.js'))

for (const file of pluginFiles) {
  try {
    const pluginModule = await import(`file://${path.join(pluginsPath, file)}`)
    const handler = pluginModule.default
    if (!handler) continue

    global.plugins[file] = handler

    if (handler.command) {
      handler.command.forEach(cmd => {
        bot.command(cmd, async ctx => {
          try {
            await handler(ctx, { conn: bot })
          } catch (err) {
            console.error(chalk.red(`❌ Error en comando ${cmd}:`), err)
            ctx.reply('⚠️ Error al ejecutar este comando.')
          }
        })
      })
    }

    console.log(chalk.greenBright(`✅ Plugin cargado: ${file}`))
  } catch (err) {
    console.error(chalk.red(`❌ Error al cargar plugin ${file}:`), err)
  }
}

spinner.succeed(chalk.greenBright('✨ Todos los plugins cargados correctamente.'))
await sleep(500)

bot.on('message', async ctx => {
  try {
    await logger(ctx, bot)
  } catch (e) {
    console.error(chalk.red('⚠️ Error en logger:'), e)
  }
})


bot.start(ctx => {
  const nombre = ctx.from?.first_name || 'Usuario'
  const texto = `
╭━━━〔 ⚡ *Shadow TG* ⚡ 〕━━⬣
│👋 Hola *${nombre}*!
│
│Bienvenido a *Shadow TG*, tu bot modular estilo MD para Telegram.
│Usa /menu para ver todos los comandos disponibles.
╰━━━━━━━━━━━━━━━━━━⬣
`
  ctx.reply(texto, { parse_mode: 'Markdown' })
})

try {
  spinner.start(chalk.cyan('Conectando con Telegram...'))
  await bot.launch()
  spinner.succeed(chalk.cyanBright('🚀 Shadow TG está en línea y listo.'))
} catch (err) {
  spinner.fail(chalk.red('❌ Error al iniciar el bot.'))
  console.error(err)
  process.exit(1)
}

// 🧩 Detener correctamente al cerrar
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))