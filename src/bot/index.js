import { Client } from 'discord.js'
import { prefix } from '../config'
import { execute, skip, stop } from '../actions'
import { buildMakeClient } from '../client'

const makeClient = buildMakeClient({
  prefix,
})

const actions = {
  execute,
  skip,
  stop,
}

export const bot = makeClient({
  client: new Client(),
  queue: new Map(),
  actions,
})
