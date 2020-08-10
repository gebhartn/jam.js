import { Client } from 'discord.js'

import { NewClient } from './client'
import { actions } from './actions'
import { events } from './events'
import { token, prefix } from './config'

export const bot = NewClient({
  client: new Client(),
  queue: new Map(),
  actions,
  prefix,
})

bot.listen({ events })
bot.initialize({ token })
