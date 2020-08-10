import { bot } from './bot'
import { events } from './events'
import { token } from './config'

bot.listen({ events })
bot.initialize({ token })
