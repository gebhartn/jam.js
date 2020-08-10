import { Client } from 'discord.js'

import { makeClient } from './client'
import { actions } from './actions'
import { listenOn, listenOnce } from './events'
import { token, prefix } from './config'

const client = new Client()
const queue = new Map()

const bot = makeClient({ client, queue, prefix })

const onReady = ({ token }) => console.log('Jam is live with token: ' + token)

bot.initialize({ events: { listenOn }, actions })
bot.listen({ events: { listenOnce }, token }, onReady)
